import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";

import { Mail, MessageSquare, Phone } from "lucide-react-native";
import { Alert, Linking } from "react-native";

const phoneNumber = "+2347057570146";
const emailAddress = "support@example.com";
const whatsappNumber = "2347057570146"; // Use international format without '+' for WhatsApp

export default function SupportScreen() {
  const openDialer = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openEmail = () => {
    const mailto = `mailto:${emailAddress}`;
    Linking.openURL(mailto).catch(() => {
      Alert.alert("Error", "Unable to open email client");
    });
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Unable to open WhatsApp");
    });
  };

  return (
    <ScrollableScreen addTopInset>
      <Box className="flex-1 justify-center items-center px-4">
        <VStack className="gap-8 items-center">
          {/* Email */}
          <Pressable onPress={openEmail} className="items-center">
            <Box className="bg-blue-100 p-8 rounded-full shadow-md shadow-blue-300">
              <Icon as={Mail} size={40} className="text-blue-700" />
            </Box>
            <Text className="mt-2 font-medium text-blue-700">Email</Text>
          </Pressable>

          {/* Phone */}
          <Pressable onPress={openDialer} className="items-center">
            <Box className="bg-green-100 p-8 rounded-full shadow-md shadow-green-300">
              <Icon as={Phone} size={40} className="text-green-700" />
            </Box>
            <Text className="mt-2 font-medium text-green-700">Call</Text>
          </Pressable>

          {/* WhatsApp */}
          <Pressable onPress={openWhatsApp} className="items-center">
            <Box className="bg-emerald-100 p-8 rounded-full shadow-md shadow-emerald-300">
              <Icon as={MessageSquare} size={40} className="text-emerald-700" />
            </Box>
            <Text className="mt-2 font-medium text-emerald-700">WhatsApp</Text>
          </Pressable>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
