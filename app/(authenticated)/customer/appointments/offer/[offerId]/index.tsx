import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Text } from "@/lib/components/ui/text";
import { useLocalSearchParams } from "expo-router";

export default function OfferAppointmentScreen() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();

  return (
    <FixedScreen>
      <Text>Appointments for Offer - {offerId}</Text>
    </FixedScreen>
  );
}
