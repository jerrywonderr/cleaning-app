import ScreenHeader from "@/lib/components/ScreenHeader";
import bookAppointmentSchema from "@/lib/schemas/book-appointment";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function BookLayout() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();

  const form = useForm({
    resolver: yupResolver(bookAppointmentSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      offerId: offerId || "",
      address: "",
      serviceType: undefined,
      scheduledDate: undefined,
      scheduledTime: undefined,
      notes: "",
    },
  });

  // Update offerId when it changes
  useEffect(() => {
    if (offerId) {
      form.setValue("offerId", offerId);
    }
  }, [offerId, form]);

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
          animation: "fade_from_bottom",
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
