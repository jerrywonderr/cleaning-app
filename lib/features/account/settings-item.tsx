import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";

interface SettingsItemProps {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
}

export const SettingsItem = ({ label, onPress, icon }: SettingsItemProps) => {
  return (
    <Pressable onPress={onPress}>
      <HStack className={`justify-between items-center py-3 px-2`}>
        <HStack className="gap-4 items-center">
          <Icon as={icon} className="text-black" size="xl" />
          <Text className="text-black font-inter-medium">{label}</Text>
        </HStack>
        <Icon as={ChevronRight} className="text-gray-400" size="xl" />
      </HStack>
    </Pressable>
  );
};
