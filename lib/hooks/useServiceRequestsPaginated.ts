import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useCallback, useState } from "react";
import { ServiceRequestService } from "../services/serviceRequestService";
import {
  ServiceRequestStatus,
  ServiceRequestWithCustomer,
  ServiceRequestWithProvider,
} from "../types/service-request";

const REQUESTS_PER_PAGE = 15;

type ServiceRequestWithDetails =
  | ServiceRequestWithProvider
  | ServiceRequestWithCustomer;

export function useServiceRequestsPaginated(
  userId: string,
  userType: "customer" | "provider",
  status: ServiceRequestStatus | ServiceRequestStatus[]
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
        const filters =
          userType === "customer"
            ? { customerId: userId, status }
            : { providerId: userId, status };

        const result =
          userType === "customer"
            ? await ServiceRequestService.getServiceRequestsWithProviderPaginated(
                filters,
                REQUESTS_PER_PAGE,
                !reset && lastDoc ? lastDoc : undefined
              )
            : await ServiceRequestService.getServiceRequestsWithCustomerPaginated(
                filters,
                REQUESTS_PER_PAGE,
                !reset && lastDoc ? lastDoc : undefined
              );

        if (reset) {
          setRequests(result.data);
        } else {
          setRequests((prev) => [...prev, ...result.data]);
        }

        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
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
  status: ServiceRequestStatus
) {
  return useServiceRequestsPaginated(customerId, "customer", status);
}

export function useCustomerAppointmentsByStatus(
  customerId: string,
  status: ServiceRequestStatus | ServiceRequestStatus[]
) {
  return useServiceRequestsPaginated(customerId, "customer", status);
}

export function useProviderProposalsByStatus(
  providerId: string,
  status: ServiceRequestStatus
) {
  return useServiceRequestsPaginated(providerId, "provider", status);
}

export function useProviderAppointmentsByStatus(
  providerId: string,
  status: ServiceRequestStatus | ServiceRequestStatus[]
) {
  return useServiceRequestsPaginated(providerId, "provider", status);
}
