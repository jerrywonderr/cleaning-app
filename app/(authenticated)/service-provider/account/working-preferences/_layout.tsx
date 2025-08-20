import ScreenHeader from "@/lib/components/ScreenHeader";
import { Stack } from "expo-router";

export default function WorkingPreferencesLayout() {
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
        name="index"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="working-hours"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="working-days"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="service-area"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}
