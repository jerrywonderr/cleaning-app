import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "./ui/box";
import { ChevronLeftIcon, Icon } from "./ui/icon";
import { Pressable } from "./ui/pressable";

export default function ScreenHeader({ navigation, }: { navigation: any }) {
  const { top } = useSafeAreaInsets();

  return (
    <Box style={{ paddingTop: top }}>
      <Pressable onPress={() => navigation.canGoBack() && navigation.goBack()}>
        <Icon
          as={ChevronLeftIcon}
          className="text-typography-900 m-2 w-10 h-10"
          fill="none"
        />
      </Pressable>
    </Box>
  );
}
