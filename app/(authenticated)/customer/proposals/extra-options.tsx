import { PrimaryButton } from "@/lib/components/custom-buttons";
import ExtraServiceOptionCard from "@/lib/components/ExtraServiceOptionCard";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { extraServiceOptions } from "@/lib/constants/service-config";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { router } from "expo-router";
import { useFormContext } from "react-hook-form";

export default function SelectExtraOptions() {
  const { watch, setValue } = useFormContext<CreateProposalFormData>();
  const selectedExtras = watch("extraOptions") || [];

  const toggleOption = (optionId: string) => {
    if (!Array.isArray(selectedExtras)) {
      setValue("extraOptions", [optionId]);
      return;
    }

    if (selectedExtras.includes(optionId)) {
      setValue(
        "extraOptions",
        selectedExtras.filter((id) => id !== optionId)
      );
    } else {
      setValue("extraOptions", [...selectedExtras, optionId]);
    }
  };

  const handleNext = () => {
    router.push("/customer/proposals/final-proposal");
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={<PrimaryButton onPress={handleNext}>Next</PrimaryButton>}
    >
      <StepIndicator steps={6} currentStep={5} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-4">
          {/* Page Title */}
          <Text className="text-2xl font-inter-bold text-black">
            Select Extra Services
          </Text>
          <Text className="text-gray-500 mb-2">
            Optional: add extra services to your cleaning
          </Text>

          {/* Extra Options List */}
          <VStack className="gap-3">
            {extraServiceOptions.map((option) => {
              const isSelected = selectedExtras.includes(option.id);

              return (
                <ExtraServiceOptionCard
                  key={option.id}
                  option={option}
                  showToggle={false}
                  onToggle={() => toggleOption(option.id)}
                  className={`border rounded-lg overflow-hidden ${
                    isSelected
                      ? "border-brand-600 bg-brand-50"
                      : "border-gray-200 bg-white"
                  }`}
                />
              );
            })}
          </VStack>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
