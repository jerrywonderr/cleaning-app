import { PrimaryButton } from "@/lib/components/custom-buttons";
import { TextField } from "@/lib/components/form/TextField";
import Link from "@/lib/components/Link";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const router = useRouter();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleForgotPassword = async (data: { email: string }) => {
    try {
      // TODO: Implement forgot password logic
      console.log("Forgot password for:", data.email);
      // Optionally show a success message or navigate
    } catch (err) {
      console.log("Forgot password error:", err);
    }
  };

  return (
    <FixedScreen addTopInset={false}>
      <Text className="text-2xl font-bold mb-8 text-left">Forgot Password</Text>
      <FormProvider {...methods}>
        <VStack className="flex-1 gap-4">
          <TextField name="email" label="Email" placeholder="your@email.com" />
          <VStack className="gap-4">
            <PrimaryButton
              onPress={methods.handleSubmit(handleForgotPassword)}
              isLoading={methods.formState.isSubmitting}
              disabled={!methods.formState.isValid}
            >
              Send Reset Link
            </PrimaryButton>
            <Text className="text-center font-medium">
              Remembered your password? <Link href="/login">Back to login</Link>
            </Text>
          </VStack>
        </VStack>
      </FormProvider>
    </FixedScreen>
  );
};

export default ForgotPassword;
