import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

export default function BookLayout() {
  const form = useForm();

  return (
    <FormProvider {...form}>
      <ScrollableScreen addTopInset={false}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="success"
            options={{ title: "Appointment Booked!" }}
          />
          <Stack.Screen name="address" options={{ title: "Enter Address" }} />
          <Stack.Screen name="date" options={{ title: "Select Date" }} />
          <Stack.Screen name="time" options={{ title: "Select Time" }} />
          <Stack.Screen
            name="confirm"
            options={{ title: "Confirm Appointment" }}
          />
        </Stack>
      </ScrollableScreen>
    </FormProvider>
  );
}
