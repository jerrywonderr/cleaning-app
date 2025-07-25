import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";

import { Phone } from "lucide-react-native";
import { Linking } from "react-native";

const phoneNumber = "+2347057570146";

export default function SupportScreen() {
  const openDialer = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <ScrollableScreen addTopInset>
      <Box className="flex-1 justify-center items-center">
        <Pressable onPress={openDialer} className="items-center">
          <Box className="bg-blue-200 p-8 rounded-full mb-4">
            <Icon as={Phone} size="xl" className="text-blue-800 text-4xl" />
          </Box>
          <Text className="text-2xl font-semibold text-blue-800">
            Call Support
          </Text>
          <Text className="text-lg text-gray-500">{phoneNumber}</Text>
        </Pressable>
      </Box>
    </ScrollableScreen>
  );
}
