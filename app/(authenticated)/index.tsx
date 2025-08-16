import { VStack } from "@/lib/components/ui/vstack";
import { useIsAuthenticated, useUserType } from "@/lib/hooks/useAuth";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Image } from "react-native";

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

  return (
    <VStack className="bg-black flex-1 items-center justify-center">
      <Image
        source={require("@/assets/images/icon.png")}
        className="w-48 h-48"
        resizeMode="contain"
      />
    </VStack>
  );
}

// Note: This is a placeholder component. You can replace it with your actual welcome screen content.
