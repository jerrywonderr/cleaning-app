import { PrimaryButton } from "@/lib/components/custom-buttons";
import { Box } from "@/lib/components/ui/box";
import { router } from "expo-router";

export default function AppointmentsScreen() {
  return (
    <Box className="flex-1 items-center justify-center bg-white">
      <PrimaryButton onPress={() => router.push("/book/address")}>
          Book a cleaning appointment
      </PrimaryButton>
    </Box>
  );
}
