import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { db } from "../firebase/config";
import { ServiceRequest } from "../types/service-request";

const REQUESTS_PER_PAGE = 15;

interface ServiceRequestWithDetails {
  serviceRequest: ServiceRequest;
  provider?: any;
  customer?: any;
}

export function useServiceRequestsPaginated(
  userId: string,
  userType: "customer" | "provider",
  status: string | string[]
) {
  const [requests, setRequests] = useState<ServiceRequestWithDetails[]>([]);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRequests = useCallback(
    async (reset = false) => {
      if (!userId) return;
      if (!reset && (!hasMore || isLoadingMore)) return;

      const isFirstLoad = reset || requests.length === 0;
      if (isFirstLoad) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const requestsRef = collection(db, "serviceRequests");
        const userField = userType === "customer" ? "customerId" : "providerId";

        let q = query(
          requestsRef,
          where(userField, "==", userId),
          orderBy("createdAt", "desc"),
          limit(REQUESTS_PER_PAGE)
        );

        if (Array.isArray(status)) {
          q = query(
            requestsRef,
            where(userField, "==", userId),
            where("status", "in", status),
            orderBy("createdAt", "desc"),
            limit(REQUESTS_PER_PAGE)
          );
        } else {
          q = query(
            requestsRef,
            where(userField, "==", userId),
            where("status", "==", status),
            orderBy("createdAt", "desc"),
            limit(REQUESTS_PER_PAGE)
          );
        }

        if (!reset && lastDoc) {
          q = query(
            requestsRef,
            where(userField, "==", userId),
            Array.isArray(status)
              ? where("status", "in", status)
              : where("status", "==", status),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(REQUESTS_PER_PAGE)
          );
        }

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setHasMore(false);
          setIsLoading(false);
          setIsLoadingMore(false);
          if (reset) setRequests([]);
          return;
        }

        const newRequests: ServiceRequestWithDetails[] = [];

        for (const doc of snapshot.docs) {
          const requestData = { id: doc.id, ...doc.data() } as ServiceRequest;

          let detailsData: any = null;
          const detailsField =
            userType === "customer"
              ? requestData.providerId
              : requestData.customerId;

          if (detailsField) {
            const usersRef = collection(db, "users");
            const userQuery = query(
              usersRef,
              where("__name__", "==", detailsField)
            );
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
              detailsData = {
                id: userSnapshot.docs[0].id,
                ...userSnapshot.docs[0].data(),
              };
            }
          }

          newRequests.push({
            serviceRequest: requestData,
            [userType === "customer" ? "provider" : "customer"]: detailsData,
          });
        }

        if (reset) {
          setRequests(newRequests);
        } else {
          setRequests((prev) => [...prev, ...newRequests]);
        }

        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === REQUESTS_PER_PAGE);
        setError(null);
      } catch (err) {
        console.error("Error loading service requests:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [userId, userType, status, lastDoc, hasMore, isLoadingMore, requests.length]
  );

  const loadMore = useCallback(() => {
    loadRequests(false);
  }, [loadRequests]);

  const refresh = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    loadRequests(true);
  }, [loadRequests]);

  return {
    requests,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    loadInitial: () => loadRequests(true),
  };
}

export function useCustomerProposalsByStatus(
  customerId: string,
  status: "pending" | "accepted"
) {
  return useServiceRequestsPaginated(customerId, "customer", status);
}

export function useCustomerAppointmentsByStatus(
  customerId: string,
  status: "confirmed" | "in-progress" | "completed" | ["cancelled", "no-show"]
) {
  return useServiceRequestsPaginated(customerId, "customer", status);
}

export function useProviderProposalsByStatus(
  providerId: string,
  status: "pending" | "accepted"
) {
  return useServiceRequestsPaginated(providerId, "provider", status);
}

export function useProviderAppointmentsByStatus(
  providerId: string,
  status: "confirmed" | "in-progress" | "completed" | ["cancelled", "no-show"]
) {
  return useServiceRequestsPaginated(providerId, "provider", status);
}
