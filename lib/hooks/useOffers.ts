import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OfferService } from "../services/offerService";
import { useUserStore } from "../store/useUserStore";
import {
  CreateOfferData,
  OfferFilters,
  OfferSearchParams,
  UpdateOfferData,
} from "../types/offer";

/**
 * Query Keys for Offers
 *
 * These keys are used to identify and manage cached offer data:
 * - OFFERS_QUERY_KEY: For all offers
 * - OFFER_QUERY_KEY: For individual offers
 * - PROVIDER_OFFERS_QUERY_KEY: For offers by specific provider
 */
export const OFFERS_QUERY_KEY = ["offers"];
export const OFFER_QUERY_KEY = ["offer"];
export const PROVIDER_OFFERS_QUERY_KEY = ["provider", "offers"];

/**
 * Hook to get an offer by ID
 *
 * @param offerId - The unique identifier of the offer
 * @returns Query result with offer data
 */
export function useOffer(offerId: string) {
  return useQuery({
    queryKey: [...OFFER_QUERY_KEY, offerId],
    queryFn: () => OfferService.getOfferById(offerId),
    enabled: !!offerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get all offers for the current service provider
 *
 * @returns Query result with array of provider's offers
 */
export function useProviderOffers() {
  const { profile } = useUserStore();
  const providerId = profile?.id;

  return useQuery({
    queryKey: [...PROVIDER_OFFERS_QUERY_KEY, providerId],
    queryFn: () => OfferService.getOffersByProvider(providerId!),
    enabled: !!providerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get all active offers (for customers to browse)
 *
 * @param filters - Optional filters to apply
 * @param searchParams - Search and pagination parameters
 * @returns Query result with array of active offers
 */
export function useActiveOffers(
  filters?: OfferFilters,
  searchParams?: OfferSearchParams
) {
  return useQuery({
    queryKey: [...OFFERS_QUERY_KEY, "active", filters, searchParams],
    queryFn: () => OfferService.getActiveOffers(filters, searchParams),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to search offers by text query
 *
 * @param query - Text to search for
 * @param filters - Optional filters to apply
 * @returns Query result with array of matching offers
 */
export function useSearchOffers(query: string, filters?: OfferFilters) {
  return useQuery({
    queryKey: [...OFFERS_QUERY_KEY, "search", query, filters],
    queryFn: () => OfferService.searchOffers(query, filters),
    enabled: !!query.trim(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to create a new offer
 *
 * @returns Mutation for creating offers
 */
export function useCreateOffer() {
  const queryClient = useQueryClient();
  const { profile } = useUserStore();

  return useMutation({
    mutationFn: async (data: CreateOfferData) => {
      if (!profile?.id) {
        throw new Error("User not authenticated");
      }

      return OfferService.createOffer(
        profile.id,
        `${profile.firstName} ${profile.lastName}`,
        data
      );
    },
    onSuccess: () => {
      // Invalidate and refetch provider offers
      queryClient.invalidateQueries({ queryKey: PROVIDER_OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error("Error creating offer:", error);
    },
  });
}

/**
 * Hook to update an existing offer
 *
 * @returns Mutation for updating offers
 */
export function useUpdateOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      offerId,
      data,
    }: {
      offerId: string;
      data: UpdateOfferData;
    }) => {
      return OfferService.updateOffer(offerId, data);
    },
    onSuccess: (_, { offerId }) => {
      // Invalidate and refetch specific offer and provider offers
      queryClient.invalidateQueries({
        queryKey: [...OFFER_QUERY_KEY, offerId],
      });
      queryClient.invalidateQueries({ queryKey: PROVIDER_OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error("Error updating offer:", error);
    },
  });
}

/**
 * Hook to delete an offer
 *
 * @returns Mutation for deleting offers
 */
export function useDeleteOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      return OfferService.deleteOffer(offerId);
    },
    onSuccess: (_, offerId) => {
      // Invalidate and refetch provider offers
      queryClient.invalidateQueries({ queryKey: PROVIDER_OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });

      // Remove the deleted offer from cache
      queryClient.removeQueries({ queryKey: [...OFFER_QUERY_KEY, offerId] });
    },
    onError: (error: any) => {
      console.error("Error deleting offer:", error);
    },
  });
}

/**
 * Hook to toggle offer active status
 *
 * @returns Mutation for toggling offer status
 */
export function useToggleOfferStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      offerId,
      isActive,
    }: {
      offerId: string;
      isActive: boolean;
    }) => {
      return OfferService.toggleOfferStatus(offerId, isActive);
    },
    onSuccess: (_, { offerId }) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: [...OFFER_QUERY_KEY, offerId],
      });
      queryClient.invalidateQueries({ queryKey: PROVIDER_OFFERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error("Error toggling offer status:", error);
    },
  });
}
