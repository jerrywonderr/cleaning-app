import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppointmentService } from "../services/appointmentService";
import { useUserStore } from "../store/useUserStore";
import {
  AppointmentFilters,
  AppointmentSearchParams,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../types/appointment";

/**
 * Query Keys for Appointments
 *
 * These keys are used to identify and manage cached appointment data:
 * - APPOINTMENTS_QUERY_KEY: For all appointments
 * - APPOINTMENT_QUERY_KEY: For individual appointments
 * - CUSTOMER_APPOINTMENTS_QUERY_KEY: For appointments by specific customer
 * - PROVIDER_APPOINTMENTS_QUERY_KEY: For appointments by specific service provider
 */
export const APPOINTMENTS_QUERY_KEY = ["appointments"];
export const APPOINTMENT_QUERY_KEY = ["appointment"];
export const CUSTOMER_APPOINTMENTS_QUERY_KEY = ["customer", "appointments"];
export const PROVIDER_APPOINTMENTS_QUERY_KEY = ["provider", "appointments"];

/**
 * Hook to get an appointment by ID
 *
 * @param appointmentId - The unique identifier of the appointment
 * @returns Query result with appointment data
 */
export function useAppointment(appointmentId: string) {
  return useQuery({
    queryKey: [...APPOINTMENT_QUERY_KEY, appointmentId],
    queryFn: () => {
      return AppointmentService.getAppointmentById(appointmentId);
    },
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get all appointments for the current customer
 *
 * @param filters - Optional filters to apply
 * @param searchParams - Search and pagination parameters
 * @returns Query result with array of customer's appointments
 */
export function useCustomerAppointments(
  filters?: AppointmentFilters,
  searchParams?: AppointmentSearchParams
) {
  const { profile } = useUserStore();
  const customerId = profile?.id;

  return useQuery({
    queryKey: [
      ...CUSTOMER_APPOINTMENTS_QUERY_KEY,
      customerId,
      filters,
      searchParams,
    ],
    queryFn: () =>
      AppointmentService.getAppointmentsByCustomer(
        customerId!,
        filters,
        searchParams
      ),
    enabled: !!customerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get all appointments for the current service provider
 *
 * @param filters - Optional filters to apply
 * @param searchParams - Search and pagination parameters
 * @returns Query result with array of service provider's appointments
 */
export function useProviderAppointments(
  filters?: AppointmentFilters,
  searchParams?: AppointmentSearchParams
) {
  const { profile } = useUserStore();
  const providerId = profile?.id;

  return useQuery({
    queryKey: [
      ...PROVIDER_APPOINTMENTS_QUERY_KEY,
      providerId,
      filters,
      searchParams,
    ],
    queryFn: () =>
      AppointmentService.getAppointmentsByServiceProvider(
        providerId!,
        filters,
        searchParams
      ),
    enabled: !!providerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get appointments by status for the current user
 *
 * @param status - Status to filter by (upcoming, ongoing, past)
 * @param userType - "customer" or "serviceProvider"
 * @returns Query result with array of appointments with the specified status
 */
export function useAppointmentsByStatus(
  status: "upcoming" | "ongoing" | "past",
  userType: "customer" | "serviceProvider"
) {
  const { profile } = useUserStore();
  const userId = profile?.id;

  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, "status", userId, userType, status],
    queryFn: () => {
      return AppointmentService.getAppointmentsByStatus(
        userId!,
        userType,
        status
      );
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get appointments by offer ID
 *
 * @param offerId - The offer ID to filter appointments by
 * @returns Query result with array of appointments for the specific offer
 */
export function useAppointmentsByOffer(offerId: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, "offer", offerId],
    queryFn: async () => {
      try {
        // For now, we'll get all appointments and filter by offerId
        // In the future, we can add a direct query method to the service
        const allAppointments = await AppointmentService.getAllAppointments();

        const filteredAppointments = allAppointments.filter(
          (appointment: any) => appointment.offerId === offerId
        );
        return filteredAppointments;
      } catch (error) {
        console.error(`❌ [ERROR] useAppointmentsByOffer query failed:`, error);
        throw error;
      }
    },
    enabled: !!offerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to create a new appointment
 *
 * @returns Mutation for creating appointments
 */
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { profile } = useUserStore();

  return useMutation({
    mutationFn: async (data: CreateAppointmentData) => {
      if (!profile?.id) {
        throw new Error("User not authenticated");
      }

      return AppointmentService.createAppointment(profile.id, data);
    },
    onSuccess: () => {
      // Invalidate and refetch customer appointments
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_APPOINTMENTS_QUERY_KEY,
      });
      // Also invalidate service provider appointments so they see new appointments
      queryClient.invalidateQueries({
        queryKey: PROVIDER_APPOINTMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error("Error creating appointment:", error);
    },
  });
}

/**
 * Hook to update an existing appointment
 *
 * @returns Mutation for updating appointments
 */
export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: UpdateAppointmentData;
    }) => {
      return AppointmentService.updateAppointment(appointmentId, data);
    },
    onSuccess: (_, { appointmentId }) => {
      // Invalidate and refetch specific appointment and related queries
      queryClient.invalidateQueries({
        queryKey: [...APPOINTMENT_QUERY_KEY, appointmentId],
      });
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_APPOINTMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: PROVIDER_APPOINTMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error("Error updating appointment:", error);
    },
  });
}

/**
 * Hook to delete an appointment
 *
 * @returns Mutation for deleting appointments
 */
export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return AppointmentService.deleteAppointment(appointmentId);
    },
    onSuccess: (_, appointmentId) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_APPOINTMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: PROVIDER_APPOINTMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });

      // Remove the deleted appointment from cache
      queryClient.removeQueries({
        queryKey: [...APPOINTMENT_QUERY_KEY, appointmentId],
      });
    },
    onError: (error: any) => {
      console.error("Error deleting appointment:", error);
    },
  });
}

/**
 * Hook to mark appointment as completed
 *
 * @returns Mutation for marking appointments as completed
 */
export function useMarkAppointmentCompleted() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      rating,
      review,
    }: {
      appointmentId: string;
      rating: number;
      review?: string;
    }) => {
      return AppointmentService.markAppointmentCompleted(
        appointmentId,
        rating,
        review
      );
    },
    onSuccess: (_, { appointmentId }) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: [...APPOINTMENT_QUERY_KEY, appointmentId],
      });
      queryClient.invalidateQueries({
        queryKey: CUSTOMER_APPOINTMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({
        queryKey: PROVIDER_APPOINTMENTS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error("Error marking appointment as completed:", error);
    },
  });
}
