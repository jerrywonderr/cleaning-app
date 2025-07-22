import { PrimaryButton } from "@/lib/components/custom-buttons";
import { PasswordField } from "@/lib/components/form/PasswordField";
import { TextField } from "@/lib/components/form/TextField";
import Link from "@/lib/components/Link";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  phone: yup.string().trim().required("Phone is required"),
  dob: yup.string().trim().required("DOB is required"),
  password: yup
    .string()
    .min(6, "Password must be longer than 6 characters")
    .max(32, "Password can't be more than 32 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase character and one number"
    )
    .required("Password is required"),
  cPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password field is required"),
});

const Signup = () => {
  const { signup } = useAuthStore();
  const router = useRouter();
  const methods = useForm({ mode: "all", resolver: yupResolver(schema) });

  const handleSignUp = async () => {
    const payload = methods.getValues();
    try {
      const response = await signup(payload);
      console.log(response);
      // router.push("/(auth)/activate-account");
    } catch (err: any) {
      console.log(err);
      methods.resetField("password");
      methods.resetField("cPassword");
    }
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Text className="text-2xl font-bold mt-8 mb-6 text-left">
        Create account
      </Text>
      <FormProvider {...methods}>
        <VStack className="flex-1 gap-4">
          <TextField name="firstName" label="First name" placeholder="Kay" />
          <TextField
            name="lastName"
            label="Last name"
            placeholder="Adegboyega"
          />
          <TextField name="phone" label="Phone" placeholder="+444874875048" />
          <TextField name="dob" label="DOB" placeholder="08/08/72" />
          <TextField
            name="email"
            label="Email"
            placeholder="Sirphil987@gmail.com"
          />
          <PasswordField
            name="password"
            label="Password"
            placeholder="Enter your password"
          />
          <PasswordField
            name="cPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
          />

          <VStack className="gap-4 mt-4">
            <PrimaryButton
              onPress={methods.handleSubmit(handleSignUp)}
              isLoading={methods.formState.isSubmitting}
              disabled={!methods.formState.isValid}
            >
              Confirm
            </PrimaryButton>

            <Text className="text-center font-medium">
              Already have an account? <Link href="/login">Log in</Link>
            </Text>
          </VStack>
        </VStack>
      </FormProvider>
    </ScrollableScreen>
  );
};

export default Signup;
