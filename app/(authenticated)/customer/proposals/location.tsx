import { PrimaryButton } from "@/lib/components/custom-buttons";
import { AddressField, AddressFieldRef } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { router } from "expo-router";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";

export default function LocationScreen() {
  const { watch } = useFormContext<CreateProposalFormData>();
  const selectedLocation = watch("location");

  const addressRef = useRef<AddressFieldRef>(null);

  const handleNext = () => {
    if (!selectedLocation) {
      alert("Please select a location");
      return;
    }

    router.push("/customer/proposals/select-provider");
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton onPress={handleNext} disabled={!selectedLocation}>
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
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
