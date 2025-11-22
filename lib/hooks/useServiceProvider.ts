import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import geohash from "ngeohash";
import { db } from "../firebase/config";
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
    mutationFn: async (data: UpdateServiceProviderProfileData) => {
      if (!profile?.id) throw new Error("User ID required");

      let workingPreferences =
        data.workingPreferences || serviceProviderProfile?.workingPreferences;

      // Generate geohash if service area is provided
      if (workingPreferences?.serviceArea) {
        const { latitude, longitude } =
          workingPreferences.serviceArea.coordinates;
        const hash = geohash.encode(latitude, longitude, 7);

        workingPreferences = {
          ...workingPreferences,
          serviceArea: {
            ...workingPreferences.serviceArea,
            geohash: hash,
          },
        };
      }

      const providerRef = doc(db, "serviceProviders", profile.id);
      const services = data.services || serviceProviderProfile?.services!;
      const extraOptions =
        data.extraOptions || serviceProviderProfile?.extraOptions!;

      await updateDoc(providerRef, {
        services,
        extraOptions,
        workingPreferences,
        isActive: Object.values(services).some((service) => service),
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", profile?.id],
      });
    },
  });

  const updateServiceAreaMutation = useMutation({
    mutationFn: async (serviceArea: ServiceAreaData) => {
      if (!profile?.id) throw new Error("User ID required");

      // Generate geohash for the service area
      const { latitude, longitude } = serviceArea.coordinates;
      const hash = geohash.encode(latitude, longitude, 7);

      const providerRef = doc(db, "serviceProviders", profile.id);
      await updateDoc(providerRef, {
        "workingPreferences.serviceArea": {
          ...serviceArea,
          geohash: hash,
        },
        updatedAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["serviceProviderProfile", profile?.id],
      });
    },
  });

  const updateWorkingScheduleMutation = useMutation({
    mutationFn: async (workingSchedule: WorkingSchedule) => {
      if (!profile?.id) throw new Error("User ID required");

      const providerRef = doc(db, "serviceProviders", profile.id);
      await updateDoc(providerRef, {
        "workingPreferences.workingSchedule": workingSchedule,
        updatedAt: serverTimestamp(),
      });
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
