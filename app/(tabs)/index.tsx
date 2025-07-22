import { Text } from "@/lib/components/ui/text";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function HomeScreen() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login"); // Or any other home route
  };

  return (
    <View className="flex-1 items-center justify-center">
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
