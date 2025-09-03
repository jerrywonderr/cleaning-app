import { PrimaryButton } from "@/lib/components/custom-buttons";
import { AddressField, AddressFieldRef } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Avatar } from "@/lib/components/ui/avatar";
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
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert, Image } from "react-native";

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
export default function LocationScreen() {
  const { watch, setValue, setError, clearErrors, formState } =
    useFormContext<CreateProposalFormData>();
  const selectedLocation = watch("location");
  const serviceId = watch("serviceId");
  const selectedProvider = watch("providerId");
  const { showLoader, hideLoader } = useLoader();

  const [providers, setProviders] = useState<ServiceProviderResult[]>([]);

  const addressRef = useRef<AddressFieldRef>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!serviceId || !selectedLocation) return;
      try {
        clearErrors("providerId");
        showLoader("Finding service providers in your area...");
        const results = await searchServiceProviders(serviceId, {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        });
        setProviders(results as ServiceProviderResult[]);
        // Auto-clear previous selection if no longer in list
        if (
          selectedProvider &&
          !(results as ServiceProviderResult[]).some(
            (p) => p.id === selectedProvider
          )
        ) {
          setValue("providerId", "");
        }
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
  }, [serviceId, selectedLocation?.latitude, selectedLocation?.longitude]);

  const handleNext = () => {
    if (!selectedLocation) {
      Alert.alert("Location Required", "Please select a location");
      return;
    }
    if (!selectedProvider) {
      Alert.alert("Selection Required", "Please select a service provider");
      return;
    }
    router.push("/customer/proposals/create-proposal");
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={handleNext}
          disabled={!selectedLocation || !selectedProvider}
        >
          Next
        </PrimaryButton>
      }
    >
      <StepIndicator steps={6} currentStep={2} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-6">
          <Text className="text-2xl font-inter-bold text-black">
            Where should we clean?
          </Text>

          <AddressField
            ref={addressRef}
            name="location"
            label="Cleaning Address"
            placeholder="Enter your address"
          />

          {/* Providers list appears once a location is set */}
          {selectedLocation && (
            <VStack className="gap-4">
              <Text className="text-2xl font-inter-bold text-black">
                Available Providers
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
                    {serviceId
                      ? "No service providers found in your area for this service."
                      : "Select a service to see nearby providers."}
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
                      <HStack className="gap-3">
                        <Avatar className="w-12 h-12">
                          {provider.profile.profileImage ? (
                            <Image
                              source={{ uri: provider.profile.profileImage }}
                              className="w-full h-full rounded-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <VStack className="w-full h-full bg-gray-200 rounded-full items-center justify-center">
                              <Text className="text-gray-600 font-inter-medium text-lg">
                                {provider.profile.firstName[0]}
                                {provider.profile.lastName[0]}
                              </Text>
                            </VStack>
                          )}
                        </Avatar>

                        <VStack className="flex-1 gap-2">
                          <HStack className="items-center justify-between">
                            <Text className="text-black font-inter-medium text-lg">
                              {provider.profile.firstName}{" "}
                              {provider.profile.lastName}
                            </Text>
                            <HStack className="items-center gap-1">
                              <Text className="text-yellow-500">⭐</Text>
                              <Text className="text-sm text-gray-600 font-inter-medium">
                                {(provider.rating || 0).toFixed(1)}
                              </Text>
                            </HStack>
                          </HStack>

                          <VStack className="gap-1">
                            <Text className="text-sm text-gray-600">
                              {formatWorkingSchedule(
                                provider.workingPreferences?.workingSchedule
                              )}
                            </Text>

                            <HStack className="items-center gap-4">
                              <Text className="text-sm text-gray-600">
                                {provider.totalJobs || 0} jobs completed
                              </Text>
                              <Text className="text-sm text-gray-600">
                                📍 {Math.round(provider.distance / 1000)}km away
                              </Text>
                            </HStack>
                          </VStack>
                        </VStack>
                      </HStack>
                    </Pressable>
                  ))}
                </VStack>
              )}
            </VStack>
          )}
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
