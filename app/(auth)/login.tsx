import { PrimaryButton } from "@/lib/components/custom-buttons";
import { PasswordField } from "@/lib/components/form/PasswordField";
import { TextField } from "@/lib/components/form/TextField";
import Link from "@/lib/components/Link";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useSignIn } from "@/lib/hooks/useAuth";
import { getAuthErrorMessage } from "@/lib/utils/errorHandling";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const signInMutation = useSignIn();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  // Clear error when component mounts or when form changes
  useEffect(() => {
    setError(null);
  }, []);

  const handleLogin = async () => {
    try {
      setError(null);
      const formData = methods.getValues();

      await signInMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
    } catch (err: any) {
      console.log("Login error:", err);
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      methods.resetField("password");
    }
  };

  return (
    <FixedScreen>
      <Text className="text-2xl font-inter-bold mt-8 mb-6 text-left">
        Log in
      </Text>

      {error && (
        <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <Text className="text-red-700">{error}</Text>
        </Box>
      )}

      <FormProvider {...methods}>
        <VStack className="flex-1 gap-4">
          <TextField name="email" label="Email" placeholder="your@email.com" />
          <Box>
            <PasswordField
              name="password"
              label="Password"
              placeholder="Enter your password"
            />

            <Link className="ml-auto mt-1" href="/forgot-password">
              Forgot password?
            </Link>
          </Box>

          <VStack className="gap-4 mt-4">
            <PrimaryButton
              onPress={methods.handleSubmit(handleLogin)}
              isLoading={signInMutation.isPending}
              disabled={!methods.formState.isValid || signInMutation.isPending}
            >
              Confirm
            </PrimaryButton>

            <HStack className="justify-center items-center">
              <Text className="font-inter-medium">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/signup">Sign up</Link>
            </HStack>
          </VStack>
        </VStack>
      </FormProvider>
    </FixedScreen>
  );
};

export default Login;
