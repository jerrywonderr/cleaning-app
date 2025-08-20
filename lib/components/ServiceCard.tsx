import { Image } from "react-native";
import { ServiceConfig } from "../types/service-config";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

interface ServiceCardProps {
  service: ServiceConfig;
  onToggle?: (serviceId: string, enabled: boolean) => void;
  showToggle?: boolean;
}

export default function ServiceCard({
  service,
  onToggle,
  showToggle = false,
}: ServiceCardProps) {
  return (
    <Box className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Image
        source={{ uri: service.image }}
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
          {showToggle && onToggle && (
            <Box
              className={`w-12 h-6 rounded-full ${
                service.isEnabled ? "bg-brand-500" : "bg-gray-300"
              }`}
              onTouchEnd={() => onToggle(service.id, !service.isEnabled)}
            >
              <Box
                className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  service.isEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </Box>
          )}
        </HStack>
        <HStack className="justify-between items-center pt-2">
          <Text className="text-sm text-gray-500">Per Hour Rate</Text>
          <Text className="text-lg font-inter-bold text-brand-600">
            ₦{service.perHourPrice}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
