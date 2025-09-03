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
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { searchServiceProviders } from "@/lib/services/cloudFunctionsService";
import { ServiceProviderResult } from "@/lib/types";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function FinalProposalPage() {
  const { watch } = useFormContext<CreateProposalFormData>();

  const serviceId = watch("serviceId");
  const providerId = watch("providerId");
  const location = watch("location");
  const selectedDate = watch("proposalDetails.date");
  const duration = watch("proposalDetails.duration");
  const selectedTimeRange = watch("proposalDetails.timeRange");
  const selectedExtras = watch("extraOptions") || [];

  const selectedService = serviceConfigs.find((s) => s.id === serviceId);

  // Fetch provider data
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProviderResult | null>(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!providerId || !location || !serviceId) {
        setSelectedProvider(null);
        return;
      }

      try {
        const results = await searchServiceProviders(serviceId, {
          latitude: location.latitude,
          longitude: location.longitude,
        });

        const provider = (results as ServiceProviderResult[]).find(
          (p) => p.id === providerId
        );

        setSelectedProvider(provider || null);
      } catch (error) {
        console.error("Error fetching provider data:", error);
        setSelectedProvider(null);
      }
    };

    fetchProviderData();
  }, [providerId, location, serviceId]);

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

  const finalizeProposal = () => {
    // Prepare proposal data for submission
    const proposalData = {
      // Core proposal details
      serviceId,
      providerId,
      location,

      // Service details
      serviceType: selectedService?.id,
      serviceName: selectedService?.name,
      duration,

      // Scheduling
      scheduledDate: selectedDate,
      timeRange: selectedTimeRange,

      // Pricing
      basePrice: pricing.basePrice,
      extrasPrice: pricing.extrasPrice,
      totalPrice: pricing.total,

      // Extras
      extraOptions: selectedExtras,

      // Provider info
      providerName: selectedProvider
        ? `${selectedProvider.profile.firstName} ${selectedProvider.profile.lastName}`
        : "Unknown Provider",
      providerPhone: selectedProvider?.profile.phone,
      providerRating: selectedProvider?.rating,

      // Timestamps
      createdAt: new Date().toISOString(),
      status: "pending", // Initial status
    };

    console.log("Proposal Data:", proposalData);

    // TODO: Save to database/service
    // await saveProposal(proposalData);

    // router.push("/(authenticated)/customer/(tabs)/proposals");
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton onPress={finalizeProposal}>
          Confirm Proposal
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
                ₦{selectedService?.perHourPrice}/hour
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
                {selectedExtras.map((id: string) => {
                  const option = extraServiceOptions.find((o) => o.id === id);
                  return (
                    <HStack key={id} className="justify-between items-center">
                      <Text className="text-black font-inter-medium">
                        • {option?.name}
                      </Text>
                      <Text className="text-sm font-inter-bold text-brand-500">
                        +₦{option?.additionalPrice}
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
                <Text className="font-inter-medium">₦{pricing.basePrice}</Text>
              </HStack>
              {pricing.extrasPrice > 0 && (
                <HStack className="justify-between">
                  <Text className="text-gray-600">Extra Services</Text>
                  <Text className="font-inter-medium">
                    ₦{pricing.extrasPrice}
                  </Text>
                </HStack>
              )}
              <HStack className="justify-between pt-2 border-t border-brand-200">
                <Text className="text-lg font-inter-bold text-black">
                  Total
                </Text>
                <Text className="text-lg font-inter-bold text-brand-600">
                  ₦{pricing.total}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
