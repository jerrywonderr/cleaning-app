import { PrimaryButton } from "@/lib/components/custom-buttons";
import ExtraServiceOptionCard from "@/lib/components/ExtraServiceOptionCard";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { extraServiceOptions } from "@/lib/constants/service-config";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";

export default function SelectExtraOptions() {
  const { watch, setValue } = useFormContext();
  const router = useRouter();

  const selectedExtras = watch("extraOptions") || [];

  const toggleOption = (optionId: string) => {
    if (!Array.isArray(selectedExtras)) {
      setValue("extraOptions", [optionId]);
      return;
    }

    if (selectedExtras.includes(optionId)) {
      setValue(
        "extraOptions",
        selectedExtras.filter((id: string) => id !== optionId)
      );
    } else {
      setValue("extraOptions", [...selectedExtras, optionId]);
    }
  };

  const handleNext = () => {
    router.push("/(authenticated)/customer/proposals/final-proposal");
  };

  return (
    <FootedScrollableScreen
      footer={<PrimaryButton onPress={handleNext}>Next</PrimaryButton>}
    >
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
    </FootedScrollableScreen>
  );
}
