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
            // title: "Book Appointment",
          }}
        />
      </ScrollableScreen>
    </FormProvider>
  );
}
