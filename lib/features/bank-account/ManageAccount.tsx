import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  BankAccount,
  PayoutAccount,
  TransactionPin,
} from "@/lib/types/bank-account";
import { useRouter } from "expo-router";
import { ChevronRight, CreditCard, Lock } from "lucide-react-native";

interface ManageAccountProps {
  bankAccount: BankAccount;
  payoutAccount?: PayoutAccount;
  transactionPin?: TransactionPin;
}

export default function ManageAccount({
  bankAccount,
  payoutAccount,
  transactionPin,
}: ManageAccountProps) {
  const router = useRouter();

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

  return (
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
              <Icon as={ChevronRight} className="text-gray-400" />
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
              <Icon as={ChevronRight} className="text-gray-400" />
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
  );
}
