import { PrimaryButton } from "@/lib/components/custom-buttons";
import { DateField, PasswordField, TextField } from "@/lib/components/form";
import FormSwitch from "@/lib/components/form/FormSwitch";
import { PhoneField } from "@/lib/components/form/PhoneField";
import Link from "@/lib/components/Link";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useSignUp } from "@/lib/hooks/useAuth";
import { getAuthErrorMessage } from "@/lib/utils/errorHandling";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
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
  isServiceProvider: yup.boolean().required(),
});

const Signup = () => {
  const [error, setError] = useState<string | null>(null);

  const signUpMutation = useSignUp();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      isServiceProvider: false,
    },
  });

  // Clear error when component mounts or when form changes
  useEffect(() => {
    setError(null);
  }, []);

  const handleSignUp = async () => {
    try {
      setError(null);
      const payload = methods.getValues();

      await signUpMutation.mutateAsync({
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        dob: payload.dob,
        isServiceProvider: payload.isServiceProvider,
      });
    } catch (err: any) {
      console.log(err);
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      methods.resetField("password");
      methods.resetField("cPassword");
    }
  };

  return (
    <FixedScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-inter-bold mt-8 mb-6 text-left">
          Create account
        </Text>

        {error && (
          <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <Text className="text-red-700">{error}</Text>
          </Box>
        )}

        <FormProvider {...methods}>
          <VStack className="flex-1 gap-4">
            <TextField
              name="firstName"
              label="First name"
              placeholder="Kay"
              textContentType="givenName"
            />
            <TextField
              name="lastName"
              label="Last name"
              placeholder="Adegboyega"
              textContentType="familyName"
            />
            <PhoneField
              name="phone"
              label="Phone"
              placeholder="874875048"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />

            <DateField
              name="dob"
              label="Date of Birth"
              placeholder="Select your date of birth"
              methods={methods}
              maximumDate={new Date()}
            />

            <TextField
              name="email"
              label="Email"
              placeholder="email@domain.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
            />
            <PasswordField
              name="password"
              label="Password"
              placeholder="******"
              autoCorrect={false}
              autoCapitalize="none"
              textContentType="newPassword"
              returnKeyType="next"
            />
            <PasswordField
              name="cPassword"
              label="Confirm Password"
              placeholder="******"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              returnKeyType="done"
            />

            {/* Service Provider Toggle */}
            <HStack className="items-center justify-between">
              <Text className="text-base font-medium text-gray-900">
                I&apos;m a service provider
              </Text>
              <FormSwitch
                value={methods.watch("isServiceProvider")}
                onChange={(val) => methods.setValue("isServiceProvider", val)}
              />
            </HStack>
          </VStack>
        </FormProvider>
      </ScrollView>
      <VStack className="gap-4 mt-4">
        <PrimaryButton
          onPress={methods.handleSubmit(handleSignUp)}
          isLoading={signUpMutation.isPending}
          disabled={!methods.formState.isValid || signUpMutation.isPending}
        >
          Confirm
        </PrimaryButton>

        <HStack className="justify-center items-center">
          <Text className="font-inter-medium">Already have an account? </Text>
          <Link href="/login">Log in</Link>
        </HStack>
      </VStack>
    </FixedScreen>
  );
};

export default Signup;
