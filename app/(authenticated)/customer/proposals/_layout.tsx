import StepIndicator from "@/lib/components/StepIndicator";
import { VStack } from "@/lib/components/ui/vstack";
import { Slot, usePathname } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";

export default function ProposalsLayout() {
  const methods = useForm({
    defaultValues: {
      serviceId: "",
      location: null,
      providerId: "",
      proposalDetails: {},
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
    <FormProvider {...methods}>
      <VStack className="flex-1 pt-4 px-6 bg-white">
        <StepIndicator steps={6} currentStep={getStep()} />
        <Slot />
      </VStack>
    </FormProvider>
  );
}
