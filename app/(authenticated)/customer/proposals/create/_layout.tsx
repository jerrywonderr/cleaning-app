import ScreenHeader from "@/lib/components/ScreenHeader";
import {
  CreateProposalFormData,
  createProposalSchema,
} from "@/lib/schemas/create-proposal";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

export default function ProposalsLayout() {
  const form = useForm<CreateProposalFormData>({
    resolver: yupResolver(createProposalSchema),
    mode: "onChange",
    defaultValues: {
      serviceId: "",
      location: undefined,
      providerId: "",
      proposalDetails: {
        date: "",
        duration: 0,
        timeRange: "",
      },
      extraOptions: [],
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
        <Stack.Screen
          name="index"
          options={{
            title: "Select Service",
          }}
        />
        <Stack.Screen
          name="location"
          options={{
            title: "Location",
          }}
        />
        <Stack.Screen
          name="create-proposal"
          options={{
            title: "Create Proposal",
          }}
        />
        <Stack.Screen
          name="extra-options"
          options={{
            title: "Extra Options",
          }}
        />
        <Stack.Screen
          name="final-proposal"
          options={{
            title: "Review Proposal",
          }}
        />
      </Stack>
    </FormProvider>
  );
}
