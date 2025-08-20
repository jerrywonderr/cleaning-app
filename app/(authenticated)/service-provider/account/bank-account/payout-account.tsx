import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useRouter } from "expo-router";
import { CreditCard, Edit, Trash2 } from "lucide-react-native";
import { Alert } from "react-native";

export default function PayoutAccountScreen() {
  const router = useRouter();
  const { payoutAccount, isLoadingPayoutAccount } = useBankAccount();

  const handleEditAccount = () => {
    router.push("/service-provider/account/bank-account/create-payout-account");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Payout Account",
      "Are you sure you want to delete your payout account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Implement delete functionality
            Alert.alert(
              "Info",
              "Delete functionality will be implemented soon"
            );
          },
        },
      ]
    );
  };

  if (isLoadingPayoutAccount) {
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

  if (!payoutAccount) {
    return (
      <ScrollableScreen addTopInset={false}>
        <Box className="flex-1">
          <VStack className="gap-6 items-center justify-center flex-1">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
                <Icon as={CreditCard} size="xl" className="text-blue-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                No Payout Account Found
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                You need to set up a payout account to receive your earnings.
              </Text>
            </Box>

            <Button
              onPress={() =>
                router.push(
                  "/service-provider/account/bank-account/create-payout-account"
                )
              }
              size="lg"
              className="w-full"
            >
              <ButtonIcon as={CreditCard} />
              <ButtonText>Create Payout Account</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollableScreen>
    );
  }

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6">
          <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-blue-800">
                Payout Account Status
              </Text>
              <HStack className="items-center gap-2">
                <Box className="w-3 h-3 bg-green-500 rounded-full" />
                <Text className="text-sm text-blue-700">Account Active</Text>
              </HStack>
            </VStack>
          </Box>

          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              Account Details
            </Text>

            <Box className="bg-white rounded-lg border border-gray-200 p-4">
              <VStack className="gap-3">
                <HStack className="justify-between">
                  <Text className="text-sm text-gray-500">Bank Name</Text>
                  <Text className="text-sm font-inter-medium text-black">
                    {payoutAccount.bankName}
                  </Text>
                </HStack>

                <HStack className="justify-between">
                  <Text className="text-sm text-gray-500">Account Number</Text>
                  <Text className="text-sm font-inter-medium text-black">
                    {payoutAccount.accountNumber}
                  </Text>
                </HStack>

                <HStack className="justify-between">
                  <Text className="text-sm text-gray-500">Account Name</Text>
                  <Text className="text-sm font-inter-medium text-black">
                    {payoutAccount.accountName}
                  </Text>
                </HStack>

                <HStack className="justify-between">
                  <Text className="text-sm text-gray-500">Account Type</Text>
                  <Text className="text-sm font-inter-medium text-black capitalize">
                    {payoutAccount.accountType}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>

          <VStack className="gap-3">
            <Button
              onPress={handleEditAccount}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <ButtonIcon as={Edit} />
              <ButtonText>Edit Account</ButtonText>
            </Button>

            <Button
              onPress={handleDeleteAccount}
              variant="outline"
              action="negative"
              size="lg"
              className="w-full"
            >
              <ButtonIcon as={Trash2} />
              <ButtonText>Delete Account</ButtonText>
            </Button>
          </VStack>

          <VStack className="gap-3 mt-4">
            <Text className="text-sm text-gray-500 text-center">
              Your earnings will be transferred to this account
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
