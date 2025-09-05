/**
 * Service Request Hooks
 *
 * Custom hooks for managing service requests in the cleaning app.
 * Provides easy access to service request operations and data.
 */

import { ServiceRequestService } from "@/lib/services/serviceRequestService";
import {
  CreateRatingData,
  CreateServiceRequestData,
  ServiceRequestFilters,
  UpdateServiceRequestData,
} from "@/lib/types/service-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
const SERVICE_REQUESTS_QUERY_KEY = ["serviceRequests"];
const SERVICE_REQUEST_QUERY_KEY = (id: string) => ["serviceRequest", id];
const PROVIDER_RATINGS_QUERY_KEY = (providerId: string) => [
  "providerRatings",
  providerId,
];

/**
 * Hook to get service requests with filters
 */
export function useServiceRequests(filters: ServiceRequestFilters = {}) {
  return useQuery({
    queryKey: [...SERVICE_REQUESTS_QUERY_KEY, filters],
    queryFn: () => ServiceRequestService.getServiceRequests(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get service requests with provider information
 */
export function useServiceRequestsWithProvider(
  filters: ServiceRequestFilters = {}
) {
  return useQuery({
    queryKey: [...SERVICE_REQUESTS_QUERY_KEY, "withProvider", filters],
    queryFn: () =>
      ServiceRequestService.getServiceRequestsWithProvider(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get service requests with customer information
 */
export function useServiceRequestsWithCustomer(
  filters: ServiceRequestFilters = {}
) {
  return useQuery({
    queryKey: [...SERVICE_REQUESTS_QUERY_KEY, "withCustomer", filters],
    queryFn: () =>
      ServiceRequestService.getServiceRequestsWithCustomer(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single service request by ID
 */
export function useServiceRequest(id: string) {
  return useQuery({
    queryKey: SERVICE_REQUEST_QUERY_KEY(id),
    queryFn: () => ServiceRequestService.getServiceRequest(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single service request with provider information
 */
export function useServiceRequestWithProvider(id: string) {
  return useQuery({
    queryKey: [...SERVICE_REQUEST_QUERY_KEY(id), "withProvider"],
    queryFn: () => ServiceRequestService.getServiceRequestWithProvider(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get a single service request with customer information
 */
export function useServiceRequestWithCustomer(id: string) {
  return useQuery({
    queryKey: [...SERVICE_REQUEST_QUERY_KEY(id), "withCustomer"],
    queryFn: () => ServiceRequestService.getServiceRequestWithCustomer(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to create a new service request
 */
export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequestData) =>
      ServiceRequestService.createServiceRequest(data),
    onSuccess: () => {
      // Invalidate service requests queries to refresh the list
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEY });
    },
  });
}

/**
 * Hook to update a service request
 */
export function useUpdateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateServiceRequestData;
    }) => ServiceRequestService.updateServiceRequest(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific service request and list queries
      queryClient.invalidateQueries({
        queryKey: SERVICE_REQUEST_QUERY_KEY(id),
      });
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEY });
    },
  });
}

/**
 * Hook to delete a service request
 */
export function useDeleteServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ServiceRequestService.deleteServiceRequest(id),
    onSuccess: () => {
      // Invalidate service requests queries to refresh the list
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEY });
    },
  });
}

/**
 * Hook to get provider ratings
 */
export function useProviderRatings(providerId: string) {
  return useQuery({
    queryKey: PROVIDER_RATINGS_QUERY_KEY(providerId),
    queryFn: () => ServiceRequestService.getProviderRatings(providerId),
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a rating
 */
export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRatingData) =>
      ServiceRequestService.createRating(data),
    onSuccess: (_, { providerId }) => {
      // Invalidate provider ratings to refresh the list
      queryClient.invalidateQueries({
        queryKey: PROVIDER_RATINGS_QUERY_KEY(providerId),
      });
    },
  });
}

/**
 * Hook to get customer's service requests
 */
export function useCustomerServiceRequests(customerId: string) {
  return useServiceRequestsWithProvider({ customerId });
}

/**
 * Hook to get provider's service requests
 */
export function useProviderServiceRequests(providerId: string) {
  return useServiceRequestsWithCustomer({ providerId });
}

/**
 * Hook to get pending service requests for a provider
 */
export function usePendingServiceRequests(providerId: string) {
  return useServiceRequestsWithCustomer({
    providerId,
    status: "pending",
  });
}

/**
 * Hook to get accepted service requests for a provider
 */
export function useAcceptedServiceRequests(providerId: string) {
  return useServiceRequestsWithCustomer({
    providerId,
    status: "accepted",
  });
}

/**
 * Hook to get confirmed service requests for a provider
 */
export function useConfirmedServiceRequests(providerId: string) {
  return useServiceRequestsWithCustomer({
    providerId,
    status: "confirmed",
  });
}
