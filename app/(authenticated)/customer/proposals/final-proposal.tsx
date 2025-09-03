import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  extraServiceOptions,
  serviceConfigs,
} from "@/lib/constants/service-config";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";

export default function FinalProposalPage() {
  const router = useRouter();
  const { watch } = useFormContext();

  const serviceId = watch("serviceId");
  const providerId = watch("providerId");
  const selectedDate = watch("proposalDetails.date");
  const selectedTimeRange = watch("proposalDetails.timeRange");
  const selectedExtras = watch("extraOptions") || [];
  const selectedLocation = watch("location");

  const selectedService = serviceConfigs.find((s) => s.id === serviceId);

  const formatLocation = (loc: any) => {
    if (!loc) return "No address selected";
    return (
      loc.fullAddress ||
      `${loc.streetNumber} ${loc.streetName}, ${loc.city}, ${loc.state}, ${loc.country}`
    );
  };

  const finalizeProposal = () => {
    // Handle final submission logic here
    console.log({
      serviceId,
      providerId,
      date: selectedDate,
      timeRange: selectedTimeRange,
      extras: selectedExtras,
      location: selectedLocation,
    });
    router.push("/(authenticated)/customer/(tabs)/proposals");
  };

  return (
    <FootedScrollableScreen
      footer={
        <PrimaryButton onPress={finalizeProposal}>
          Confirm Proposal
        </PrimaryButton>
      }
    >
      <VStack className="gap-6">
        {/* Page Title */}
        <Text className="text-2xl font-inter-bold text-black">
          Review Your Proposal
        </Text>
        <Text className="text-gray-500">
          Please review all details before confirming your booking.
        </Text>

        {/* Service */}
        <Box className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-lg font-inter-bold text-black mb-1">
            Selected Service
          </Text>
          <Text className="text-black font-inter-medium">
            {selectedService?.name}
          </Text>
          <Text className="text-gray-600">{selectedService?.description}</Text>
        </Box>

        {/* Date & Time */}
        <Box className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-lg font-inter-bold text-black mb-1">
            Date & Time
          </Text>
          <Text className="text-black font-inter-medium">
            {selectedDate instanceof Date
              ? selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : selectedDate}
          </Text>
          <Text className="text-gray-600">{selectedTimeRange}</Text>
        </Box>

        {/* Extras */}
        <Box className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-lg font-inter-bold text-black mb-1">
            Extra Options
          </Text>
          {selectedExtras.length > 0 ? (
            selectedExtras.map((id: string) => {
              const option = extraServiceOptions.find((o) => o.id === id);
              return (
                <Text key={id} className="text-black font-inter-medium">
                  • {option?.name} (+₦{option?.additionalPrice})
                </Text>
              );
            })
          ) : (
            <Text className="text-gray-600">No extra options selected</Text>
          )}
        </Box>

        {/* Location */}
        <Box className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-lg font-inter-bold text-black mb-1">
            Location
          </Text>
          <Text className="text-black font-inter-medium">
            {formatLocation(selectedLocation)}
          </Text>
        </Box>
      </VStack>
    </FootedScrollableScreen>
  );
}
