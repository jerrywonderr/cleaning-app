import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useRouter } from "expo-router";
import {
  Banknote,
  CheckCircle,
  ChevronRight,
  Shield,
  Wallet,
} from "lucide-react-native";

type BankAccountRoute = "provision-account" | "transaction-pin";

export default function BankAccountScreen() {
  const router = useRouter();
  const {
    stripeConnectAccount,
    isLoadingStripeAccount,
    transactionPin,
    isLoadingTransactionPin,
  } = useBankAccount();

  const handleNavigate = (route: BankAccountRoute) => {
    // Only block navigation if account is fully active/completed
    if (
      route === "provision-account" &&
      stripeConnectAccount &&
      (stripeConnectAccount.stripeAccountStatus === "active" ||
        stripeConnectAccount.stripeAccountStatus === "completed")
    ) {
      return;
    }
    router.push(`/service-provider/account/bank-account tick/${route}` as any);
  };

  const getStatusIcon = (isSet: boolean) => {
    return isSet ? (
      <Icon as={CheckCircle} className="text-green-500" />
    ) : (
      <Icon as={ChevronRight} className="text-gray-400" />
    );
  };

  const getTransactionPinStatusText = () => {
    if (!transactionPin || isLoadingTransactionPin) return "Set up now";
    return "Active";
  };

  const getStripeStatusText = () => {
    if (!stripeConnectAccount) return "Set up now";

    switch (stripeConnectAccount.stripeAccountStatus) {
      case "pending":
        return "Onboarding required";
      case "active":
      case "completed":
        return "Active - receiving payments";
      case "restricted":
        return "Restricted - contact support";
      case "rejected":
        return "Rejected - contact support";
      default:
        return "Set up now";
    }
  };

  const getStripeStatusIcon = () => {
    if (!stripeConnectAccount) {
      return <Icon as={ChevronRight} className="text-gray-400" />;
    }

    switch (stripeConnectAccount.stripeAccountStatus) {
      case "active":
      case "completed":
        return <Icon as={CheckCircle} className="text-green-500" />;
      case "pending":
        return <Icon as={ChevronRight} className="text-yellow-500" />;
      case "restricted":
      case "rejected":
        return <Icon as={ChevronRight} className="text-red-500" />;
      default:
        return <Icon as={ChevronRight} className="text-gray-400" />;
    }
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6">
          <Box className="items-center gap-4">
            <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
              <Icon as={Wallet} size="xl" className="text-green-600" />
            </Box>
            <Text className="text-xl font-inter-bold text-black text-center">
              Bank Account Management
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              Manage your internal account, payout accounts, and transaction
              security.
            </Text>
          </Box>

          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              Account Status
            </Text>

            {/* Stripe Connect Account */}
            <Pressable
              disabled={isLoadingStripeAccount}
              onPress={() => handleNavigate("provision-account")}
            >
              <HStack className="bg-white rounded-lg border border-gray-200 p-4 justify-between items-center">
                <HStack className="gap-4 items-center">
                  <Box className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                    <Icon as={Banknote} className="text-blue-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="font-inter-semibold text-black">
                      Stripe Connect Account
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {getStripeStatusText()}
                    </Text>
                  </VStack>
                  {getStripeStatusIcon()}
                </HStack>
              </HStack>
            </Pressable>

            {/* Transaction PIN */}
            <Pressable
              disabled={isLoadingTransactionPin}
              onPress={() => handleNavigate("transaction-pin")}
            >
              <HStack className="bg-white rounded-lg border border-gray-200 p-4 justify-between items-center">
                <HStack className="gap-4 items-center">
                  <Box className="w-10 h-10 bg-purple-100 rounded-lg items-center justify-center">
                    <Icon as={Shield} className="text-purple-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="font-inter-semibold text-black">
                      Transaction PIN
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {getTransactionPinStatusText()}
                    </Text>
                  </VStack>
                  {getStatusIcon(!!transactionPin)}
                </HStack>
              </HStack>
            </Pressable>
          </VStack>

          <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-blue-800">
                How it works
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Stripe Connect: Your payment processing account
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Transaction PIN: Required for all payout account operations
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Payout Accounts: Your real bank accounts for receiving
                payments
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • You can have multiple payout accounts but only one default
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
