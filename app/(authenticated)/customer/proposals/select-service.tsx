import { PrimaryButton } from "@/lib/components/custom-buttons";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

// Service providers (same as before)
const serviceProviders = [
  {
    id: "provider-1",
    name: "CleanCo Experts",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    workingHours: { start: "09:00", end: "17:00" },
  },
  {
    id: "provider-2",
    name: "Sparkle Team",
    workingDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    workingHours: { start: "10:00", end: "18:00" },
  },
  {
    id: "provider-3",
    name: "Shiny Homes",
    workingDays: ["Mon", "Wed", "Fri", "Sat"],
    workingHours: { start: "08:00", end: "14:00" },
  },
];

export default function SelectProviderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = params.serviceId as string;

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  return (
    <ScrollableScreen addTopInset={false}>
      <VStack className="p-4 gap-6">
        <Text className="text-2xl font-inter-bold text-black">
          Select a Service Provider
        </Text>

        <VStack className="gap-4">
          {serviceProviders.map((provider) => (
            <Pressable
              key={provider.id}
              onPress={() => setSelectedProvider(provider.id)}
              className={`p-4 border rounded-lg ${
                selectedProvider === provider.id
                  ? "bg-brand-500 border-brand-500"
                  : "border-gray-300"
              }`}
            >
              <Text
                className={`${
                  selectedProvider === provider.id ? "text-white" : "text-black"
                }`}
              >
                {provider.name}
              </Text>
              <Text className="text-gray-600 text-sm">
                Days: {provider.workingDays.join(", ")} | Hours:{" "}
                {provider.workingHours.start}-{provider.workingHours.end}
              </Text>
            </Pressable>
          ))}
        </VStack>

        <Box className="mt-6">
          <PrimaryButton
            disabled={!selectedProvider}
            onPress={() =>
              router.push({
                pathname: "/(authenticated)/customer/proposals/create-proposal",
                params: {
                  serviceId,
                  providerId: selectedProvider,
                },
              })
            }
          >
            Next
          </PrimaryButton>
        </Box>
      </VStack>
    </ScrollableScreen>
  );
}
