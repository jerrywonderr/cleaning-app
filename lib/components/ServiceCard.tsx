import { Image } from "react-native";
import { ServiceConfig } from "../types/service-config";
import { formatCurrency } from "../utils/formatNaira";
import FormSwitch from "./form/FormSwitch";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

interface ServiceCardProps {
  service: ServiceConfig;
  onToggle?: (serviceId: string, enabled: boolean) => void;
  showToggle?: boolean;
  showPrice?: boolean;
}

export default function ServiceCard({
  service,
  onToggle,
  showToggle = false,
  showPrice = true,
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
            <FormSwitch
              value={service.isEnabled}
              onValueChange={(enabled) => onToggle(service.id, enabled)}
            />
          )}
        </HStack>
        {showPrice && (
          <HStack className="justify-between items-center pt-2">
            <Text className="text-sm text-gray-500">Per Hour Rate</Text>
            <Text className="text-lg font-inter-bold text-brand-600">
              {formatCurrency(service.perHourPrice)}
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
