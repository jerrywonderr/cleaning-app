import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  extraServiceOptions,
  serviceConfigs,
} from "@/lib/constants/service-config";
import { useUserType } from "@/lib/hooks/useAuth";
import { useCreateServiceRequest } from "@/lib/hooks/useServiceRequests";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { ServiceProviderResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatNaira";
import { router } from "expo-router";
import { useFormContext } from "react-hook-form";
import { Alert } from "react-native";

export default function FinalProposalPage() {
  const { watch } = useFormContext<CreateProposalFormData>();
  const { profile } = useUserType();
  const createServiceRequest = useCreateServiceRequest();

  const serviceId = watch("serviceId");
  const providerId = watch("providerId");
  const location = watch("location");
  const selectedDate = watch("proposalDetails.date");
  const duration = watch("proposalDetails.duration");
  const selectedTimeRange = watch("proposalDetails.timeRange");
  const selectedExtras = watch("extraOptions") || [];
  const selectedProvider = watch("selectedProvider") as
    | ServiceProviderResult
    | undefined;

  const selectedService = serviceConfigs.find((s) => s.id === serviceId);

  const formatLocation = (loc: any) => {
    if (!loc) return "No address selected";
    return (
      loc.fullAddress ||
      `${loc.streetNumber} ${loc.streetName}, ${loc.city}, ${loc.state}, ${loc.country}`
    );
  };

  // Calculate pricing
  const calculatePricing = () => {
    if (!selectedService || !duration)
      return { basePrice: 0, extrasPrice: 0, total: 0 };

    const basePrice = selectedService.perHourPrice * duration;

    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = extraServiceOptions.find((e) => e.id === extraId);
      return total + (extra?.additionalPrice || 0);
    }, 0);

    return {
      basePrice,
      extrasPrice,
      total: basePrice + extrasPrice,
    };
  };

  const pricing = calculatePricing();

  // Format date properly
  const formatDate = (dateString: string) => {
    if (!dateString) return "No date selected";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const finalizeProposal = async () => {
    if (!selectedProvider) {
      Alert.alert(
        "Error",
        "Provider information is missing. Please try again."
      );
      return;
    }

    if (!profile?.id) {
      Alert.alert("Error", "User information is missing. Please log in again.");
      return;
    }

    // Prepare service request data
    const serviceRequestData = {
      customerId: profile.id,
      providerId,
      serviceType: serviceId,
      serviceName: selectedService?.name || "",
      duration,
      scheduledDate: selectedDate,
      timeRange: selectedTimeRange,
      location,
      basePrice: pricing.basePrice,
      extrasPrice: pricing.extrasPrice,
      totalPrice: pricing.total,
      extraOptions: selectedExtras.filter((id): id is string => Boolean(id)),
    };

    // Create the service request using the mutation hook
    createServiceRequest.mutate(serviceRequestData, {
      onSuccess: (serviceRequestId) => {
        Alert.alert(
          "Service Request Created!",
          "Your service request has been sent to the provider. You'll be notified when they respond.",
          [
            {
              text: "OK",
              onPress: () =>
                router.push("/(authenticated)/customer/(tabs)/proposals"),
            },
          ]
        );
      },
      onError: (error) => {
        console.error("Error creating service request:", error);
        Alert.alert(
          "Error",
          "Failed to create service request. Please try again.",
          [{ text: "OK" }]
        );
      },
    });
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={finalizeProposal}
          disabled={createServiceRequest.isPending}
        >
          {createServiceRequest.isPending
            ? "Creating Request..."
            : "Confirm Proposal"}
        </PrimaryButton>
      }
    >
      <StepIndicator steps={6} currentStep={6} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-6">
          {/* Page Title */}
          <Text className="text-2xl font-inter-bold text-black">
            Review Your Proposal
          </Text>
          <Text className="text-gray-500">
            Please review all details before confirming your booking.
          </Text>

          {/* Service Provider */}
          {selectedProvider && (
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-lg font-inter-bold text-black mb-2">
                Service Provider
              </Text>
              <Text className="text-black font-inter-medium">
                {selectedProvider.profile.firstName}{" "}
                {selectedProvider.profile.lastName}
              </Text>
              <HStack className="items-center gap-2 mt-1">
                <Text className="text-gray-600">
                  {selectedProvider.rating
                    ? `⭐ ${selectedProvider.rating}`
                    : "New Provider"}
                </Text>
                <Text className="text-gray-400">•</Text>
                <Text className="text-gray-600">
                  {selectedProvider.totalJobs || 0} jobs completed
                </Text>
                <Text className="text-gray-400">•</Text>
                <Text className="text-gray-600">
                  {Math.round(selectedProvider.distance / 1000)}km away
                </Text>
              </HStack>
              <Text className="text-sm text-gray-500 mt-1">
                📞 {selectedProvider.profile.phone}
              </Text>
            </Box>
          )}

          {/* Service */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-inter-bold text-black mb-2">
              Selected Service
            </Text>
            <Text className="text-black font-inter-medium">
              {selectedService?.name}
            </Text>
            <Text className="text-gray-600 mb-2">
              {selectedService?.description}
            </Text>
            <HStack className="justify-between items-center">
              <Text className="text-sm text-gray-500">
                Duration: {duration} hour{duration > 1 ? "s" : ""}
              </Text>
              <Text className="text-sm font-inter-bold text-brand-500">
                {formatCurrency(selectedService?.perHourPrice ?? 0)}
                /hour
              </Text>
            </HStack>
          </Box>

          {/* Date & Time */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-inter-bold text-black mb-2">
              Date & Time
            </Text>
            <Text className="text-black font-inter-medium">
              {formatDate(selectedDate)}
            </Text>
            <Text className="text-gray-600">{selectedTimeRange}</Text>
          </Box>

          {/* Location */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-inter-bold text-black mb-2">
              Service Location
            </Text>
            <Text className="text-black font-inter-medium">
              {formatLocation(location)}
            </Text>
          </Box>

          {/* Extra Options */}
          {selectedExtras.length > 0 && (
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-lg font-inter-bold text-black mb-2">
                Extra Services
              </Text>
              <VStack className="gap-2">
                {selectedExtras
                  .filter((id): id is string => Boolean(id))
                  .map((id) => {
                    const option = extraServiceOptions.find((o) => o.id === id);
                    return (
                      <HStack key={id} className="justify-between items-center">
                        <Text className="text-black font-inter-medium">
                          • {option?.name}
                        </Text>
                        <Text className="text-sm font-inter-bold text-brand-500">
                          +
                          {option?.additionalPrice
                            ? formatCurrency(option.additionalPrice).replace(
                                "$",
                                ""
                              )
                            : "0"}
                        </Text>
                      </HStack>
                    );
                  })}
              </VStack>
            </Box>
          )}

          {/* Pricing Summary */}
          <Box className="bg-brand-50 p-4 rounded-lg border border-brand-200">
            <Text className="text-lg font-inter-bold text-black mb-3">
              Pricing Summary
            </Text>
            <VStack className="gap-2">
              <HStack className="justify-between">
                <Text className="text-gray-600">
                  {selectedService?.name} ({duration} hour
                  {duration > 1 ? "s" : ""})
                </Text>
                <Text className="font-inter-medium">
                  {formatCurrency(pricing.basePrice)}
                </Text>
              </HStack>
              {pricing.extrasPrice > 0 && (
                <HStack className="justify-between">
                  <Text className="text-gray-600">Extra Services</Text>
                  <Text className="font-inter-medium">
                    {formatCurrency(pricing.extrasPrice)}
                  </Text>
                </HStack>
              )}
              <HStack className="justify-between pt-2 border-t border-brand-200">
                <Text className="text-lg font-inter-bold text-black">
                  Total
                </Text>
                <Text className="text-lg font-inter-bold text-brand-600">
                  {formatCurrency(pricing.total)}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
