import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useRouter } from "expo-router";
import { Edit, Lock, Shield } from "lucide-react-native";
import { Alert } from "react-native";

export default function TransactionPinScreen() {
  const router = useRouter();
  const { transactionPin, isLoadingTransactionPin } = useBankAccount();

  const handleUpdatePin = () => {
    router.push(
      "/service-provider/account/bank-account/update-transaction-pin"
    );
  };

  const handleResetPin = () => {
    Alert.alert(
      "Reset Transaction PIN",
      "Are you sure you want to reset your transaction PIN? You'll need to create a new one.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            // TODO: Implement reset functionality
            Alert.alert("Info", "Reset functionality will be implemented soon");
          },
        },
      ]
    );
  };

  if (isLoadingTransactionPin) {
    return (
      <ScrollableScreen addTopInset={false}>
        <Box className="flex-1 p-4">
          <VStack className="gap-4">
            <Text className="text-center text-gray-500">Loading...</Text>
          </VStack>
        </Box>
      </ScrollableScreen>
    );
  }

  if (!transactionPin) {
    return (
      <ScrollableScreen addTopInset={false}>
        <Box className="flex-1 p-4">
          <VStack className="gap-6 items-center justify-center flex-1">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                <Icon as={Lock} size="xl" className="text-green-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                No Transaction PIN Found
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                You need to set up a transaction PIN to authorize financial
                transactions.
              </Text>
            </Box>

            <Button
              onPress={() =>
                router.push(
                  "/service-provider/account/bank-account/create-transaction-pin"
                )
              }
              size="lg"
              className="w-full"
            >
              <ButtonIcon as={Shield} />
              <ButtonText>Create Transaction PIN</ButtonText>
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
          <Box className="bg-green-50 rounded-lg p-4 border border-green-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-green-800">
                PIN Status
              </Text>
              <HStack className="items-center gap-2">
                <Box className="w-3 h-3 bg-green-500 rounded-full" />
                <Text className="text-sm text-green-700">PIN Active</Text>
              </HStack>
            </VStack>
          </Box>

          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              PIN Information
            </Text>

            <Box className="bg-white rounded-lg border border-gray-200 p-4">
              <VStack className="gap-3">
                <HStack className="justify-between">
                  <Text className="text-sm text-gray-500">PIN Status</Text>
                  <Text className="text-sm font-inter-medium text-black">
                    {transactionPin.isActive ? "Active" : "Inactive"}
                  </Text>
                </HStack>

                <HStack className="justify-between">
                  <Text className="text-sm text-gray-500">Created</Text>
                  <Text className="text-sm font-inter-medium text-black">
                    {transactionPin.createdAt.toLocaleDateString()}
                  </Text>
                </HStack>

                <HStack className="justify-between">
                  <Text className="text-sm text-gray-500">Last Updated</Text>
                  <Text className="text-sm font-inter-medium text-black">
                    {transactionPin.updatedAt.toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>

          <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-blue-800">
                Security Information
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Your PIN is required for all financial transactions
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Keep your PIN secure and don&apos;t share it with anyone
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • You can update your PIN anytime for security
              </Text>
            </VStack>
          </Box>

          <VStack className="gap-3">
            <Button
              onPress={handleUpdatePin}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <ButtonIcon as={Edit} />
              <ButtonText>Update PIN</ButtonText>
            </Button>

            <Button
              onPress={handleResetPin}
              variant="outline"
              action="negative"
              size="lg"
              className="w-full"
            >
              <ButtonIcon as={Shield} />
              <ButtonText>Reset PIN</ButtonText>
            </Button>
          </VStack>

          <VStack className="gap-3 mt-4">
            <Text className="text-sm text-gray-500 text-center">
              Your PIN is encrypted and securely stored
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
