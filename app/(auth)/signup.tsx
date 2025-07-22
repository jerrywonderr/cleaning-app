import { PasswordField } from "@/lib/components/form/PasswordField";
import { TextField } from "@/lib/components/form/TextField";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { Text } from "@/lib/components/ui/text";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
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
    <FormProvider {...methods}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={{ flex: 1, padding: 24 }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Box className="w-full max-w-lg mx-auto py-8">
              <Text className="text-2xl font-bold mb-8 text-left">
                Create account
              </Text>
              <View className="flex gap-4">
                <TextField
                  name="firstName"
                  label="First name"
                  placeholder="Kay"
                />
                <TextField
                  name="lastName"
                  label="Last name"
                  placeholder="Adegboyega"
                />
                <TextField
                  name="phone"
                  label="Phone"
                  placeholder="+444874875048"
                />
                <TextField
                  name="dob"
                  label="DOB"
                  placeholder="08/08/72"
                />
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
              </View>
            </Box>
          </ScrollView>

          <View className="w-full max-w-lg mx-auto pb-6">
            <Button
              action="primary"
              size="lg"
              className="w-full p-4 rounded-3xl justify-center items-center"
              onPress={methods.handleSubmit(handleSignUp)}
            >
              <ButtonText>Confirm</ButtonText>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default Signup;
