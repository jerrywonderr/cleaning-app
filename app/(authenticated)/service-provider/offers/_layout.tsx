import ScreenHeader from "@/lib/components/ScreenHeader";
import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        header: ({ navigation, options }) => (
          <ScreenHeader navigation={navigation} title={options.title} />
        ),
      }}
    >
      <Stack.Screen name="[id]" options={{ title: "Offer Details" }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
}
