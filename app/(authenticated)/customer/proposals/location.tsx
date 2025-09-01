import { PrimaryButton } from "@/lib/components/custom-buttons";
import { AddressField, AddressFieldRef } from "@/lib/components/form";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function LocationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = params.serviceId as string;

  const methods = useForm();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const addressRef = useRef<AddressFieldRef>(null);

  const handleNext = () => {
    if (!selectedLocation) {
      alert("Please select a location");
      return;
    }

    router.push({
      pathname: "/(authenticated)/customer/proposals/select-provider",
      params: {
        serviceId,
        location: JSON.stringify(selectedLocation),
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <ScrollableScreen addTopInset={false}>
        <VStack className="p-4 gap-6">
          <Text className="text-2xl font-inter-bold text-black">
            Where should we clean?
          </Text>

          <Box>
            <AddressField
              ref={addressRef}
              name="cleaningAddress"
              label="Cleaning Address"
              placeholder="Enter your address"
              onLocationChange={(location) => setSelectedLocation(location)}
            />
          </Box>

          <Box className="mt-6">
            <PrimaryButton onPress={handleNext} disabled={!selectedLocation}>
              Next
            </PrimaryButton>
          </Box>
        </VStack>
      </ScrollableScreen>
    </FormProvider>
  );
}
