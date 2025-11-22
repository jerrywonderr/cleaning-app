import { useInfiniteQuery } from "@tanstack/react-query";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useCallback } from "react";
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

type PaginatedResult = {
  data: ServiceRequestWithDetails[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
};

// Query key factory for better cache management
const getQueryKey = (
  userType: "customer" | "provider",
  userId: string,
  status: ServiceRequestStatus | ServiceRequestStatus[]
) => {
  const statusKey = Array.isArray(status) ? status.join("-") : status;
  return ["serviceRequests", userType, userId, statusKey] as const;
};

export function useServiceRequestsPaginated(
  userId: string,
  userType: "customer" | "provider",
  status: ServiceRequestStatus | ServiceRequestStatus[]
) {
  const query = useInfiniteQuery({
    queryKey: getQueryKey(userType, userId, status),
    queryFn: async ({
      pageParam,
    }: {
      pageParam: QueryDocumentSnapshot<DocumentData> | null;
    }) => {
      const filters =
        userType === "customer"
          ? { customerId: userId, status }
          : { providerId: userId, status };

      const result =
        userType === "customer"
          ? await ServiceRequestService.getServiceRequestsWithProviderPaginated(
              filters,
              REQUESTS_PER_PAGE,
              pageParam ?? undefined
            )
          : await ServiceRequestService.getServiceRequestsWithCustomerPaginated(
              filters,
              REQUESTS_PER_PAGE,
              pageParam ?? undefined
            );

      return result as PaginatedResult;
    },
    getNextPageParam: (lastPage: PaginatedResult) => {
      return lastPage.hasMore ? lastPage.lastDoc : null;
    },
    initialPageParam: null as QueryDocumentSnapshot<DocumentData> | null,
    enabled: !!userId,
    staleTime: 3 * 60 * 1000, // 3 minutes - data is considered fresh for 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - keep unused data in cache for 10 minutes
  });

  // Flatten all pages into a single array
  const requests =
    query.data?.pages.flatMap((page: PaginatedResult) => page.data) ?? [];

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  const refresh = useCallback(() => {
    query.refetch();
  }, [query]);

  return {
    requests,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    isRefreshing: query.isRefetching && !query.isFetchingNextPage,
    hasMore: query.hasNextPage ?? false,
    error: query.error,
    loadMore,
    refresh,
    loadInitial: refresh, // For compatibility with existing usage
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
