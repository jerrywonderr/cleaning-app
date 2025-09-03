import { PrimaryButton } from "@/lib/components/custom-buttons";
import ProposalServiceCard from "@/lib/components/ProposalServiceCard";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { serviceConfigs } from "@/lib/constants/service-config";
import { useRouter } from "expo-router";
import { useFormContext } from "react-hook-form";

export default function SelectService() {
  const { watch, setValue } = useFormContext();
  const selectedService = watch("serviceId");
  const router = useRouter();

  const handleNext = () => {
    if (!selectedService) {
      alert("Please select a service");
      return;
    }
    router.push("/(authenticated)/customer/proposals/location");
  };

  return (
    <FootedScrollableScreen
      footer={<PrimaryButton onPress={handleNext}>Next</PrimaryButton>}
    >
      <VStack className="gap-4">
        {/* Header */}
        <VStack className="gap-2">
          <Text className="text-2xl font-inter-bold text-black">
            Choose a Cleaning Service
          </Text>
          <Text className="text-sm text-gray-600">
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
    </FootedScrollableScreen>
  );
}
