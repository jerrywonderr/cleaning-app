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
      <Stack.Screen
        name="view-profile"
        options={{
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          title: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          title: "Support",
        }}
      />
      <Stack.Screen
        name="services-settings"
        options={{
          title: "Services Settings",
        }}
      />
      <Stack.Screen
        name="bank-account"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="working-preferences"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="balance"
        options={{
          title: "Balance & Transactions",
        }}
      />
    </Stack>
  );
}
