import { PrimaryButton } from "@/lib/components/custom-buttons";
import { Box } from "@/lib/components/ui/box";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { router } from "expo-router";
import { useState } from "react";

const serviceOptions = [
  { label: "Standard Cleaning", value: "standard" },
  { label: "Deep Cleaning", value: "deep" },
  { label: "Move-in/Move-out", value: "move" },
];

export default function ServiceTypeStep() {
  const [serviceType, setServiceType] = useState("");

  return (
    <Box className="flex-1 bg-white justify-between">
      <Box>
        <Text className="text-2xl font-bold mb-6">What type of cleaning?</Text>

        <Text className="text-base mb-2">Choose your preferred service</Text>

        <Box className="gap-4">
          {serviceOptions.map((option) => {
            const isSelected = serviceType === option.value;

            return (
              <Pressable
                key={option.value}
                className={`px-4 py-3 rounded-xl border ${
                  isSelected
                    ? "bg-brand-500 border-brand-500"
                    : "bg-white border-gray-300"
                }`}
                onPress={() => setServiceType(option.value)}
              >
                <Text
                  className={`text-base ${
                    isSelected ? "text-white font-bold" : "text-gray-800"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </Box>
      </Box>

      <Box className="mb-6">
        <PrimaryButton
          onPress={() => router.push("/book/schedule")}
          isDisabled={!serviceType}
        >
          Next
        </PrimaryButton>
      </Box>
    </Box>
  );
}
