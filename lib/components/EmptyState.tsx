import { Image } from "react-native";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

const ghostImage = require("@/assets/app-images/ghost.png");

interface EmptyStateProps {
  title: string;
  description?: string;
  imageSource?: any;
}

export const EmptyState = ({
  title,
  description,
  imageSource = ghostImage,
}: EmptyStateProps) => {
  return (
    <VStack className="items-center justify-center py-12 px-6">
      <VStack className="items-center gap-4">
        <VStack className="w-24 h-24 items-center justify-center">
          <Image
            source={imageSource}
            className="w-full h-full"
            resizeMode="contain"
          />
        </VStack>
        <VStack className="items-center gap-2">
          <Text className="text-lg font-inter-bold text-gray-900 text-center">
            {title}
          </Text>
          {description && (
            <Text className="text-gray-600 text-center text-sm">
              {description}
            </Text>
          )}
        </VStack>
      </VStack>
    </VStack>
  );
};
