import ScreenHeader from "@/lib/components/ScreenHeader";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        header: ({ navigation, options }) => (
          <ScreenHeader navigation={navigation} title={options.title} />
        ),
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="customer" options={{ headerShown: false }} />
      <Stack.Screen name="service-provider" options={{ headerShown: false }} />
    </Stack>
  );
}
