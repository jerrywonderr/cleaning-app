import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FirebaseFirestoreService } from "../firebase/firestore";
import { useUserStore } from "../store/useUserStore";
import {
  CreateUserServicePreferencesData,
  UpdateUserServicePreferencesData,
} from "../types/service-config";

export const useServicePreferences = () => {
  const queryClient = useQueryClient();
  const profile = useUserStore((state) => state.profile);

  const {
    data: servicePreferences,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["servicePreferences", profile?.id],
    queryFn: () =>
      FirebaseFirestoreService.getUserServicePreferences(profile?.id!),
    enabled: !!profile?.id,
  });

  const setPreferencesMutation = useMutation({
    mutationFn: (data: CreateUserServicePreferencesData) =>
      FirebaseFirestoreService.setUserServicePreferences(data.userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicePreferences", profile?.id],
      });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (data: UpdateUserServicePreferencesData) =>
      FirebaseFirestoreService.updateUserServicePreferences(profile?.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicePreferences", profile?.id],
      });
    },
  });

  const deletePreferencesMutation = useMutation({
    mutationFn: () =>
      FirebaseFirestoreService.deleteUserServicePreferences(profile?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicePreferences", profile?.id],
      });
    },
  });

  return {
    servicePreferences,
    isLoading,
    error,
    setPreferences: setPreferencesMutation.mutateAsync,
    updatePreferences: updatePreferencesMutation.mutateAsync,
    deletePreferences: deletePreferencesMutation.mutateAsync,
    isSettingPreferences: setPreferencesMutation.isPending,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
    isDeletingPreferences: deletePreferencesMutation.isPending,
  };
};
