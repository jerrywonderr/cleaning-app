import ScreenHeader from "@/lib/components/ScreenHeader";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

export default function BookLayout() {
  const form = useForm();

  return (
    <FormProvider {...form}>
      <Stack
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
          header: ({ navigation, options }) => (
            <ScreenHeader
              navigation={navigation}
              title={options.title}
              showBackButton={options.headerBackVisible}
            />
          ),
        }}
      >
        <Stack.Screen
          name="success"
          options={{ title: "Appointment Booked!", headerBackVisible: false }}
        />
        <Stack.Screen name="index" options={{ title: "Enter Address" }} />
        <Stack.Screen
          name="service-type"
          options={{ title: "Select Service Type" }}
        />
        <Stack.Screen
          name="schedule"
          options={{ title: "When should we come" }}
        />
        <Stack.Screen
          name="confirm"
          options={{ title: "Review Appointment" }}
        />
      </Stack>
    </FormProvider>
  );
}
