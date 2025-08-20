import { PrimaryButton } from "@/lib/components/custom-buttons";
import { PickerField, TextField } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { CreditCard, Wallet } from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  accountNumber: yup
    .string()
    .trim()
    .min(10, "Account number must be at least 10 digits")
    .required("Account number is required"),
  bankName: yup.string().trim().required("Bank name is required"),
  accountName: yup.string().trim().required("Account name is required"),
  accountType: yup.string().oneOf(["savings", "current"]).required(),
});

type FormData = {
  accountNumber: string;
  bankName: string;
  accountName: string;
  accountType: "savings" | "current";
};

const accountTypes = [
  { label: "Savings Account", value: "savings" },
  { label: "Current Account", value: "current" },
];

export default function CreatePayoutAccountScreen() {
  const router = useRouter();
  const userId = useUserStore((state) => state.profile?.id);
  const { createPayoutAccount, isCreatingPayoutAccount } = useBankAccount();

  const methods = useForm<FormData>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      accountType: "savings",
    },
  });

  const handleSubmit = async (data: FormData) => {
    if (!userId) return;

    try {
      await createPayoutAccount({
        userId,
        accountNumber: data.accountNumber.trim(),
        bankName: data.bankName.trim(),
        accountName: data.accountName.trim(),
        accountType: data.accountType,
      });

      Alert.alert("Success", "Payout account created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create payout account");
    }
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={methods.handleSubmit(handleSubmit)}
          disabled={!methods.formState.isValid || isCreatingPayoutAccount}
          icon={Wallet}
        >
          {isCreatingPayoutAccount ? "Creating..." : "Create Payout Account"}
        </PrimaryButton>
      }
    >
      <Box className="flex-1">
        <FormProvider {...methods}>
          <VStack className="gap-6">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
                <Icon as={CreditCard} size="xl" className="text-blue-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                Set Up Your Payout Account
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                This is where your earnings will be transferred to.
              </Text>
            </Box>

            <VStack className="gap-4">
              <TextField
                name="accountNumber"
                label="Account Number"
                placeholder="Enter your account number"
                keyboardType="numeric"
                maxLength={20}
              />

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

              <PickerField
                name="accountType"
                label="Account Type"
                items={accountTypes}
              />
            </VStack>

            <VStack className="gap-3">
              <Text className="text-xs text-gray-500 text-center">
                This account will receive your service payments
              </Text>
            </VStack>
          </VStack>
        </FormProvider>
      </Box>
    </FootedScrollableScreen>
  );
}
