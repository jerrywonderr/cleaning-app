import { PasswordField } from "@/lib/components/form/PasswordField";
import { TextField } from "@/lib/components/form/TextField";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { Text } from "@/lib/components/ui/text";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const { login, logout } = useAuthStore();
  const router = useRouter();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const handleLogin = async () => {
    try {
      const response = await login();
      console.log("Login response:", response);
      // router.push("/(tabs)"); // Redirect after login
    } catch (err) {
      console.log("Login error:", err);
      methods.resetField("password");
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login"); // Or any other home route
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
              <Text className="text-2xl font-bold mb-8 text-left">Log in</Text>
              <View className="flex gap-4">
                <TextField
                  name="email"
                  label="Email"
                  placeholder="your@email.com"
                />
                <PasswordField
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              </View>
            </Box>
          </ScrollView>

          <View className="w-full max-w-lg mx-auto pb-4">
            <Button
              action="primary"
              size="lg"
              className="w-full p-4 rounded-3xl justify-center items-center"
              onPress={methods.handleSubmit(handleLogin)}
            >
              <ButtonText>Confirm</ButtonText>
            </Button>
          </View>

          <View className="w-full max-w-lg mx-auto pb-6">
            <Button
              action="secondary"
              size="sm"
              className="w-full p-3 rounded-3xl justify-center items-center"
              onPress={handleLogout}
            >
              <ButtonText>Back Home</ButtonText>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </FormProvider>
  );
};

export default Login;
