import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Heading } from "@/lib/components/ui/heading";
import { Text } from "@/lib/components/ui/text";

export default function WelcomeSreen() {
  return (
    <FixedScreen>
      <Heading>Welcome to the App!</Heading>
      <Text>Please log in to continue.</Text>
    </FixedScreen>
  );
}

// Note: This is a placeholder component. You can replace it with your actual welcome screen content.
