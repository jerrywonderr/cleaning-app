import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { useCreateAppointment } from "@/lib/hooks/useAppointments";
import bookAppointmentSchema from "@/lib/schemas/book-appointment";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useFormContext } from "react-hook-form";
import { Alert } from "react-native";
import { InferType } from "yup";

export default function ConfirmStep() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const { watch, handleSubmit } =
    useFormContext<InferType<typeof bookAppointmentSchema>>();

  const createAppointmentMutation = useCreateAppointment();

  // Watch all form values to display them
  const formValues = watch();

  const onSubmit = async (data: InferType<typeof bookAppointmentSchema>) => {
    try {
      // Create the appointment data
      const appointmentData = {
        offerId: offerId,
        serviceType: data.serviceType,
        address: data.address,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        notes: data.notes,
      };

      // Create the appointment
      await createAppointmentMutation.mutateAsync(appointmentData);

      // Navigate to success screen
      router.push(`/customer/appointments/offer/${offerId}/new/success`);
    } catch (error: any) {
      Alert.alert("Error", `Failed to create appointment: ${error.message}`, [
        { text: "OK" },
      ]);
    }
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === "string") {
      return format(new Date(date), "MMM d, yyyy");
    }
    return format(date, "MMM d, yyyy");
  };

  const formatTime = (time: Date | string) => {
    if (typeof time === "string") {
      return format(new Date(time), "h:mm a");
    }
    return format(time, "h:mm a");
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={handleSubmit(onSubmit)}
          disabled={createAppointmentMutation.isPending}
        >
          {createAppointmentMutation.isPending
            ? "Creating..."
            : "Confirm Appointment"}
        </PrimaryButton>
      }
    >
      <StepIndicator steps={4} currentStep={4} />
      <Box className="flex-1 bg-white pt-6 justify-between">
        <Box>
          {/* <Text className="text-2xl font-bold mb-6">Confirm Details</Text> */}

          <Text className="text-base mb-4">
            Please review your booking information
          </Text>

          <Box className="bg-gray-50 p-4 rounded-xl space-y-3">
            <Box className="flex-row items-center">
              <Text className="text-lg mr-2">📍</Text>
              <Text className="text-base text-gray-800">
                {formValues.address || "Address not set"}
              </Text>
            </Box>

            <Box className="flex-row items-center">
              <Text className="text-lg mr-2">🧼</Text>
              <Text className="text-base text-gray-800">
                {formValues.serviceType || "Service type not selected"}
              </Text>
            </Box>

            <Box className="flex-row items-center">
              <Text className="text-lg mr-2">🕒</Text>
              <Text className="text-base text-gray-800">
                {formValues.scheduledDate && formValues.scheduledTime
                  ? `${formatDate(formValues.scheduledDate)} at ${formatTime(
                      formValues.scheduledTime
                    )}`
                  : "Date/time not set"}
              </Text>
            </Box>

            {formValues.notes && (
              <Box className="flex-row items-center">
                <Text className="text-lg mr-2">📝</Text>
                <Text className="text-base text-gray-800">
                  {formValues.notes}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </FootedScrollableScreen>
  );
}
