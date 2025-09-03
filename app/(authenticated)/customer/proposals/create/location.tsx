import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedFixedScreen from "@/lib/components/screens/FootedFixedScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { LocationAndProviderSelection } from "@/lib/features/proposals/create";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { router } from "expo-router";
import { useFormContext } from "react-hook-form";
import { Alert } from "react-native";

export default function LocationScreen() {
  const { watch } = useFormContext<CreateProposalFormData>();
  const selectedLocation = watch("location");
  const selectedProvider = watch("providerId");

  const handleNext = () => {
    if (!selectedLocation) {
      Alert.alert("Location Required", "Please select a location");
      return;
    }
    if (!selectedProvider) {
      Alert.alert("Selection Required", "Please select a service provider");
      return;
    }
    router.push("/customer/proposals/create/create-proposal");
  };

  return (
    <FootedFixedScreen
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
        <LocationAndProviderSelection />
      </Box>
    </FootedFixedScreen>
  );
}
