import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FirebaseFirestoreService } from "../firebase/firestore";
import { useUserStore } from "../store/useUserStore";
import {
  ServiceAreaData,
  UpdateServiceProviderProfileData,
  WorkingSchedule,
} from "../types/service-config";

export const useServiceProvider = () => {
  const queryClient = useQueryClient();
  const profile = useUserStore((state) => state.profile);

  const {
    data: serviceProviderProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["serviceProviderProfile", profile?.id],
    queryFn: () =>
      FirebaseFirestoreService.getServiceProviderProfile(profile?.id!),
    enabled: !!profile?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateServiceProviderProfileData) =>
      FirebaseFirestoreService.updateServiceProviderProfile(profile?.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", profile?.id],
      });
    },
  });

  const updateServiceAreaMutation = useMutation({
    mutationFn: (serviceArea: ServiceAreaData) =>
      FirebaseFirestoreService.updateServiceProviderProfile(profile?.id!, {
        workingPreferences: {
          ...serviceProviderProfile?.workingPreferences,
          serviceArea,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", profile?.id],
      });
    },
  });

  const updateWorkingScheduleMutation = useMutation({
    mutationFn: (workingSchedule: WorkingSchedule) =>
      FirebaseFirestoreService.updateServiceProviderProfile(profile?.id!, {
        workingPreferences: {
          ...serviceProviderProfile?.workingPreferences,
          workingSchedule,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", profile?.id],
      });
    },
  });

  return {
    serviceProviderProfile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutateAsync,
    updateServiceArea: updateServiceAreaMutation.mutateAsync,
    updateWorkingSchedule: updateWorkingScheduleMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingServiceArea: updateServiceAreaMutation.isPending,
    isUpdatingWorkingSchedule: updateWorkingScheduleMutation.isPending,
  };
};
