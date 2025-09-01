import { Image, TouchableOpacity } from "react-native";
import { ServiceConfig } from "../types/service-config";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

interface ProposalServiceCardProps {
  service: ServiceConfig;
  isSelected?: boolean;
  onPress?: (serviceId: string) => void;
}

export default function ProposalServiceCard({
  service,
  isSelected = false,
  onPress,
}: ProposalServiceCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress?.(service.id)}>
      <Box
        className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
          isSelected ? "border-brand-600 bg-brand-50" : "border-gray-200"
        }`}
      >
        <Image
          source={{
            uri: service.image ?? "https://picsum.photos/200/200?random=1",
          }}
          className="w-full h-32"
          resizeMode="cover"
        />
        <VStack className="p-4 gap-2">
          <HStack className="justify-between items-start">
            <VStack className="flex-1 gap-1">
              <Text className="text-lg font-inter-bold text-black">
                {service.name}
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                {service.description}
              </Text>
            </VStack>
          </HStack>
          <HStack className="justify-between items-center pt-2">
            <Text className="text-sm text-gray-500">Per Hour Rate</Text>
            <Text className="text-lg font-inter-bold text-brand-600">
              ₦{service.perHourPrice}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
}
