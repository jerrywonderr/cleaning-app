import { SecondaryButton } from "@/lib/components/custom-buttons";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { FirebaseAuthService } from "@/lib/firebase/auth";
import { useSignOut } from "@/lib/hooks/useAuth";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable } from "react-native";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const signOut = useSignOut();
  const { isServiceProvider } = useUserStore();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const userEmail = FirebaseAuthService.getCurrentUser()?.email;

  // Auto-check verification status every 3 seconds
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let isRedirecting = false;

    const checkVerificationStatus = async () => {
      if (isRedirecting) return;

      try {
        await FirebaseAuthService.reloadUser();
        if (FirebaseAuthService.isEmailVerified()) {
          isRedirecting = true;
          clearInterval(interval);

          const redirectPath = isServiceProvider
            ? "/service-provider"
            : "/customer";

          Alert.alert(
            "Email Verified!",
            "Your email has been verified. Redirecting..."
          );

          // Auto-redirect after 1.5 seconds
          setTimeout(() => {
            router.replace(redirectPath);
          }, 1500);
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      }
    };

    // Check immediately
    checkVerificationStatus();

    // Then check every 3 seconds
    interval = setInterval(checkVerificationStatus, 3000);

    return () => {
      clearInterval(interval);
      isRedirecting = false;
    };
  }, [router, isServiceProvider]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await FirebaseAuthService.sendEmailVerification();
      setCountdown(60);
      Alert.alert(
        "Email Sent",
        "Verification email has been sent. Please check your inbox."
      );
    } catch (error: any) {
      console.error("Error resending verification email:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to send verification email. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut.mutateAsync();
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <FixedScreen>
      <VStack className="flex-1 justify-center items-center px-6">
        <Mail size={64} color="#6366f1" />

        <Text className="text-3xl font-inter-bold text-center mt-6 mb-2">
          Check Your Email
        </Text>

        <Text className="text-gray-600 text-center mb-1">
          Verification link sent to
        </Text>

        <Text className="font-inter-semibold text-brand-600 text-center mb-8">
          {userEmail}
        </Text>

        <Text className="text-sm text-brand-700 text-center mb-6">
          ⏳ Waiting for verification...
        </Text>

        <SecondaryButton
          onPress={handleResendVerification}
          isLoading={isResending}
          disabled={isResending || countdown > 0}
        >
          {countdown > 0 ? `Resend (${countdown}s)` : "Resend Email"}
        </SecondaryButton>

        <Pressable onPress={handleSignOut} className="mt-6">
          <Text className="text-gray-600 underline">Sign out</Text>
        </Pressable>
      </VStack>
    </FixedScreen>
  );
}
