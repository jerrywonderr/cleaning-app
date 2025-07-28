import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { ChevronRight } from "lucide-react-native";
import { Image } from "react-native";

const offers = [
  {
    title: "Cleaning",
    price: "$789.78",
    provider: "Mr kay",
    description: "Classic Cleaning",
    image: "https://picsum.photos/200/200",
  },
  {
    title: "Cleaning",
    price: "$789.78",
    provider: "Mr kay",
    description: "Classic Cleaning",
    image: "https://picsum.photos/200/200",
  },
  {
    title: "Cleaning",
    price: "$789.78",
    provider: "Mr kay",
    description: "Classic Cleaning",
    image: "https://picsum.photos/200/200",
  },
];

export default function OffersScreen() {
  return (
    <ScrollableScreen addTopInset={false}>
      <VStack className="gap-6 mt-4 py-4">
        {offers.map((service, idx) => (
          <Pressable key={idx} className="rounded-2xl bg-white shadow p-4 mx-4">
            <HStack className="items-center justify-between">
              <HStack className="gap-5">
                <Image
                  source={{ uri: service.image }}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 16,
                    backgroundColor: "#f0f0f0",
                  }}
                />
                <VStack className="justify-center">
                  <Text className="text-lg font-bold text-gray-900">
                    {service.title}
                  </Text>
                  <Text className="text-base text-gray-800 font-medium">
                    {service.price} • {service.provider}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {service.description}
                  </Text>
                </VStack>
              </HStack>
              <Icon as={ChevronRight} className="text-gray-300" size="md" />
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </ScrollableScreen>
  );
}
