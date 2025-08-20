import { ExtraServiceOption } from "../types/service-config";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

interface ExtraServiceOptionCardProps {
  option: ExtraServiceOption;
  onToggle?: (optionId: string, enabled: boolean) => void;
  showToggle?: boolean;
}

export default function ExtraServiceOptionCard({
  option,
  onToggle,
  showToggle = false,
}: ExtraServiceOptionCardProps) {
  return (
    <Box className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <VStack className="p-4 gap-3">
        <HStack className="justify-between items-start">
          <VStack className="flex-1 gap-1">
            <Text className="text-base font-inter-semibold text-black">
              {option.name}
            </Text>
            <Text className="text-sm text-gray-600 leading-5">
              {option.description}
            </Text>
          </VStack>
          {showToggle && onToggle && (
            <Box
              className={`w-12 h-6 rounded-full ${
                option.isEnabled ? "bg-brand-500" : "bg-gray-300"
              }`}
              onTouchEnd={() => onToggle(option.id, !option.isEnabled)}
            >
              <Box
                className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  option.isEnabled ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </Box>
          )}
        </HStack>
        <HStack className="justify-between items-center pt-1">
          <Text className="text-sm text-gray-500">Additional Cost</Text>
          <Text className="text-base font-inter-semibold text-brand-600">
            +₦{option.additionalPrice}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
