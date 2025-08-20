import { PrimaryButton } from "@/lib/components/custom-buttons";
import { PasswordField } from "@/lib/components/form";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
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
  currentPin: yup
    .string()
    .trim()
    .length(4, "PIN must be exactly 4 digits")
    .matches(/^\d+$/, "PIN must contain only numbers")
    .required("Current PIN is required"),
  newPin: yup
    .string()
    .trim()
    .length(4, "PIN must be exactly 4 digits")
    .matches(/^\d+$/, "PIN must contain only numbers")
    .required("New PIN is required"),
  confirmNewPin: yup
    .string()
    .trim()
    .oneOf([yup.ref("newPin")], "PINs do not match")
    .required("Please confirm your new PIN"),
});

type FormData = {
  currentPin: string;
  newPin: string;
  confirmNewPin: string;
};

export default function UpdateTransactionPinScreen() {
  const router = useRouter();
  const userId = useUserStore((state) => state.profile?.id);
  const { updateTransactionPin, isUpdatingTransactionPin } = useBankAccount();

  const methods = useForm<FormData>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (data: FormData) => {
    if (!userId) return;

    try {
      await updateTransactionPin({
        currentPin: data.currentPin,
        newPin: data.newPin,
      });

      Alert.alert("Success", "Transaction PIN updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update transaction PIN");
    }
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <FormProvider {...methods}>
          <VStack className="gap-6">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
                <Icon as={Lock} size="xl" className="text-green-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                Update Your Transaction PIN
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                Change your PIN for enhanced security. You&apos;ll need your
                current PIN to proceed.
              </Text>
            </Box>

            <VStack className="gap-4">
              <PasswordField
                name="currentPin"
                label="Current PIN"
                placeholder="Enter your current 4-digit PIN"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />

              <PasswordField
                name="newPin"
                label="New PIN"
                placeholder="Enter new 4-digit PIN"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={true}
              />

              <PasswordField
                name="confirmNewPin"
                label="Confirm New PIN"
                placeholder="Re-enter your new PIN"
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
                  • Make sure you remember your new PIN
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • Keep your PIN secure and don&apos;t share it with anyone
                </Text>
                <Text className="text-xs text-yellow-700 leading-4">
                  • Your new PIN will be required for all future transactions
                </Text>
              </VStack>
            </Box>

            <VStack className="gap-3">
              <PrimaryButton
                onPress={methods.handleSubmit(handleSubmit)}
                disabled={
                  !methods.formState.isValid || isUpdatingTransactionPin
                }
                icon={Shield}
              >
                {isUpdatingTransactionPin ? "Updating..." : "Update PIN"}
              </PrimaryButton>

              <Text className="text-xs text-gray-500 text-center">
                Your new PIN will be securely stored and encrypted
              </Text>
            </VStack>
          </VStack>
        </FormProvider>
      </Box>
    </ScrollableScreen>
  );
}
