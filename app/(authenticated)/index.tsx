import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Heading } from "@/lib/components/ui/heading";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useIsAuthenticated, useUserType } from "@/lib/hooks/useAuth";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function WelcomeSreen() {
  const { isLoading: authLoading } = useIsAuthenticated();
  const { isServiceProvider, isLoading: profileLoading } = useUserType();

  const isLoading = authLoading || profileLoading;

  useFocusEffect(
    useCallback(() => {
      if (isLoading) return;

      const timeout = setTimeout(() => {
        if (isServiceProvider) {
          router.replace("/service-provider");
        } else {
          router.replace("/customer");
        }
      }, 1500); // Simulate a delay for the welcome screen

      return () => clearTimeout(timeout);
    }, [isServiceProvider, isLoading])
  );

  if (isLoading) {
    return (
      <FixedScreen>
        <VStack className="flex-1 items-center justify-center gap-6">
          <Text>Loading...</Text>
        </VStack>
      </FixedScreen>
    );
  }

  return (
    <FixedScreen>
      <VStack className="flex-1 items-center justify-center gap-6">
        <Heading>Welcome to the App!</Heading>
        <Text>Enjoy our services.</Text>
      </VStack>
    </FixedScreen>
  );
}

// Note: This is a placeholder component. You can replace it with your actual welcome screen content.
