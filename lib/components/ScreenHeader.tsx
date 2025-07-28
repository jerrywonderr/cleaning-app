import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./ui/box";
import { Heading } from "./ui/heading";
import { ChevronLeftIcon, Icon } from "./ui/icon";
import { Pressable } from "./ui/pressable";

export default function ScreenHeader({
  navigation,
  title,
  showBackButton = true,
  onBackPress,
  rightContent,
}: {
  navigation: any;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
}) {
  const { top } = useSafeAreaInsets();

  return (
    <Box className="bg-white" style={{ paddingTop: top }}>
      <Box className="flex-row items-center justify-between py-2 px-4">
        {/* Left side - Back button or spacer */}
        <Box className="w-10 h-10 justify-center items-center">
          {showBackButton ? (
            <Pressable
              onPress={() =>
                onBackPress
                  ? onBackPress()
                  : navigation.canGoBack() && navigation.goBack()
              }
            >
              <Icon
                as={ChevronLeftIcon}
                className="font-inter-bold w-8 h-8"
                fill="none"
              />
            </Pressable>
          ) : null}
        </Box>

        {/* Center - Title */}
        <Box className="flex-1 justify-center items-center">
          {title && (
            <Heading className="font-inter-bold text-xl text-center">
              {title}
            </Heading>
          )}
        </Box>

        {/* Right side - Custom content or spacer */}
        <Box className="w-10 h-10 justify-center items-center">
          {rightContent}
        </Box>
      </Box>
    </Box>
  );
}
