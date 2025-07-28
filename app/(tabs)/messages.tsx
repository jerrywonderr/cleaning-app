import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";

import { Phone } from "lucide-react-native";
import { Linking } from "react-native";

const phoneNumber = "+2347057570146";

export default function MessagesScreen() {
  const openDialer = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <ScrollableScreen addTopInset addBottomInset={false}>
      <Box className="flex-1 justify-center items-center">
        <Pressable onPress={openDialer}>
          <Box className="bg-blue-100 p-10 rounded-full shadow-md shadow-blue-300">
            <Icon as={Phone} size={48 as any} className="text-blue-800" />
          </Box>
        </Pressable>
      </Box>
    </ScrollableScreen>
  );
}
