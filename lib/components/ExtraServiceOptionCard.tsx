import { Pressable } from "react-native";
import { ExtraServiceOption } from "../types/service-config";
import FormSwitch from "./form/FormSwitch";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

interface ExtraServiceOptionCardProps {
  option: ExtraServiceOption;
  onToggle?: (optionId: string, enabled: boolean) => void;
  showToggle?: boolean;
  className?: string;
}

export default function ExtraServiceOptionCard({
  option,
  onToggle,
  showToggle = false,
  className = "",
}: ExtraServiceOptionCardProps) {
  const handlePress = () => {
    if (onToggle) onToggle(option.id, !option.isEnabled);
  };

  const Content = (
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
          <FormSwitch
            value={option.isEnabled}
            onValueChange={(enabled) => onToggle(option.id, enabled)}
          />
        )}
      </HStack>
      <HStack className="justify-between items-center pt-1">
        <Text className="text-sm text-gray-500">Additional Cost</Text>
        <Text className="text-base font-inter-semibold text-brand-600">
          +₦{option.additionalPrice}
        </Text>
      </HStack>
    </VStack>
  );

  return (
    <Pressable onPress={handlePress}>
      <Box
        className={`bg-gray-50 rounded-lg border border-gray-200 overflow-hidden ${className}`}
      >
        {Content}
      </Box>
    </Pressable>
  );
}
