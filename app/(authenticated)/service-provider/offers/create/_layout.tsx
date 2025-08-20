import ScreenHeader from "@/lib/components/ScreenHeader";
import {
  CreateOfferFormData,
  createOfferSchema,
} from "@/lib/schemas/create-offer";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

export default function CreateOfferLayout() {
  const form = useForm<CreateOfferFormData>({
    resolver: yupResolver(createOfferSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      price: undefined,
      description: "",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      category: "deep-cleaning",
      duration: 2,
      tags: [],
      whatIncluded: [],
      requirements: [],
    },
  });

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
        <Stack.Screen name="index" options={{ title: "Basic Info" }} />
        <Stack.Screen
          name="service-details"
          options={{ title: "Service Details" }}
        />
        <Stack.Screen
          name="service-content"
          options={{ title: "Service Content" }}
        />
        <Stack.Screen name="review" options={{ title: "Review & Create" }} />
      </Stack>
    </FormProvider>
  );
}
