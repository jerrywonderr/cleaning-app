import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";

import { Pressable } from "@/lib/components/ui/pressable";
import { useRouter } from "expo-router";

// Example services
const services = [
  { id: "service-1", name: "Classic Cleaning" },
  { id: "service-2", name: "Deep Cleaning" },
  { id: "service-3", name: "Move-In Move Out" },
];

export default function SelectServiceScreen() {
  const router = useRouter();

  return (
    <ScrollableScreen addTopInset={false}>
      <VStack className="p-4 gap-6">
        <Text className="text-2xl font-inter-bold text-black">
          Select a Service
        </Text>

        <VStack className="gap-4">
          {services.map((service) => (
            <Pressable
              key={service.id}
              onPress={() =>
                router.push({
                  pathname: "/(authenticated)/customer/proposals/location",
                  params: { serviceId: service.id },
                })
              }
              className="p-4 border border-gray-300 rounded-lg"
            >
              <Text className="text-black">{service.name}</Text>
            </Pressable>
          ))}
        </VStack>
      </VStack>
    </ScrollableScreen>
  );
}
