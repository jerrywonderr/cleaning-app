import ScreenHeader from "@/lib/components/ScreenHeader";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: ({ navigation }) => <ScreenHeader navigation={navigation} />,
      }}
    />
  );
}
