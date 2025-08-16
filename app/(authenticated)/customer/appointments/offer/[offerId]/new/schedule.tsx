import { PrimaryButton } from "@/lib/components/custom-buttons";
import { DateField } from "@/lib/components/form/DateField";
import { TimeField } from "@/lib/components/form/TimeField";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import bookAppointmentSchema from "@/lib/schemas/book-appointment";
import { router, useLocalSearchParams } from "expo-router";
import { useFormContext } from "react-hook-form";
import { InferType } from "yup";

export default function ScheduleStep() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const { watch } = useFormContext<InferType<typeof bookAppointmentSchema>>();

  // Watch the current date and time values for validation
  const selectedDate = watch("scheduledDate");
  const selectedTime = watch("scheduledTime");

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={() =>
            router.push(`/customer/appointments/offer/${offerId}/new/confirm`)
          }
          disabled={!selectedDate || !selectedTime}
        >
          Next
        </PrimaryButton>
      }
    >
      <StepIndicator steps={4} currentStep={3} />
      <Box className="flex-1 bg-white pt-6 justify-between">
        <Box>
          {/* <Text className="text-2xl font-bold mb-6">When should we come?</Text> */}
          <Text className="text-base mb-4">
            Pick a convenient date and time
          </Text>

          <VStack className="gap-4">
            <DateField
              name="scheduledDate"
              label="Pick a date"
              placeholder="Select date"
            />
            <TimeField
              name="scheduledTime"
              label="Pick a time"
              placeholder="Select time"
            />
          </VStack>
        </Box>
      </Box>
    </FootedScrollableScreen>
  );
}
