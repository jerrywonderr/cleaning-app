import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { formatNaira } from "@/lib/utils/formatNaira";
import { ChevronRight } from "lucide-react-native";
import { Image } from "react-native";

export interface OfferCardProps {
  title: string;
  price: number;
  provider: string;
  description: string;
  image: string;
  onPress?: () => void;
}

export default function OfferCard({
  title,
  price,
  provider,
  description,
  image,
  onPress,
}: OfferCardProps) {
  return (
    <Pressable onPress={onPress} className="px-2">
      <HStack className="items-center justify-between rounded-xl shadow-sm bg-white p-4">
        <HStack className="gap-5 flex-1">
          <Image
            source={{ uri: image }}
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              backgroundColor: "#f0f0f0",
            }}
          />
          <VStack className="justify-center flex-1">
            <Text className="text-lg font-inter-bold text-gray-900">
              {title}
            </Text>
            <Text className="text-base text-gray-800 font-inter-medium">
              {formatNaira(price)} • {provider}
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={2}>
              {description}
            </Text>
          </VStack>
        </HStack>
        <Icon as={ChevronRight} className="text-gray-300" size="md" />
      </HStack>
    </Pressable>
  );
}
