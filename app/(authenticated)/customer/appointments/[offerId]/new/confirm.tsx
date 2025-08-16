import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import bookAppointmentSchema from "@/lib/schemas/book-appointment";
import { format } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useFormContext } from "react-hook-form";
import { InferType } from "yup";

export default function ConfirmStep() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const { watch, handleSubmit } =
    useFormContext<InferType<typeof bookAppointmentSchema>>();

  // Watch all form values to display them
  const formValues = watch();

  const onSubmit = (data: InferType<typeof bookAppointmentSchema>) => {
    console.log("Form submitted:", data);
    // Here you would typically send the data to your API
    // For now, just navigate to success
    router.push(`/customer/appointments/${offerId}/new/success`);
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
        <PrimaryButton onPress={handleSubmit(onSubmit)}>
          Confirm Appointment
        </PrimaryButton>
      }
    >
      <Box className="flex-1 bg-white justify-between">
        <Box>
          <Text className="text-2xl font-bold mb-6">Confirm Details</Text>

          <Text className="text-base mb-6">
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
                {formValues.date && formValues.time
                  ? `${formatDate(formValues.date)} at ${formatTime(
                      formValues.time
                    )}`
                  : "Date/time not set"}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </FootedScrollableScreen>
  );
}
