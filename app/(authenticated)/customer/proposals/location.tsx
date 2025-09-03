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
import { Rating } from "react-native-ratings";

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

const ScheduleGrid = ({ schedule }: { schedule: any }) => {
  if (!schedule) return null;

  const dayOrder = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <VStack className="gap-1">
      <HStack className="justify-between">
        {dayOrder.map((day, index) => {
          const dayData = schedule[day];
          const isActive = dayData?.isActive;
          return (
            <VStack key={day} className="items-center gap-1 flex-1">
              <Text className="text-xs text-gray-500 font-inter-medium">
                {dayLabels[index]}
              </Text>
              <VStack
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  isActive ? "bg-brand-500" : "bg-gray-200"
                }`}
              >
                {isActive ? (
                  <Text className="text-white text-xs">✓</Text>
                ) : (
                  <Text className="text-gray-400 text-xs">○</Text>
                )}
              </VStack>
            </VStack>
          );
        })}
      </HStack>
    </VStack>
  );
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
                      className={`p-5 rounded-2xl shadow-soft-1 ${
                        selectedProvider === provider.id
                          ? "bg-brand-50 border-2 border-brand-500"
                          : "bg-white border border-gray-100"
                      }`}
                    >
                      <VStack className="gap-3">
                        <HStack className="gap-4">
                          <VStack className="items-center">
                            <Avatar className="w-16 h-16 border-2 border-white shadow-soft-1">
                              {provider.profile.profileImage ? (
                                <Image
                                  source={{
                                    uri: provider.profile.profileImage,
                                  }}
                                  className="w-full h-full rounded-full"
                                  resizeMode="cover"
                                />
                              ) : (
                                <VStack className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 rounded-full items-center justify-center">
                                  <Text className="text-brand-600 font-inter-bold text-xl">
                                    {provider.profile.firstName[0]}
                                    {provider.profile.lastName[0]}
                                  </Text>
                                </VStack>
                              )}
                            </Avatar>

                            {selectedProvider === provider.id && (
                              <VStack className="mt-2 px-2 py-1 bg-brand-500 rounded-full">
                                <Text className="text-white text-xs font-inter-medium">
                                  Selected
                                </Text>
                              </VStack>
                            )}
                          </VStack>

                          <VStack className="flex-1 gap-3">
                            <HStack className="items-center justify-between">
                              <VStack className="gap-1">
                                <Text className="text-gray-900 font-inter-bold text-lg">
                                  {provider.profile.firstName}{" "}
                                  {provider.profile.lastName}
                                </Text>
                                <HStack className="items-center gap-2">
                                  <HStack className="items-center gap-1 px-2 py-1 bg-brand-50 rounded-full">
                                    <Text className="text-brand-600 text-sm">
                                      💼
                                    </Text>
                                    <Text className="text-brand-700 text-sm font-inter-medium">
                                      {provider.totalJobs || 0} jobs
                                    </Text>
                                  </HStack>
                                </HStack>
                              </VStack>
                            </HStack>
                          </VStack>
                        </HStack>

                        <ScheduleGrid
                          schedule={
                            provider.workingPreferences?.workingSchedule
                          }
                        />

                        <HStack className="items-center justify-between gap-2">
                          {" "}
                          <HStack className="items-center gap-2">
                            <Text className="text-brand-500">📍</Text>
                            <Text className="text-gray-600 text-sm font-inter-medium">
                              {Math.round(provider.distance / 1000)}km away
                            </Text>
                          </HStack>
                          <Rating
                            type="star"
                            startingValue={provider.rating || 0}
                            imageSize={16}
                            readonly={true}
                            ratingColor="#fbbf24"
                            ratingBackgroundColor="#d1d5db"
                            fractions={2}
                            showRating={false}
                          />
                        </HStack>
                      </VStack>
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
