import { PrimaryButton } from "@/lib/components/custom-buttons";
import { TextField } from "@/lib/components/form/TextField";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import bookAppointmentSchema from "@/lib/schemas/book-appointment";
import { router, useLocalSearchParams } from "expo-router";
import { useFormContext } from "react-hook-form";
import { InferType } from "yup";

export default function AddressScreen() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const { watch } = useFormContext<InferType<typeof bookAppointmentSchema>>();

  // Watch the current address value for real-time validation
  const addressValue = watch("address");

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={() =>
            router.push(`/customer/appointments/${offerId}/new/service-type`)
          }
          disabled={!addressValue || addressValue.length < 10}
        >
          Next
        </PrimaryButton>
      }
    >
      <Box className="flex-1 bg-white pt-6 justify-between">
        <Box>
          <Text className="text-2xl font-bold mb-6 ">
            Where should we clean?
          </Text>

          <Text className="text-base mb-2">Enter your address below</Text>

          <VStack className="gap-4">
            <TextField placeholder="e.g. 123 Main St, Apt 4B" name="address" />

            <TextField
              placeholder="Any special instructions? (optional)"
              name="notes"
              multiline
              numberOfLines={3}
            />
          </VStack>
        </Box>
      </Box>
    </FootedScrollableScreen>
  );
}
