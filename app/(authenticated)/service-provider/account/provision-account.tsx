import {
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { useLoader } from "@/lib/components/ui/loader";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { StripeAccountSetupData } from "@/lib/types/bank-account";
import { useRouter } from "expo-router";
import { Banknote, ExternalLink } from "lucide-react-native";
import { useState } from "react";
import { Alert, Linking } from "react-native";

export default function ProvisionAccountScreen() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const {
    stripeConnectAccount,
    setupStripeConnectAccount,
    isSettingUpStripeAccount,
    getOnboardingUrl,
    isLoadingOnboardingUrl,
    checkStripeAccountStatus,
    isCheckingStatus,
  } = useBankAccount();
  const { showLoader, hideLoader } = useLoader();
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string | null>(null);

  // Check if account is fully set up
  const isAccountFullySetup =
    stripeConnectAccount &&
    (stripeConnectAccount.stripeAccountStatus === "active" ||
      stripeConnectAccount.stripeAccountStatus === "completed");

  const handleSetupStripeConnect = async () => {
    if (!profile) return;

    try {
      showLoader("Setting up Stripe account...");
      // Prepare account setup data
      // const accountData: StripeAccountSetupData = {
      //   firstName: profile.firstName,
      //   lastName: profile.lastName,
      //   email: profile.email,
      //   phone: profile.phone,
      //   address: {
      //     line1: "123 Main Street", // You'll need to collect this from user
      //     city: "Lagos",
      //     state: "Lagos",
      //     postalCode: "100001",
      //     // country: "NG",
      //     country: "US",
      //   },
      // };

      const accountData: StripeAccountSetupData = {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "jerrycul2001@gmail.com",
        phone: "+1-415-555-0199",
        address: {
          line1: "456 Oak Avenue",
          city: "Oakland",
          state: "CA",
          postalCode: "94607",
          country: "US",
        },
      };

      const result = await setupStripeConnectAccount(accountData);

      if (result.success) {
        Alert.alert(
          "Stripe Connect Account Created",
          "Your Stripe Connect account has been created successfully. You can now complete the onboarding process.",
          [
            {
              text: "Complete Onboarding",
              onPress: handleGetOnboardingUrl,
            },
            {
              text: "Later",
              style: "cancel",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      console.log(error.message);
      Alert.alert(
        "Setup Failed",
        error.message || "Failed to set up Stripe Connect account"
      );
    } finally {
      hideLoader();
    }
  };

  const handleGetOnboardingUrl = async () => {
    try {
      showLoader("Fetching onboarding link...");
      const result = await getOnboardingUrl();

      if (result.success && result.onboardingUrl) {
        setOnboardingUrl(result.onboardingUrl);
        setAccountStatus(result.status);

        Alert.alert(
          "Complete Your Setup",
          "Click the button below to complete your Stripe Connect onboarding and start receiving payments.",
          [
            {
              text: "Open Onboarding",
              onPress: () => {
                Linking.openURL(result.onboardingUrl!);
              },
            },
            {
              text: "Later",
              style: "cancel",
            },
          ]
        );
      } else if (result.success && !result.needsOnboarding) {
        Alert.alert(
          "Account Complete",
          "Your Stripe Connect account is already fully set up and ready to receive payments!",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to get onboarding URL");
    } finally {
      hideLoader();
    }
  };

  const handleCheckStatus = async () => {
    try {
      showLoader("Refreshing Stripe status...");
      const result = await checkStripeAccountStatus();
      setAccountStatus(result.status);

      if (result.status === "completed") {
        Alert.alert(
          "Account Active",
          "Your Stripe Connect account is fully set up and ready to receive payments!",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          "Account Status",
          `Your account status: ${result.status}. ${
            result.message || "Complete onboarding to start receiving payments."
          }`,
          [
            {
              text: "OK",
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to check account status");
    } finally {
      hideLoader();
    }
  };

  const handleCompleteOnboarding = () => {
    if (onboardingUrl) {
      Linking.openURL(onboardingUrl);
    }
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6 my-4">
          {isAccountFullySetup ? (
            // Account is fully set up - Show success state
            <>
              <Box className="items-center gap-4">
                <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                  <Text className="text-4xl">✓</Text>
                </Box>
                <Text className="text-xl font-inter-bold text-black text-center">
                  Account Ready
                </Text>
                <Text className="text-sm text-gray-600 text-center leading-5">
                  Your Stripe Connect account is fully set up and ready to
                  receive payments!
                </Text>
              </Box>

              <Box className="bg-green-50 rounded-lg p-4 border border-green-200">
                <VStack className="gap-2">
                  <Text className="text-sm font-inter-medium text-green-800">
                    You&apos;re all set! 🎉
                  </Text>
                  <Text className="text-xs text-green-700 leading-4">
                    ✓ Receive payments directly to your bank account
                  </Text>
                  <Text className="text-xs text-green-700 leading-4">
                    ✓ Daily payouts for better cash flow
                  </Text>
                  <Text className="text-xs text-green-700 leading-4">
                    ✓ Track your earnings and transactions
                  </Text>
                </VStack>
              </Box>

              <VStack className="gap-3">
                <PrimaryButton
                  onPress={() =>
                    router.push("/service-provider/account/balance")
                  }
                  icon={Banknote}
                >
                  View Balance & Transactions
                </PrimaryButton>

                <PrimaryOutlineButton
                  onPress={handleCheckStatus}
                  disabled={isCheckingStatus}
                >
                  {isCheckingStatus ? "Checking..." : "Check Account Status"}
                </PrimaryOutlineButton>

                <Text className="text-xs text-gray-500 text-center mt-2">
                  Powered by Stripe for secure payment processing
                </Text>
              </VStack>
            </>
          ) : (
            // Account not set up yet - Show setup state
            <>
              <Box className="items-center gap-4">
                <Text className="text-sm text-gray-600 leading-5">
                  Set up your Stripe Connect account to receive payments from
                  customers directly to your bank account.
                </Text>
              </Box>

              <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <VStack className="gap-2">
                  <Text className="text-sm font-inter-medium text-blue-800">
                    What happens next?
                  </Text>
                  <Text className="text-xs text-blue-700 leading-4">
                    • We&apos;ll create your Stripe Connect account
                  </Text>
                  <Text className="text-xs text-blue-700 leading-4">
                    • You&apos;ll complete onboarding with Stripe
                  </Text>
                  <Text className="text-xs text-blue-700 leading-4">
                    • You&apos;ll receive payments directly to your bank account
                  </Text>
                  <Text className="text-xs text-blue-700 leading-4">
                    • Daily payouts for better cash flow
                  </Text>
                </VStack>
              </Box>

              <VStack className="gap-3">
                <PrimaryButton
                  onPress={handleSetupStripeConnect}
                  disabled={isSettingUpStripeAccount}
                  icon={Banknote}
                >
                  {isSettingUpStripeAccount
                    ? "Setting up account..."
                    : "Set Up Stripe Connect"}
                </PrimaryButton>

                <PrimaryOutlineButton
                  onPress={handleGetOnboardingUrl}
                  disabled={isLoadingOnboardingUrl}
                  icon={ExternalLink}
                >
                  {isLoadingOnboardingUrl
                    ? "Getting onboarding URL..."
                    : "Get Onboarding URL"}
                </PrimaryOutlineButton>

                <PrimaryOutlineButton
                  onPress={handleCheckStatus}
                  disabled={isCheckingStatus}
                >
                  {isCheckingStatus
                    ? "Reloading status..."
                    : "Reload Account Status"}
                </PrimaryOutlineButton>

                {onboardingUrl && (
                  <PrimaryOutlineButton
                    onPress={handleCompleteOnboarding}
                    icon={ExternalLink}
                  >
                    Complete Onboarding
                  </PrimaryOutlineButton>
                )}

                {accountStatus && (
                  <Text className="text-sm text-gray-600 text-center">
                    Current Status: {accountStatus}
                  </Text>
                )}

                <Text className="text-xs text-gray-500 text-center">
                  Powered by Stripe for secure payment processing
                </Text>
              </VStack>
            </>
          )}
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
