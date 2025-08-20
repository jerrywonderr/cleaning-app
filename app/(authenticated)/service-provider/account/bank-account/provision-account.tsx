import { PrimaryButton } from "@/lib/components/custom-buttons";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Banknote, Wallet } from "lucide-react-native";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  // No validation needed since we're using dummy values
});

type FormData = {
  // Empty since we don't need user input
};

export default function ProvisionAccountScreen() {
  const router = useRouter();
  const userId = useUserStore((state) => state.profile?.id);
  const { createBankAccount, isCreatingBankAccount } = useBankAccount();

  const methods = useForm<FormData>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleProvisionAccount = async () => {
    if (!userId) return;

    try {
      // Use dummy values for internal account setup
      await createBankAccount({
        userId,
        accountNumber: "INT" + userId.slice(-8), // Internal account number
        bankName: "CleaningApp Internal Bank",
        accountName: "Internal Account",
      });

      Alert.alert(
        "Account Provisioned",
        "Your internal account has been set up successfully! You can now manage your funds and set up your payout account.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to provision internal account"
      );
    }
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6">
          <Box className="items-center gap-4">
            <Box className="w-20 h-20 bg-brand-100 rounded-full items-center justify-center">
              <Icon as={Wallet} size="xl" className="text-brand-600" />
            </Box>
            <Text className="text-xl font-inter-bold text-black text-center">
              Set Up Your Internal Account
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              We&apos;re setting up an internal account to manage your funds and
              transactions securely.
            </Text>
          </Box>

          <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-blue-800">
                What happens next?
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • We&apos;ll create an internal account for fund management
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • You&apos;ll be able to set up your payout account
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • All transactions will be processed through this secure system
              </Text>
            </VStack>
          </Box>

          <VStack className="gap-3">
            <PrimaryButton
              onPress={handleProvisionAccount}
              disabled={isCreatingBankAccount}
              icon={Banknote}
            >
              {isCreatingBankAccount
                ? "Setting up account..."
                : "Set Up Internal Account"}
            </PrimaryButton>

            <Text className="text-xs text-gray-500 text-center">
              This is an internal account managed by our system
            </Text>
          </VStack>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
