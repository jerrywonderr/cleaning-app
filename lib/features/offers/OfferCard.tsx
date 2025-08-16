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
          <VStack className="justify-around flex-1">
            {/* Title - strong emphasis */}
            <Text className="text-base font-inter-semibold text-gray-900">
              {title}
            </Text>

            {/* Price + Provider - slightly lighter emphasis */}
            <Text className="text-sm font-inter-medium text-gray-700">
              {formatNaira(price)} • {provider}
            </Text>

            {/* Description - subtle, secondary */}
            <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
              {description}
            </Text>
          </VStack>
        </HStack>
        <Icon as={ChevronRight} className="text-gray-300" size="md" />
      </HStack>
    </Pressable>
  );
}
