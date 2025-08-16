import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";

export default function ConfirmStep() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();

  // const { data: appointment } = useQuery({
  //   queryKey: ["appointment", id],
  //   queryFn: () => getAppointment(id),
  // });

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={() =>
            router.push(`/customer/appointments/${offerId}/new/success`)
          }
        >
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
                123 Main St, Apt 4B
              </Text>
            </Box>

            <Box className="flex-row items-center">
              <Text className="text-lg mr-2">🧼</Text>
              <Text className="text-base text-gray-800">Deep Cleaning</Text>
            </Box>

            <Box className="flex-row items-center">
              <Text className="text-lg mr-2">🕒</Text>
              <Text className="text-base text-gray-800">
                Aug 2, 2025 at 10:00 AM
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </FootedScrollableScreen>
  );
}
