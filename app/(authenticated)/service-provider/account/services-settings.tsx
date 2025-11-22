import ExtraServiceOptionCard from "@/lib/components/ExtraServiceOptionCard";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import ServiceCard from "@/lib/components/ServiceCard";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { useLoader } from "@/lib/components/ui/loader/use-loader";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  extraServiceOptions,
  serviceConfigs,
} from "@/lib/constants/service-config";
import { useServiceProvider } from "@/lib/hooks/useServiceProvider";
import { useUserStore } from "@/lib/store/useUserStore";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function ServicesSettingsScreen() {
  const userId = useUserStore((state) => state.profile?.id);
  const { serviceProviderProfile, updateProfile, isLoading } =
    useServiceProvider();

  const [localServiceConfigs, setLocalServiceConfigs] =
    useState(serviceConfigs);
  const [localExtraOptions, setLocalExtraOptions] =
    useState(extraServiceOptions);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (isLoading) {
      showLoader("Loading services...");
    } else {
      hideLoader();
    }
  }, [isLoading, showLoader, hideLoader]);

  useEffect(() => {
    if (serviceProviderProfile?.services) {
      setLocalServiceConfigs((prev) =>
        prev.map((service) => ({
          ...service,
          isEnabled: serviceProviderProfile.services[service.id] || false,
        }))
      );
    }
    if (serviceProviderProfile?.extraOptions) {
      setLocalExtraOptions((prev) =>
        prev.map((option) => ({
          ...option,
          isEnabled: serviceProviderProfile.extraOptions[option.id] || false,
        }))
      );
    }
  }, [serviceProviderProfile]);

  const handleServiceToggle = async (serviceId: string, enabled: boolean) => {
    if (!userId) return;

    try {
      const updatedServices: Record<string, boolean> = {
        ...serviceProviderProfile?.services,
        [serviceId]: enabled,
      };

      await updateProfile({
        services: updatedServices as Record<
          "classic-cleaning" | "deep-cleaning" | "end-of-tenancy",
          boolean
        >,
      });

      setLocalServiceConfigs((prev) =>
        prev.map((service) =>
          service.id === serviceId
            ? { ...service, isEnabled: enabled }
            : service
        )
      );
    } catch (error) {
      console.error("Failed to update service preference:", error);
      Alert.alert("Error", "Failed to update service preference");
    }
  };

  const handleExtraOptionToggle = async (
    optionId: string,
    enabled: boolean
  ) => {
    if (!userId) return;

    try {
      const updatedExtraOptions: Record<string, boolean> = {
        ...serviceProviderProfile?.extraOptions,
        [optionId]: enabled,
      };

      await updateProfile({
        extraOptions: updatedExtraOptions,
      });

      setLocalExtraOptions((prev) =>
        prev.map((option) =>
          option.id === optionId ? { ...option, isEnabled: enabled } : option
        )
      );
    } catch (error) {
      console.error("Failed to update extra option preference:", error);
      Alert.alert("Error", "Failed to update extra option preference");
    }
  };

  const getEnabledServicesCount = () => {
    return localServiceConfigs.filter((service) => service.isEnabled).length;
  };

  const getEnabledExtraOptionsCount = () => {
    return localExtraOptions.filter((option) => option.isEnabled).length;
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6 my-4">
          {/* <VStack className="gap-3">
            <Text className="text-xl font-inter-bold text-black">
              Manage Your Services
            </Text>
          </VStack> */}

          <Box className="bg-brand-50 rounded-lg p-4 border border-brand-200">
            <VStack className="gap-2">
              <HStack className="justify-between">
                <Text className="text-sm text-brand-700">
                  Active Services: {getEnabledServicesCount()}/
                  {localServiceConfigs.length}
                </Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-sm text-brand-700">
                  Extra Options: {getEnabledExtraOptionsCount()}/
                  {localExtraOptions.length}
                </Text>
              </HStack>
            </VStack>
          </Box>

          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              Main Cleaning Services
            </Text>
            {localServiceConfigs.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onToggle={handleServiceToggle}
                showToggle={true}
                showPrice={false}
              />
            ))}
          </VStack>

          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              Additional Service Options
            </Text>
            <Text className="text-sm text-gray-600">
              These options can be added to any cleaning service for additional
              fees.
            </Text>
            {localExtraOptions.map((option) => (
              <ExtraServiceOptionCard
                key={option.id}
                option={option}
                onToggle={handleExtraOptionToggle}
                showToggle={true}
                showPrice={false}
              />
            ))}
          </VStack>

          <VStack className="gap-3 mt-4">
            <Text className="text-sm text-gray-500 text-center">
              Changes are automatically saved to your account
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
