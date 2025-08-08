import ScreenHeader from "@/lib/components/ScreenHeader";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function TermsOfServiceScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    navigation.setOptions({
      header: ({ navigation, options }: { navigation: any; options: any }) => (
        <ScreenHeader
          navigation={navigation}
          title="Terms of Service"
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
                1. Acceptance of Terms
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                By downloading, installing, or using our cleaning service app,
                you agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use our app.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                2. Description of Service
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                Our app connects customers with professional cleaning service
                providers. We facilitate booking, scheduling, and payment
                processing for cleaning services. We do not provide cleaning
                services directly but act as a platform connecting customers and
                service providers.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                3. User Accounts
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You must create an account to use our services. You are
                responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your
                account. You must be at least 18 years old to create an account.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                4. Booking and Cancellation
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You may book cleaning services through our app. Cancellation
                policies vary by service provider. Cancellations made within 24
                hours of the scheduled service may incur a fee. We reserve the
                right to cancel bookings due to service provider unavailability.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                5. Payment Terms
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                Payment is processed through secure third-party payment
                processors. You authorize us to charge your payment method for
                services booked through our app. All fees are non-refundable
                except as required by law or as specified in our refund policy.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                6. Service Provider Responsibility
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                Service providers are independent contractors, not our
                employees. We do not guarantee the quality of services provided
                by third-party service providers. We are not liable for any
                damages or issues arising from services provided by service
                providers.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                7. User Conduct
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You agree not to use our app for any unlawful purpose or to
                violate any applicable laws or regulations. You must not
                interfere with the app&apos;s functionality or attempt to gain
                unauthorized access to our systems.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                8. Intellectual Property
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                Our app and its content are protected by copyright, trademark,
                and other intellectual property laws. You may not copy, modify,
                distribute, or create derivative works without our express
                written consent.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                9. Limitation of Liability
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                To the maximum extent permitted by law, we shall not be liable
                for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of our app or services.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                10. Dispute Resolution
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                Any disputes arising from these terms or your use of our app
                shall be resolved through binding arbitration in accordance with
                the rules of the American Arbitration Association, except where
                prohibited by law.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                11. Termination
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We may terminate or suspend your account at any time for
                violation of these terms or for any other reason. You may
                terminate your account at any time by contacting customer
                support.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                12. Changes to Terms
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We may modify these terms at any time. We will notify you of
                significant changes through the app or by email. Your continued
                use of the app after changes become effective constitutes
                acceptance of the new terms.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                13. Contact Information
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                If you have questions about these terms, please contact us at:
                {"\n"}Email: legal@cleaningapp.com
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
