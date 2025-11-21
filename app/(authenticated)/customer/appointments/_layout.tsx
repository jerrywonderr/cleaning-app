import ScreenHeader from "@/lib/components/ScreenHeader";
import { Stack } from "expo-router";

export default function RootAppointmentLayout() {
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
      <Stack.Screen name="[appointmentId]" options={{ headerShown: false }} />
    </Stack>
  );
}
