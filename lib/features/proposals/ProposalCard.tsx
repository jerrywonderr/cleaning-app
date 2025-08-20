import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { formatNaira } from "@/lib/utils/formatNaira";
import { ChevronRight } from "lucide-react-native";
import { Image } from "react-native";

export interface ProposalCardProps {
  title: string;
  price?: number;
  client: string;
  description: string;
  image?: string;
  status: "pending" | "accepted";
  onPress?: () => void;
}

export default function ProposalCard({
  title,
  price,
  client,
  description,
  image,
  status,
  onPress,
}: ProposalCardProps) {
  return (
    <Pressable onPress={onPress} className="px-2">
      <HStack className="items-center justify-between rounded-xl shadow-sm bg-white p-4">
        <HStack className="gap-5 flex-1">
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: 72,
                height: 72,
                borderRadius: 16,
                backgroundColor: "#f0f0f0",
              }}
            />
          ) : (
            <HStack className="w-[72px] h-[72px] rounded-2xl bg-gray-100 items-center justify-center">
              <Text className="text-xs text-gray-400">No Image</Text>
            </HStack>
          )}
          <VStack className="justify-around flex-1">
            {/* Title */}
            <Text className="text-base font-inter-semibold text-gray-900">
              {title}
            </Text>

            {/* Price + Client */}
            {price !== undefined && (
              <Text className="text-sm font-inter-medium text-gray-700">
                {formatNaira(price)} • {client}
              </Text>
            )}
            {!price && (
              <Text className="text-sm font-inter-medium text-gray-700">
                {client}
              </Text>
            )}

            {/* Description */}
            <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
              {description}
            </Text>

            {/* Status Badge */}
            <Text
              className={`mt-1 text-xs font-inter-medium ${
                status === "accepted" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {status === "accepted" ? "Accepted" : "Pending"}
            </Text>
          </VStack>
        </HStack>
        <Icon as={ChevronRight} className="text-gray-300" size="md" />
      </HStack>
    </Pressable>
  );
}
