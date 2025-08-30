import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { PayoutAccount } from "@/lib/types/bank-account";
import { useRouter } from "expo-router";
import {
  CheckCircle,
  CreditCard,
  Plus,
  Shield,
  Trash2,
} from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";

export default function PayoutAccountScreen() {
  const router = useRouter();
  const userId = useUserStore((state) => state.profile?.id);
  const {
    payoutAccounts,
    isLoadingPayoutAccounts,
    deletePayoutAccount,
    setDefaultPayoutAccount,
    isDeletingPayoutAccount,
    isSettingDefaultPayoutAccount,
  } = useBankAccount();

  const [showPinInput, setShowPinInput] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{
    type: "delete" | "setDefault";
    account: PayoutAccount;
  } | null>(null);
  const [pin, setPin] = useState("");

  const handleAction = (
    type: "delete" | "setDefault",
    account: PayoutAccount
  ) => {
    setSelectedAction({ type, account });
    setShowPinInput(true);
    setPin("");
  };

  const confirmAction = async () => {
    if (!selectedAction || !userId || pin.length !== 4) return;

    try {
      if (selectedAction.type === "delete") {
        await deletePayoutAccount({
          userId,
          payoutAccountId: selectedAction.account.id,
          pin,
        });
        Alert.alert("Success", "Payout account deleted successfully!");
      } else if (selectedAction.type === "setDefault") {
        await setDefaultPayoutAccount({
          userId,
          payoutAccountId: selectedAction.account.id,
          pin,
        });
        Alert.alert("Success", "Default payout account updated!");
      }

      setShowPinInput(false);
      setSelectedAction(null);
      setPin("");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Operation failed");
    }
  };

  const cancelAction = () => {
    setShowPinInput(false);
    setSelectedAction(null);
    setPin("");
  };

  if (isLoadingPayoutAccounts) {
    return (
      <ScrollableScreen addTopInset={false}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading payout accounts...</Text>
        </Box>
      </ScrollableScreen>
    );
  }

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6">
          <Box className="items-center gap-4">
            <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
              <Icon as={CreditCard} size="xl" className="text-green-600" />
            </Box>
            <Text className="text-xl font-inter-bold text-black text-center">
              Payout Accounts
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              Manage your payout accounts and set which one receives payments by
              default.
            </Text>
          </Box>

          {payoutAccounts && payoutAccounts.length > 0 ? (
            <VStack className="gap-4">
              <HStack className="justify-between items-center">
                <Text className="text-lg font-inter-semibold text-black">
                  Your Accounts
                </Text>
                <Button
                  size="sm"
                  onPress={() =>
                    router.push(
                      "/service-provider/account/bank-account/create-payout-account" as any
                    )
                  }
                >
                  <ButtonIcon as={Plus} />
                  <ButtonText>Add New</ButtonText>
                </Button>
              </HStack>

              <VStack className="gap-4">
                {payoutAccounts.map((account) => (
                  <Box
                    key={account.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <VStack className="gap-4">
                      <HStack className="justify-between items-start">
                        <VStack className="flex-1 gap-2">
                          <HStack className="items-center gap-2">
                            <Text className="font-inter-semibold text-black text-lg">
                              {account.accountName}
                            </Text>
                            {account.isDefault && (
                              <Box className="bg-green-100 px-3 py-1 rounded-full">
                                <Text className="text-xs text-green-700 font-inter-medium">
                                  Default
                                </Text>
                              </Box>
                            )}
                          </HStack>
                          <Text className="text-base text-gray-700">
                            {account.bankName}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            Account: {account.accountNumber}
                          </Text>
                          <Text className="text-xs text-gray-500 capitalize">
                            {account.accountType} Account
                          </Text>
                        </VStack>
                        <Box className="items-end gap-2">
                          <Text className="text-xs text-gray-500">
                            Added {account.createdAt.toLocaleDateString()}
                          </Text>
                          {account.isDefault && (
                            <HStack className="items-center gap-1">
                              <Icon
                                as={CheckCircle}
                                className="text-green-500"
                              />
                              <Text className="text-xs text-green-600">
                                Receives payments
                              </Text>
                            </HStack>
                          )}
                        </Box>
                      </HStack>

                      <HStack className="gap-3">
                        {!account.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => handleAction("setDefault", account)}
                            disabled={isSettingDefaultPayoutAccount}
                          >
                            <ButtonIcon as={Shield} />
                            <ButtonText>
                              {isSettingDefaultPayoutAccount
                                ? "Setting..."
                                : "Set as Default"}
                            </ButtonText>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onPress={() => handleAction("delete", account)}
                          disabled={isDeletingPayoutAccount}
                        >
                          <ButtonIcon as={Trash2} />
                          <ButtonText>
                            {isDeletingPayoutAccount ? "Deleting..." : "Delete"}
                          </ButtonText>
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </VStack>
          ) : (
            <Box className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <VStack className="items-center gap-4">
                <Icon
                  as={CreditCard}
                  className="text-yellow-600"
                  size={48 as any}
                />
                <VStack className="items-center gap-2">
                  <Text className="text-lg font-inter-semibold text-yellow-800">
                    No Payout Accounts
                  </Text>
                  <Text className="text-sm text-yellow-700 text-center leading-5">
                    You haven&apos;t set up any payout accounts yet. Add your
                    first bank account to start receiving payments.
                  </Text>
                </VStack>
                <Button
                  onPress={() =>
                    router.push(
                      "/service-provider/account/bank-account/create-payout-account" as any
                    )
                  }
                >
                  <ButtonIcon as={Plus} />
                  <ButtonText>Add First Account</ButtonText>
                </Button>
              </VStack>
            </Box>
          )}

          <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-blue-800">
                Important Notes
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Only one account can be set as default at a time
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Deleting an account requires your transaction PIN
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Payout accounts cannot be edited once created
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Default account receives all payments automatically
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* PIN Input Modal */}
      {showPinInput && selectedAction && (
        <Box className="absolute inset-0 bg-black/50 items-center justify-center">
          <Box className="bg-white rounded-lg p-6 mx-4 w-full max-w-sm">
            <VStack className="gap-4">
              <Box className="items-center gap-2">
                <Icon
                  as={Shield}
                  className="text-purple-600"
                  size={32 as any}
                />
                <Text className="text-lg font-inter-semibold text-black text-center">
                  Verify Transaction PIN
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Enter your 4-digit PIN to{" "}
                  {selectedAction.type === "delete"
                    ? "delete"
                    : "set as default"}{" "}
                  this account
                </Text>
              </Box>

              <Box className="bg-gray-50 rounded-lg p-4">
                <Text className="text-sm font-inter-medium text-gray-700 mb-2">
                  Account: {selectedAction.account.accountName}
                </Text>
                <Text className="text-xs text-gray-600">
                  {selectedAction.account.bankName} •{" "}
                  {selectedAction.account.accountNumber}
                </Text>
              </Box>

              <Box className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <Text className="text-xs text-yellow-700 text-center">
                  This action requires your transaction PIN for security
                </Text>
              </Box>

              <HStack className="gap-3">
                <Button
                  variant="outline"
                  onPress={cancelAction}
                  className="flex-1"
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  onPress={confirmAction}
                  disabled={pin.length !== 4}
                  className="flex-1"
                >
                  <ButtonText>Confirm</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Box>
      )}
    </ScrollableScreen>
  );
}
