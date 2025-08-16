import { PrimaryButton } from "@/lib/components/custom-buttons";
import { TextField } from "@/lib/components/form/TextField";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";

export default function AddressScreen() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={() =>
            router.push(`/customer/appointments/${offerId}/new/service-type`)
          }
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

          <TextField placeholder="e.g. 123 Main St, Apt 4B" name="address" />
        </Box>
      </Box>
    </FootedScrollableScreen>
  );
}
