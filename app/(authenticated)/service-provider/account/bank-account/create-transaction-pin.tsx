import { PrimaryButton } from "@/lib/components/custom-buttons";
import { PasswordField } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Lock, Shield } from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  pin: yup
    .string()
    .trim()
    .length(4, "PIN must be exactly 4 digits")
    .matches(/^\d+$/, "PIN must contain only numbers")
    .required("PIN is required"),
  confirmPin: yup
    .string()
    .trim()
    .oneOf([yup.ref("pin")], "PINs do not match")
    .required("Please confirm your PIN"),
});

type FormData = {
  pin: string;
  confirmPin: string;
};

export default function CreateTransactionPinScreen() {
  const router = useRouter();
  const userId = useUserStore((state) => state.profile?.id);
  const { createTransactionPin, isCreatingTransactionPin } = useBankAccount();

  const methods = useForm<FormData>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (data: FormData) => {
    if (!userId) return;

    try {
      await createTransactionPin({
        pin: data.pin,
      });

      Alert.alert("Success", "Transaction PIN created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create transaction PIN");
    }
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={methods.handleSubmit(handleSubmit)}
          disabled={!methods.formState.isValid || isCreatingTransactionPin}
          icon={Shield}
        >
          {isCreatingTransactionPin ? "Creating..." : "Create PIN"}
        </PrimaryButton>
      }
    >
      <Box className="flex-1">
        <FormProvider {...methods}>
          <VStack className="gap-6">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                <Icon as={Lock} size="xl" className="text-green-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                Set Up Your Transaction PIN
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                This PIN will be used to authorize financial transactions and
                withdrawals.
              </Text>
            </Box>

            <VStack className="gap-4">
              <PasswordField
                name="pin"
                label="Transaction PIN"
                placeholder="Enter 4-digit PIN"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />

              <PasswordField
                name="confirmPin"
                label="Confirm PIN"
                placeholder="Re-enter your PIN"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />
            </VStack>

            <Box className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <VStack className="gap-2">
                <Text className="text-sm font-inter-medium text-yellow-800">
                  Security Notice
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • Keep your PIN secure and don&apos;t share it with anyone
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • This PIN is required for all financial transactions
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • You can change your PIN later in the settings
                </Text>
              </VStack>
            </Box>
            <Text className="text-xs text-gray-500 text-center">
              Your PIN will be securely stored and encrypted
            </Text>
          </VStack>
        </FormProvider>
      </Box>
    </FootedScrollableScreen>
  );
}
