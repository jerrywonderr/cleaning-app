import ScreenHeader from "@/lib/components/ScreenHeader";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    navigation.setOptions({
      header: ({ navigation, options }: { navigation: any; options: any }) => (
        <ScreenHeader
          navigation={navigation}
          title="Privacy Policy"
          showBackButton={true}
        />
      ),
    });
  }, [navigation]);

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1 px-4 pb-6">
        <VStack className="gap-6">
          <Text className="text-sm text-gray-600 mb-2">
            Last updated: {new Date().toLocaleDateString()}
          </Text>

          <VStack className="gap-4">
            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                1. Information We Collect
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We collect information you provide directly to us, such as when
                you create an account, offer services, or contact customer
                support. This may include your name, email address, phone
                number, address, business information, background check results,
                and payment information.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                2. How We Use Your Information
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We use the information we collect to provide, maintain, and
                improve our services, process transactions, verify your identity
                and qualifications, send you technical notices and support
                messages, and respond to your comments and questions.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                3. Information Sharing
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy. We may share your profile information
                with customers to facilitate service bookings.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                4. Data Security
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the internet is 100% secure.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                5. Location Services
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                Our app may request access to your location to provide
                location-based services such as matching you with nearby
                customers. You can control location permissions in your device
                settings.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                6. Background Checks
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                As a service provider, we may conduct background checks and
                collect related information to ensure the safety and trust of
                our platform. This information is handled in accordance with
                applicable laws and regulations.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                7. Children&apos;s Privacy
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                Our services are not intended for children under 13 years of
                age. We do not knowingly collect personal information from
                children under 13. If you are a parent and believe your child
                has provided us with personal information, please contact us.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                8. Your Rights
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You have the right to access, update, or delete your personal
                information. You may also opt out of marketing communications.
                Contact us to exercise these rights.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                9. Changes to This Policy
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the &quot;Last updated&quot; date.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                10. Contact Us
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                If you have any questions about this privacy policy, please
                contact us at:
                {"\n"}Email: privacy@cleaningapp.com
                {"\n"}Phone: +1 (555) 123-4567
                {"\n"}Address: 123 Cleaning Street, City, State 12345
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
