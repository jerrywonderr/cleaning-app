import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { PayoutAccount } from "@/lib/types/bank-account";
import { useRouter } from "expo-router";
import {
  Banknote,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Plus,
  Shield,
  Wallet,
} from "lucide-react-native";

type BankAccountRoute =
  | "provision-account"
  | "transaction-pin"
  | "create-payout-account"
  | "payout-account";

export default function BankAccountScreen() {
  const router = useRouter();
  const userId = useUserStore((state) => state.profile?.id);
  const {
    bankAccount,
    payoutAccounts,
    transactionPin,
    isLoadingBankAccount,
    isLoadingPayoutAccounts,
    isLoadingTransactionPin,
  } = useBankAccount();

  const handleNavigate = (route: BankAccountRoute) => {
    router.push(`/service-provider/account/bank-account/${route}` as any);
  };

  const getStatusIcon = (isSet: boolean) => {
    return isSet ? (
      <Icon as={CheckCircle} className="text-green-500" />
    ) : (
      <Icon as={ChevronRight} className="text-gray-400" />
    );
  };

  const getStatusText = (isSet: boolean, defaultText: string) => {
    return isSet ? defaultText : "Set up now";
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

            {/* Provision Account */}
            <Pressable onPress={() => handleNavigate("provision-account")}>
              <HStack className="bg-white rounded-lg border border-gray-200 p-4 justify-between items-center">
                <HStack className="gap-4 items-center">
                  <Box className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                    <Icon as={Banknote} className="text-blue-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="font-inter-semibold text-black">
                      Provision Account
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {getStatusText(
                        !!bankAccount,
                        "Internal account provisioned"
                      )}
                    </Text>
                  </VStack>
                  {getStatusIcon(!!bankAccount)}
                </HStack>
              </HStack>
            </Pressable>

            {/* Transaction PIN */}
            <Pressable onPress={() => handleNavigate("transaction-pin")}>
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
                      {getStatusText(
                        !!transactionPin,
                        "4-digit PIN set for security"
                      )}
                    </Text>
                  </VStack>
                  {getStatusIcon(!!transactionPin)}
                </HStack>
              </HStack>
            </Pressable>

            {/* Payout Accounts */}
            <Box className="bg-white rounded-lg border border-gray-200 p-4">
              <HStack className="gap-4 items-center mb-4">
                <Box className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center">
                  <Icon as={CreditCard} className="text-green-600" />
                </Box>
                <VStack className="flex-1">
                  <Text className="font-inter-semibold text-black">
                    Payout Accounts
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {payoutAccounts && payoutAccounts.length > 0
                      ? `${payoutAccounts.length} account${
                          payoutAccounts.length > 1 ? "s" : ""
                        } configured`
                      : "No payout accounts set up"}
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => handleNavigate("create-payout-account")}
                  disabled={!transactionPin}
                >
                  <ButtonIcon as={Plus} />
                  <ButtonText>Add</ButtonText>
                </Button>
              </HStack>

              {payoutAccounts && payoutAccounts.length > 0 ? (
                <VStack className="gap-3">
                  {payoutAccounts.map((account: PayoutAccount) => (
                    <Box
                      key={account.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      <HStack className="justify-between items-center">
                        <VStack className="flex-1">
                          <HStack className="items-center gap-2">
                            <Text className="font-inter-medium text-black">
                              {account.accountName}
                            </Text>
                            {account.isDefault && (
                              <Box className="bg-green-100 px-2 py-1 rounded-full">
                                <Text className="text-xs text-green-700 font-inter-medium">
                                  Default
                                </Text>
                              </Box>
                            )}
                          </HStack>
                          <Text className="text-sm text-gray-600">
                            {account.bankName} • {account.accountNumber}
                          </Text>
                          <Text className="text-xs text-gray-500 capitalize">
                            {account.accountType} Account
                          </Text>
                        </VStack>
                        <HStack className="gap-2">
                          {!account.isDefault && (
                            <Button
                              size="sm"
                              variant="outline"
                              onPress={() => handleNavigate("payout-account")}
                            >
                              <ButtonText>Set Default</ButtonText>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => handleNavigate("payout-account")}
                          >
                            <ButtonText>Manage</ButtonText>
                          </Button>
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Box className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <Text className="text-sm text-yellow-800 text-center">
                    {!transactionPin
                      ? "Set up your transaction PIN first to add payout accounts"
                      : "Add your first payout account to receive payments"}
                  </Text>
                </Box>
              )}
            </Box>
          </VStack>

          <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-blue-800">
                How it works
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Provision Account: Internal account we manage for you
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
