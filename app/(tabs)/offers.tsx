import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
// import { Box } from "@/lib/components/ui/box";
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
    image:
      "https://images.unsplash.com/photo-1603384121578-bfde2129f9c4?auto=format&fit=crop&w=150&q=80",
  },
  {
    title: "Cleaning",
    price: "$789.78",
    provider: "Mr kay",
    description: "Classic Cleaning",
    image:
      "https://images.unsplash.com/photo-1603384121578-bfde2129f9c4?auto=format&fit=crop&w=150&q=80",
  },
  {
    title: "Cleaning",
    price: "$789.78",
    provider: "Mr kay",
    description: "Classic Cleaning",
    image:
      "https://images.unsplash.com/photo-1603384121578-bfde2129f9c4?auto=format&fit=crop&w=150&q=80",
  },
];

export default function OffersScreen() {
  return (
    <ScrollableScreen addTopInset>
      <VStack className="gap-4 pb-10">
        {offers.map((service, idx) => (
          <Pressable key={idx}>
            <HStack className="items-center justify-between border-b border-gray-200 pb-4">
              <HStack className="gap-4">
                <Image
                  source={{ uri: service.image }}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
                <VStack className="justify-center">
                  <Text className="font-semibold text-base">
                    {service.title}
                  </Text>
                  <Text className="text-sm text-gray-800 font-semibold">
                    {service.price} • {service.provider}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {service.description}
                  </Text>
                </VStack>
              </HStack>
              <Icon as={ChevronRight} className="text-gray-400" />
            </HStack>
          </Pressable>
        ))}
      </VStack>
    </ScrollableScreen>
  );
}
