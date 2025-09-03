import ScreenHeader from "@/lib/components/ScreenHeader";
import {
  CreateProposalFormData,
  createProposalSchema,
} from "@/lib/schemas/create-proposal";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, usePathname } from "expo-router";
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

  const pathname = usePathname();

  const getStep = () => {
    if (pathname.includes("select-service")) return 1;
    if (pathname.includes("location")) return 2;
    if (pathname.includes("select-provider")) return 3;
    if (pathname.includes("create-proposal")) return 4;
    if (pathname.includes("extra-options")) return 5;
    if (pathname.includes("final-proposal")) return 6;
    return 1;
  };

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
          name="select-service"
          options={{
            title: "Select Service",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="location"
          options={{
            title: "Location",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="select-provider"
          options={{
            title: "Select Provider",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="create-proposal"
          options={{
            title: "Create Proposal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="extra-options"
          options={{
            title: "Extra Options",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="final-proposal"
          options={{
            title: "Review Proposal",
            headerShown: false,
          }}
        />
      </Stack>
    </FormProvider>
  );
}
