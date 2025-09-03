import { PrimaryButton } from "@/lib/components/custom-buttons";
import ProposalServiceCard from "@/lib/components/ProposalServiceCard";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { serviceConfigs } from "@/lib/constants/service-config";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { router } from "expo-router";
import { useFormContext } from "react-hook-form";

export default function SelectService() {
  const { watch, setValue } = useFormContext<CreateProposalFormData>();
  const selectedService = watch("serviceId");

  const handleNext = () => {
    if (!selectedService) {
      alert("Please select a service");
      return;
    }
    router.push("/customer/proposals/create/location");
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton disabled={!selectedService} onPress={handleNext}>
          Next
        </PrimaryButton>
      }
    >
      <StepIndicator steps={6} currentStep={1} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-4">
          {/* Header */}
          <VStack className="gap-2">
            {/* <Text className="text-2xl font-inter-bold text-black">
              Choose a Cleaning Service
            </Text> */}
            <Text className="text-md text-gray-600">
              Select the type of cleaning service you want for your home.
            </Text>
          </VStack>

          {/* Service Cards */}
          <VStack className="gap-4">
            {serviceConfigs.map((service) => (
              <ProposalServiceCard
                key={service.id}
                service={service}
                isSelected={selectedService === service.id}
                onPress={() => setValue("serviceId", service.id)}
              />
            ))}
          </VStack>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
