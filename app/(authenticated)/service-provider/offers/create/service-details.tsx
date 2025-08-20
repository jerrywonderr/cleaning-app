import {
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import { PickerField, TextField } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { VStack } from "@/lib/components/ui/vstack";
import { CreateOfferFormData } from "@/lib/schemas/create-offer";
import { router } from "expo-router";
import { useFormContext } from "react-hook-form";

const durationOptions = [
  { label: "1 hour", value: 1 },
  { label: "2 hours", value: 2 },
  { label: "3 hours", value: 3 },
  { label: "4 hours", value: 4 },
  { label: "5 hours", value: 5 },
  { label: "6 hours", value: 6 },
  { label: "8 hours", value: 8 },
  { label: "10 hours", value: 10 },
  { label: "12 hours", value: 12 },
  { label: "24 hours", value: 24 },
];

export default function ServiceDetailsStep() {
  const { watch } = useFormContext<CreateOfferFormData>();
  const formData = watch();

  const isStepValid =
    formData.price &&
    formData.price > 0 &&
    formData.duration &&
    formData.duration > 0;

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <VStack className="gap-3">
          <PrimaryButton
            onPress={() =>
              router.push("/service-provider/offers/create/service-content")
            }
            disabled={!isStepValid}
          >
            Next
          </PrimaryButton>
          <PrimaryOutlineButton onPress={() => router.back()}>
            Back
          </PrimaryOutlineButton>
        </VStack>
      }
    >
      <StepIndicator steps={4} currentStep={2} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-4">
          <TextField
            name="price"
            label="Price (₦) *"
            placeholder="Enter price"
            keyboardType="numeric"
            helperText="Enter the price in Nigerian Naira"
          />

          <PickerField
            name="duration"
            label="Duration *"
            items={durationOptions}
            placeholder="Select duration"
            helperText="How long will this service take?"
          />
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
