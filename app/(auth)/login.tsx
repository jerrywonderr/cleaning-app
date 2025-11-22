import { PrimaryButton } from "@/lib/components/custom-buttons";
import { PasswordField } from "@/lib/components/form/PasswordField";
import { TextField } from "@/lib/components/form/TextField";
import Link from "@/lib/components/Link";
import FootedFixedScreen from "@/lib/components/screens/FootedFixedScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
} from "@/lib/constants/legal";
import { useSignIn } from "@/lib/hooks/useAuth";
import { openInAppBrowser } from "@/lib/utils/browser";
import { getAuthErrorMessage } from "@/lib/utils/errorHandling";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Dimensions } from "react-native";
import * as yup from "yup";

const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

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
    <FootedFixedScreen
      footer={
        <VStack className="gap-4">
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
          <Text className="text-center text-xs text-gray-500">
            By logging in, you agree to our{" "}
            <Text
              className="text-brand-600 text-xs"
              onPress={() => openInAppBrowser(TERMS_OF_SERVICE_URL)}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              className="text-brand-600 text-xs"
              onPress={() => openInAppBrowser(PRIVACY_POLICY_URL)}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </VStack>
      }
    >
      <VStack className="justify-end my-4 h-full">
        <Image
          source={require("@/assets/app-images/login.png")}
          style={{
            width: "100%",
            height: SCREEN_HEIGHT * 0.4,
          }}
          contentFit="contain"
        />
        <Box className="mb-10">
          <Text className="text-2xl font-inter-bold mt-8 mb-6 text-left">
            Log in
          </Text>
          {error && (
            <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <Text className="text-red-700">{error}</Text>
            </Box>
          )}
          <FormProvider {...methods}>
            <VStack className="gap-4">
              <TextField
                name="email"
                label="Email"
                placeholder="john.doe@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCorrect={false}
              />
              <Box>
                <PasswordField
                  name="password"
                  label="Password"
                  placeholder="******"
                  textContentType="password"
                />

                <Link className="ml-auto mt-1" href="/forgot-password">
                  Forgot password?
                </Link>
              </Box>
            </VStack>
          </FormProvider>
        </Box>
      </VStack>
    </FootedFixedScreen>
  );
};

export default Login;
