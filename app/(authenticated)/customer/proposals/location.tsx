import { PrimaryButton } from "@/lib/components/custom-buttons";
import { AddressField, AddressFieldRef } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";

export default function LocationScreen() {
  const { watch, setValue } = useFormContext();
  const selectedLocation = watch("location");

  const addressRef = useRef<AddressFieldRef>(null);
  const router = useRouter();

  const handleNext = () => {
    if (!selectedLocation) {
      alert("Please select a location");
      return;
    }

    router.push("/(authenticated)/customer/proposals/select-provider");
  };

  return (
    <FootedScrollableScreen
      footer={
        <PrimaryButton onPress={handleNext} disabled={!selectedLocation}>
          Next
        </PrimaryButton>
      }
    >
      <VStack className="gap-6">
        <Text className="text-2xl font-inter-bold text-black">
          Where should we clean?
        </Text>

        <AddressField
          ref={addressRef}
          name="location"
          label="Cleaning Address"
          placeholder="Enter your address"
          onLocationChange={(location) => setValue("location", location)}
        />
      </VStack>
    </FootedScrollableScreen>
  );
}
