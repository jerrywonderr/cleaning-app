import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
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
    <ScrollableScreen addTopInset={false} contentContainerClassName="px-2">
      <Box className="flex-1 pt-4 px-2">
        {/* Header Section */}
        <VStack className="mb-8">
          <HStack className="items-center gap-2">
            <Text className="text-2xl font-inter-bold text-gray-900 text-center mb-2">
              Need Help?
            </Text>
          </HStack>
          <Text className="text-gray-600 text-base leading-6">
            We&apos;re here to help! Choose your preferred way to get in touch
            with our support team.
          </Text>
        </VStack>

        {/* Contact Options */}
        <VStack className="gap-4">
          {/* Email Option */}
          <Pressable onPress={openEmail} className="active:opacity-70">
            <Box className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <HStack className="items-center justify-between">
                <HStack className="items-center gap-4">
                  <Box className="bg-brand-500/10 p-3 rounded-lg">
                    <Icon as={Mail} size="lg" className="text-brand-500" />
                  </Box>
                  <VStack>
                    <Text className="text-lg font-inter-semibold text-gray-900">
                      Email Support
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Get help via email
                    </Text>
                  </VStack>
                </HStack>
                <Text className="text-brand-500 font-inter-medium">
                  Send Email
                </Text>
              </HStack>
            </Box>
          </Pressable>

          {/* Phone Option */}
          <Pressable onPress={openDialer} className="active:opacity-70">
            <Box className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <HStack className="items-center justify-between">
                <HStack className="items-center gap-4">
                  <Box className="bg-green-50 p-3 rounded-lg">
                    <Icon as={Phone} size="lg" className="text-green-600" />
                  </Box>
                  <VStack>
                    <Text className="text-lg font-inter-semibold text-gray-900">
                      Call Us
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Speak with our team
                    </Text>
                  </VStack>
                </HStack>
                <Text className="text-green-600 font-inter-medium">
                  Call Now
                </Text>
              </HStack>
            </Box>
          </Pressable>

          {/* WhatsApp Option */}
          <Pressable onPress={openWhatsApp} className="active:opacity-70">
            <Box className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <HStack className="items-center justify-between">
                <HStack className="items-center gap-4">
                  <Box className="bg-emerald-50 p-3 rounded-lg">
                    <Icon
                      as={MessageSquare}
                      size="lg"
                      className="text-emerald-600"
                    />
                  </Box>
                  <VStack>
                    <Text className="text-lg font-inter-semibold text-gray-900">
                      WhatsApp
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Chat with us instantly
                    </Text>
                  </VStack>
                </HStack>
                <Text className="text-emerald-600 font-inter-medium">
                  Start Chat
                </Text>
              </HStack>
            </Box>
          </Pressable>
        </VStack>

        {/* Additional Info */}
        <Box className="mt-8 p-4 bg-brand-500/10 rounded-xl">
          <VStack className="gap-2">
            <Text className="text-sm font-inter-semibold text-gray-900">
              Response Times
            </Text>
            <Text className="text-sm text-gray-600">
              • Email: Within 24 hours{"\n"}• Phone: Available 9AM - 6PM{"\n"}•
              WhatsApp: Usually within 2 hours
            </Text>
          </VStack>
        </Box>
      </Box>
    </ScrollableScreen>
  );
}
