import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { useLoader } from "@/lib/components/ui/loader/use-loader";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { searchServiceProviders } from "@/lib/services/cloudFunctionsService";
import { ServiceProviderResult } from "@/lib/types";
import { format } from "date-fns";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert } from "react-native";

export default function SelectProviderScreen() {
  const { watch, setValue, setError, clearErrors, formState } =
    useFormContext<CreateProposalFormData>();
  const selectedProvider = watch("providerId");
  const serviceId = watch("serviceId");
  const location = watch("location");
  const { showLoader, hideLoader } = useLoader();

  const [providers, setProviders] = useState<ServiceProviderResult[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!serviceId || !location) {
        return;
      }

      try {
        clearErrors("providerId");
        showLoader("Finding service providers in your area...");

        const results = await searchServiceProviders(serviceId, {
          latitude: location.latitude,
          longitude: location.longitude,
        });

        setProviders(results as ServiceProviderResult[]);
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("providerId", {
          type: "manual",
          message: "Failed to load service providers. Please try again.",
        });
      } finally {
        hideLoader();
      }
    };

    fetchProviders();
  }, [serviceId, location]);

  const handleNext = () => {
    if (!selectedProvider) {
      Alert.alert("Selection Required", "Please select a service provider");
      return;
    }
    router.push("/customer/proposals/create-proposal");
  };

  const formatWorkingSchedule = (schedule: any) => {
    if (!schedule) return "Schedule not available";

    const days = Object.entries(schedule)
      .filter(([_, dayData]: [string, any]) => dayData.isActive)
      .map(([day, dayData]: [string, any]) => {
        const start = dayData.startTime
          ? format(new Date(dayData.startTime), "HH:mm")
          : "N/A";
        const end = dayData.endTime
          ? format(new Date(dayData.endTime), "HH:mm")
          : "N/A";
        return `${day}: ${start}-${end}`;
      });

    return days.length > 0 ? days.join(", ") : "Schedule not available";
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton onPress={handleNext} disabled={!selectedProvider}>
          Next
        </PrimaryButton>
      }
    >
      <StepIndicator steps={6} currentStep={3} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-6">
          <Text className="text-2xl font-inter-bold text-black">
            Select a Provider
          </Text>

          {formState.errors.providerId ? (
            <VStack className="items-center justify-center py-8">
              <Text className="text-red-600 text-center">
                {formState.errors.providerId.message}
              </Text>
            </VStack>
          ) : providers.length === 0 ? (
            <VStack className="items-center justify-center py-8">
              <Text className="text-gray-600 text-center">
                No service providers found in your area for this service.
              </Text>
            </VStack>
          ) : (
            <VStack className="gap-4">
              {providers.map((provider) => (
                <Pressable
                  key={provider.id}
                  onPress={() => setValue("providerId", provider.id)}
                  className={`p-4 border rounded-lg ${
                    selectedProvider === provider.id
                      ? "border-brand-600 bg-brand-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <VStack className="gap-2">
                    <Text className="text-black font-inter-medium text-lg">
                      {provider.profile.firstName} {provider.profile.lastName}
                    </Text>

                    <VStack className="gap-1">
                      <Text className="text-sm text-gray-600">
                        {formatWorkingSchedule(
                          provider.workingPreferences?.workingSchedule
                        )}
                      </Text>

                      <HStack className="items-center gap-4">
                        {provider.rating && (
                          <Text className="text-sm text-gray-600">
                            ⭐ {provider.rating.toFixed(1)} (
                            {provider.totalJobs || 0} jobs)
                          </Text>
                        )}
                        <Text className="text-sm text-gray-600">
                          📍 {Math.round(provider.distance / 1000)}km away
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </Pressable>
              ))}
            </VStack>
          )}
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
