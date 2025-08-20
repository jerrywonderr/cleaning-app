import {
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { router } from "expo-router";
import { Plus, X } from "lucide-react-native";
import { useFormContext } from "react-hook-form";
import { Alert } from "react-native";

export default function ServiceContentStep() {
  const { watch, setValue } = useFormContext();
  const formData = watch();

  const addWhatIncluded = () => {
    Alert.prompt("Add Service Item", "What's included in this service?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add",
        onPress: (text) => {
          if (text && text.trim()) {
            const current = formData.whatIncluded || [];
            setValue("whatIncluded", [...current, text.trim()]);
          }
        },
      },
    ]);
  };

  const removeWhatIncluded = (index: number) => {
    const current = formData.whatIncluded || [];
    setValue(
      "whatIncluded",
      current.filter((_: string, i: number) => i !== index)
    );
  };

  const addRequirement = () => {
    Alert.prompt("Add Requirement", "What does the customer need to prepare?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add",
        onPress: (text) => {
          if (text && text.trim()) {
            const current = formData.requirements || [];
            setValue("requirements", [...current, text.trim()]);
          }
        },
      },
    ]);
  };

  const removeRequirement = (index: number) => {
    const current = formData.requirements || [];
    setValue(
      "requirements",
      current.filter((_: string, i: number) => i !== index)
    );
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <VStack className="gap-3">
          <PrimaryButton
            onPress={() =>
              router.push("/service-provider/offers/create/review")
            }
          >
            Next
          </PrimaryButton>
          <PrimaryOutlineButton onPress={() => router.back()}>
            Back
          </PrimaryOutlineButton>
        </VStack>
      }
    >
      <StepIndicator steps={4} currentStep={3} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-6">
          {/* What's Included */}
          <Box>
            <HStack className="justify-between items-center mb-2">
              <Text className="text-base font-inter-semibold text-gray-900">
                What&apos;s Included
              </Text>
              <Pressable onPress={addWhatIncluded}>
                <Box className="bg-brand-500 p-2 rounded-full">
                  <Icon as={Plus} className="text-white" size="sm" />
                </Box>
              </Pressable>
            </HStack>
            <VStack className="gap-2">
              {(formData.whatIncluded || []).map(
                (item: string, index: number) => (
                  <HStack
                    key={index}
                    className="items-center gap-2 bg-gray-50 p-3 rounded-lg"
                  >
                    <Text className="flex-1 text-gray-700">{item}</Text>
                    <Pressable onPress={() => removeWhatIncluded(index)}>
                      <Box className="bg-red-100 p-1 rounded-full">
                        <Icon as={X} className="text-red-600" size="sm" />
                      </Box>
                    </Pressable>
                  </HStack>
                )
              )}
              {(formData.whatIncluded || []).length === 0 && (
                <Text className="text-gray-500 text-sm italic">
                  No items added yet. Tap the + button to add services.
                </Text>
              )}
            </VStack>
          </Box>

          {/* Requirements */}
          <Box>
            <HStack className="justify-between items-center mb-2">
              <Text className="text-base font-inter-semibold text-gray-900">
                Customer Requirements
              </Text>
              <Pressable onPress={addRequirement}>
                <Box className="bg-brand-500 p-2 rounded-full">
                  <Icon as={Plus} className="text-white" size="sm" />
                </Box>
              </Pressable>
            </HStack>
            <VStack className="gap-2">
              {(formData.requirements || []).map(
                (item: string, index: number) => (
                  <HStack
                    key={index}
                    className="items-center gap-2 bg-gray-50 p-3 rounded-lg"
                  >
                    <Text className="flex-1 text-gray-700">{item}</Text>
                    <Pressable onPress={() => removeRequirement(index)}>
                      <Box className="bg-red-100 p-1 rounded-full">
                        <Icon as={X} className="text-red-600" size="sm" />
                      </Box>
                    </Pressable>
                  </HStack>
                )
              )}
              {(formData.requirements || []).length === 0 && (
                <Text className="text-gray-500 text-sm italic">
                  No requirements added yet. Tap the + button to add
                  requirements.
                </Text>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
