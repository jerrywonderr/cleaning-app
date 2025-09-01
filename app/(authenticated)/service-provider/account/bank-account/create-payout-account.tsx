import { PickerField, TextField } from "@/lib/components/form";
import { SwitchField } from "@/lib/components/form/SwitchField";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { useLoader } from "@/lib/components/ui/loader";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { CreatePayoutAccountData } from "@/lib/types/bank-account";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { CreditCard, Shield } from "lucide-react-native";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  accountNumber: yup
    .string()
    .trim()
    .matches(/^\d{10,11}$/, "Account number must be 10-11 digits")
    .required("Account number is required"),
  bankName: yup.string().trim().required("Bank name is required"),
  accountName: yup.string().trim().required("Account name is required"),
  accountType: yup
    .string()
    .oneOf(["savings", "current"], "Please select account type")
    .required("Account type is required"),
});

type FormData = {
  accountNumber: string;
  bankName: string;
  accountName: string;
  accountType: "savings" | "current";
};

export default function CreatePayoutAccountScreen() {
  const router = useRouter();
  const userId = useUserStore((state) => state.profile?.id);
  const { createPayoutAccount, isCreatingPayoutAccount, payoutAccounts } =
    useBankAccount();
  const [isDefault, setIsDefault] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  const methods = useForm<FormData>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      accountNumber: "",
      bankName: "",
      accountName: "",
      accountType: "savings",
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (!userId) return;

    try {
      showLoader("Creating payout account...");
      const payoutAccountData: CreatePayoutAccountData = {
        userId,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        accountName: data.accountName,
        accountType: data.accountType,
        isDefault: isDefault,
      };

      await createPayoutAccount(payoutAccountData);

      Alert.alert("Success", "Payout account created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create payout account");
    } finally {
      hideLoader();
    }
  };

  const hasExistingAccounts = payoutAccounts && payoutAccounts.length > 0;

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <VStack className="gap-3">
          <Button
            onPress={methods.handleSubmit(handleSubmit)}
            size="lg"
            className="w-full"
            disabled={!methods.formState.isValid || isCreatingPayoutAccount}
          >
            <ButtonIcon as={CreditCard} />
            <ButtonText>
              {isCreatingPayoutAccount ? "Creating..." : "Create Account"}
            </ButtonText>
          </Button>

          <Text className="text-xs text-gray-500 text-center">
            Your account details will be securely stored and encrypted
          </Text>
        </VStack>
      }
    >
      <Box className="flex-1">
        <FormProvider {...methods}>
          <VStack className="gap-6">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-green-100 rounded-lg items-center justify-center">
                <Icon as={CreditCard} size="xl" className="text-green-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                Add Payout Account
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                Add a new bank account where you&apos;ll receive your payments.
                You can have multiple accounts but only one can be default.
              </Text>
            </Box>

            <VStack className="gap-4">
              <Text className="text-lg font-inter-semibold text-black">
                Account Details
              </Text>

              <TextField
                name="bankName"
                label="Bank Name"
                placeholder="Enter your bank name"
              />

              <TextField
                name="accountName"
                label="Account Name"
                placeholder="Enter account holder name"
              />

              <TextField
                name="accountNumber"
                label="Account Number"
                placeholder="Enter account number"
                keyboardType="numeric"
                maxLength={11}
              />

              <PickerField
                name="accountType"
                label="Account Type"
                placeholder="Select account type"
                items={[
                  { label: "Savings Account", value: "savings" },
                  { label: "Current Account", value: "current" },
                ]}
              />

              {hasExistingAccounts && (
                <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <SwitchField
                    name="isDefault"
                    label="Set as Default Account"
                    labelComponent={
                      <HStack className="items-center gap-3 max-w-[80%]">
                        <Icon as={Shield} className="text-blue-600" />
                        <VStack>
                          <Text className="text-sm font-inter-medium text-blue-800">
                            Set as Default Account
                          </Text>
                          <Text className="text-xs text-blue-700 leading-4">
                            Make this account your primary payout destination
                          </Text>
                        </VStack>
                      </HStack>
                    }
                  />
                </Box>
              )}

              {!hasExistingAccounts && (
                <Box className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <HStack className="items-center gap-3">
                    <Icon as={Shield} className="text-green-600" />
                    <VStack className="flex-1">
                      <Text className="text-sm font-inter-medium text-green-800">
                        First Account - Will be Default
                      </Text>
                      <Text className="text-xs text-green-700 leading-4">
                        Your first payout account is automatically set as
                        default
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}
            </VStack>

            <Box className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <VStack className="gap-2">
                <Text className="text-sm font-inter-medium text-yellow-800">
                  Important Information
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • Account details cannot be edited once created
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • You can delete accounts using your transaction PIN
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • Only one account can be default at a time
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • Default account receives all payments automatically
                </Text>
              </VStack>
            </Box>
          </VStack>
        </FormProvider>
      </Box>
    </FootedScrollableScreen>
  );
}
