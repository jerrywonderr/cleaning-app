import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FirebaseFirestoreService } from "../firebase/firestore";
import { updateServiceProviderSettings } from "../services/cloudFunctionsService";
import { useUserStore } from "../store/useUserStore";
import {
  ServiceAreaData,
  UpdateServiceProviderProfileData,
  UpdateServiceProviderRequest,
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
    mutationFn: (data: UpdateServiceProviderProfileData) => {
      const request: UpdateServiceProviderRequest = {
        userId: profile?.id!,
        providerData: {
          services: data.services || serviceProviderProfile?.services!,
          extraOptions:
            data.extraOptions || serviceProviderProfile?.extraOptions!,
          workingPreferences:
            data.workingPreferences ||
            serviceProviderProfile?.workingPreferences,
        },
      };
      return updateServiceProviderSettings(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", profile?.id],
      });
    },
  });

  const updateServiceAreaMutation = useMutation({
    mutationFn: (serviceArea: ServiceAreaData) => {
      const request: UpdateServiceProviderRequest = {
        userId: profile?.id!,
        providerData: {
          services: serviceProviderProfile?.services!,
          extraOptions: serviceProviderProfile?.extraOptions!,
          workingPreferences: {
            ...serviceProviderProfile?.workingPreferences,
            serviceArea,
          },
        },
      };
      return updateServiceProviderSettings(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", profile?.id],
      });
    },
  });

  const updateWorkingScheduleMutation = useMutation({
    mutationFn: (workingSchedule: WorkingSchedule) => {
      const request: UpdateServiceProviderRequest = {
        userId: profile?.id!,
        providerData: {
          services: serviceProviderProfile?.services!,
          extraOptions: serviceProviderProfile?.extraOptions!,
          workingPreferences: {
            ...serviceProviderProfile?.workingPreferences,
            workingSchedule,
          },
        },
      };
      return updateServiceProviderSettings(request);
    },
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
