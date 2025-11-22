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
 * Hook to get customer's recent service requests for home page
 * Fetches confirmed and in-progress appointments (limited to 10 each)
 */
export function useCustomerServiceRequests(customerId: string) {
  return useQuery({
    queryKey: [...SERVICE_REQUESTS_QUERY_KEY, "customer-home", customerId],
    queryFn: async () => {
      // Fetch confirmed and in-progress in parallel
      const [confirmedResult, inProgressResult] = await Promise.all([
        ServiceRequestService.getServiceRequestsWithProviderPaginated(
          { customerId, status: "confirmed" },
          10
        ),
        ServiceRequestService.getServiceRequestsWithProviderPaginated(
          { customerId, status: "in-progress" },
          10
        ),
      ]);

      return [...confirmedResult.data, ...inProgressResult.data];
    },
    enabled: !!customerId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get provider's recent service requests for home page
 * Fetches confirmed and in-progress appointments (limited to 10 each)
 */
export function useProviderServiceRequests(providerId: string) {
  return useQuery({
    queryKey: [...SERVICE_REQUESTS_QUERY_KEY, "provider-home", providerId],
    queryFn: async () => {
      // Fetch confirmed and in-progress in parallel
      const [confirmedResult, inProgressResult] = await Promise.all([
        ServiceRequestService.getServiceRequestsWithCustomerPaginated(
          { providerId, status: "confirmed" },
          10
        ),
        ServiceRequestService.getServiceRequestsWithCustomerPaginated(
          { providerId, status: "in-progress" },
          10
        ),
      ]);

      return [...confirmedResult.data, ...inProgressResult.data];
    },
    enabled: !!providerId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
