import { PrimaryButton } from "@/lib/components/custom-buttons";
import { PasswordField } from "@/lib/components/form/PasswordField";
import { TextField } from "@/lib/components/form/TextField";
import Link from "@/lib/components/Link";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { yupResolver } from "@hookform/resolvers/yup";
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
  const { login } = useAuthStore();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleLogin = async () => {
    try {
      console.log("Login");
      const formData = methods.getValues();
      
      const userData = {
        email: formData.email,
        firstName: "John", 
        lastName: "Doe",  
        phone: "+1234567890", 
        dob: "01/01/1990", 
        isServiceProvider: false, 
      };
      
      const response = await login(userData);
      console.log("Login response:", response);

    } catch (err) {
      console.log("Login error:", err);
      methods.resetField("password");
    }
  };

  return (
    <FixedScreen>
      <Text className="text-2xl font-inter-bold mt-8 mb-6 text-left">
        Log in
      </Text>
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
              isLoading={methods.formState.isSubmitting}
              disabled={!methods.formState.isValid}
            >
              Confirm
            </PrimaryButton>

            <HStack className="justify-center items-center">
              <Text className="font-inter-medium">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/signup">Sign up</Link>
            </HStack>

            {/* <SecondaryButton onPress={handleLogout}>Back Home</SecondaryButton> */}
          </VStack>
        </VStack>
      </FormProvider>
    </FixedScreen>
  );
};

export default Login;
