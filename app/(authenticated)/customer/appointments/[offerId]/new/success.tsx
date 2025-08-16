import { PrimaryButton } from "@/lib/components/custom-buttons";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { router } from "expo-router";
import { CheckCircle2 } from "lucide-react-native";

export default function SuccessStep() {
  return (
    <Box className="flex-1 bg-white justify-between">
      <Box className="flex-1 justify-center items-center">
        <Icon
          as={CheckCircle2}
          size="xl"
          className="text-green-500 mb-6"
          style={{ width: 80, height: 80 }}
        />

        <Text className="text-2xl font-bold text-center mb-4">
          Appointment Confirmed!
        </Text>

        <Text className="text-base text-center text-gray-600 px-4">
          We&apos;ve scheduled your cleaning session. You&apos;ll get a reminder
          before the appointment.
        </Text>
      </Box>

      <Box className="mb-6">
        <PrimaryButton onPress={() => router.replace("/customer")}>
          Back to Home
        </PrimaryButton>
      </Box>
    </Box>
  );
}
