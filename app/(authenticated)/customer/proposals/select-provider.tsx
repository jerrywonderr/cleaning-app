import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { router } from "expo-router";
import { useFormContext } from "react-hook-form";

const serviceProviders = [
  {
    id: "provider-1",
    name: "CleanCo Experts",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    workingHours: { start: "09:00", end: "17:00" },
  },
  {
    id: "provider-2",
    name: "Sparkle Team",
    workingDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    workingHours: { start: "10:00", end: "18:00" },
  },
  {
    id: "provider-3",
    name: "Shiny Homes",
    workingDays: ["Mon", "Wed", "Fri", "Sat"],
    workingHours: { start: "08:00", end: "14:00" },
  },
];

export default function SelectProviderScreen() {
  const { watch, setValue } = useFormContext<CreateProposalFormData>();
  const selectedProvider = watch("providerId");

  const handleNext = () => {
    if (!selectedProvider) {
      alert("Please select a provider");
      return;
    }
    router.push("/customer/proposals/create-proposal");
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

          <VStack className="gap-4">
            {serviceProviders.map((provider) => (
              <Pressable
                key={provider.id}
                onPress={() => setValue("providerId", provider.id)}
                className={`p-4 border rounded-lg ${
                  selectedProvider === provider.id
                    ? "border-brand-600 bg-brand-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <Text className="text-black font-inter-medium">
                  {provider.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {provider.workingDays.join(", ")} |{" "}
                  {provider.workingHours.start} - {provider.workingHours.end}
                </Text>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
