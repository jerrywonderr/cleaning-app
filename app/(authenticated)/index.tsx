import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Heading } from "@/lib/components/ui/heading";
import { Text } from "@/lib/components/ui/text";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function WelcomeSreen() {
  const { user } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        if (user?.isServiceProvider) {
          router.replace("/service-provider");
        } else {
          router.replace("/customer");
        }
      }, 1500); // Simulate a delay for the welcome screen
    }, [])
  );

  return (
    <FixedScreen>
      <Heading>Welcome to the App!</Heading>
      <Text>Enjoy our services.</Text>
    </FixedScreen>
  );
}

// Note: This is a placeholder component. You can replace it with your actual welcome screen content.
