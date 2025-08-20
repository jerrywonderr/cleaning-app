import { PrimaryButton } from "@/lib/components/custom-buttons";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  CreditCard,
  Lock,
  Plus,
  Wallet,
} from "lucide-react-native";

export default function BankAccountScreen() {
  const router = useRouter();
  const userId = useUserStore((state) => state.profile?.id);
  const {
    bankAccount,
    payoutAccount,
    transactionPin,
    isLoadingBankAccount,
    isLoadingPayoutAccount,
    isLoadingTransactionPin,
  } = useBankAccount();

  const isLoading =
    isLoadingBankAccount || isLoadingPayoutAccount || isLoadingTransactionPin;

  const handleProvisionAccount = () => {
    // Navigate to account provisioning screen
    router.push("/service-provider/account/bank-account/provision-account");
  };

  const handleManagePayoutAccount = () => {
    if (payoutAccount) {
      router.push("/service-provider/account/bank-account/payout-account");
    } else {
      router.push(
        "/service-provider/account/bank-account/create-payout-account"
      );
    }
  };

  const handleManageTransactionPin = () => {
    if (transactionPin) {
      router.push("/service-provider/account/bank-account/transaction-pin");
    } else {
      router.push(
        "/service-provider/account/bank-account/create-transaction-pin"
      );
    }
  };

  if (isLoading) {
    return (
      <ScrollableScreen addTopInset={false}>
        <Box className="flex-1">
          <VStack className="gap-4">
            <Text className="text-center text-gray-500">Loading...</Text>
          </VStack>
        </Box>
      </ScrollableScreen>
    );
  }

  // If no bank account exists, show provisioning screen
  if (!bankAccount) {
    return (
      <ScrollableScreen addTopInset={false}>
        <Box className="flex-1">
          <VStack className="gap-6 items-center justify-center flex-1">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-brand-100 rounded-full items-center justify-center">
                <Icon as={Wallet} size="xl" className="text-brand-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                No Bank Account Found
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                You need to provision a bank account first to manage your funds
                and access banking features.
              </Text>
            </Box>

            <PrimaryButton onPress={handleProvisionAccount} icon={Plus}>
              Provision Bank Account
            </PrimaryButton>
          </VStack>
        </Box>
      </ScrollableScreen>
    );
  }

  // If bank account exists, show management options
  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6">
          <Box className="bg-brand-50 rounded-lg p-4 border border-brand-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-brand-800">
                Account Status
              </Text>
              <HStack className="items-center gap-2">
                <Box className="w-3 h-3 bg-green-500 rounded-full" />
                <Text className="text-sm text-brand-700">
                  Bank Account Active
                </Text>
              </HStack>
              <Text className="text-xs text-brand-600">
                {bankAccount.bankName} • {bankAccount.accountNumber}
              </Text>
            </VStack>
          </Box>

          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              Banking Options
            </Text>

            <Pressable onPress={handleManagePayoutAccount}>
              <HStack className="bg-white rounded-lg border border-gray-200 p-4 justify-between items-center">
                <HStack className="gap-4 items-center">
                  <Box className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                    <Icon as={CreditCard} className="text-blue-600" />
                  </Box>
                  <VStack>
                    <Text className="font-inter-semibold text-black">
                      Payout Account
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {payoutAccount
                        ? "Manage your payout account"
                        : "Set up your payout account"}
                    </Text>
                  </VStack>
                </HStack>
                <Icon as={ArrowRight} className="text-gray-400" />
              </HStack>
            </Pressable>

            <Pressable onPress={handleManageTransactionPin}>
              <HStack className="bg-white rounded-lg border border-gray-200 p-4 justify-between items-center">
                <HStack className="gap-4 items-center">
                  <Box className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center">
                    <Icon as={Lock} className="text-green-600" />
                  </Box>
                  <VStack>
                    <Text className="font-inter-semibold text-black">
                      Transaction PIN
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {transactionPin
                        ? "Update your transaction PIN"
                        : "Set up your transaction PIN"}
                    </Text>
                  </VStack>
                </HStack>
                <Icon as={ArrowRight} className="text-gray-400" />
              </HStack>
            </Pressable>
          </VStack>

          <VStack className="gap-3 mt-4">
            <Text className="text-sm text-gray-500 text-center">
              Your bank account is used internally to manage funds and
              transactions
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
