import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Text } from "@/lib/components/ui/text";
import { useLocalSearchParams } from "expo-router";

export default function ViewAppointmentScreen() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId: string }>();

  return (
    <FixedScreen addTopInset={false}>
      <Text>Appointment {appointmentId}</Text>
    </FixedScreen>
  );
}
