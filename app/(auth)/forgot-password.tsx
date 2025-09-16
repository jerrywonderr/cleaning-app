import { PrimaryButton } from "@/lib/components/custom-buttons";
import { TextField } from "@/lib/components/form/TextField";
import Link from "@/lib/components/Link";
import FootedFixedScreen from "@/lib/components/screens/FootedFixedScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { usePasswordReset } from "@/lib/hooks/useAuth";
import { getAuthErrorMessage } from "@/lib/utils/errorHandling";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Dimensions, Image } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const passwordResetMutation = usePasswordReset();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  // Clear error when component mounts or when form changes
  useEffect(() => {
    setError(null);
  }, []);

  const handleForgotPassword = async (data: { email: string }) => {
    try {
      setError(null);
      setSuccess(false);

      await passwordResetMutation.mutateAsync(data.email);
      setSuccess(true);
      methods.reset();
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
    }
  };

  return (
    <FootedFixedScreen
      footer={
        <VStack className="gap-4">
          <PrimaryButton
            onPress={methods.handleSubmit(handleForgotPassword)}
            isLoading={passwordResetMutation.isPending}
            disabled={
              !methods.formState.isValid || passwordResetMutation.isPending
            }
          >
            Send Reset Link
          </PrimaryButton>
          <HStack className="justify-center items-center">
            <Text className="font-inter-medium">
              Remembered your password?{" "}
            </Text>
            <Link href="/login">Back to login</Link>
          </HStack>
        </VStack>
      }
    >
      <VStack style={{ flex: 1 }} className="justify-end my-4">
        <Image
          source={require("@/assets/app-images/forgot-password.png")}
          style={{
            width: "100%",
            height: SCREEN_HEIGHT * 0.4,
          }}
          resizeMode="contain"
        />
        <Box className="mb-12">
          <Text className="text-2xl font-inter-bold mt-8 mb-8 text-left">
            Forgot Password
          </Text>

          {error && (
            <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <Text className="text-red-700">{error}</Text>
            </Box>
          )}

          {success && (
            <Box className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <Text className="text-green-700">
                Password reset email sent! Please check your inbox.
              </Text>
            </Box>
          )}

          <FormProvider {...methods}>
            <VStack className="gap-4">
              <TextField
                name="email"
                label="Email"
                placeholder="email@domain.com"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
              />

              <Text>
                Instructions will be sent to your email if we find an account
                attached to it.
              </Text>
            </VStack>
          </FormProvider>
        </Box>
      </VStack>
    </FootedFixedScreen>
  );
};

export default ForgotPassword;
