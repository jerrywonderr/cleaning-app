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
                By downloading, installing, or using our cleaning service app as
                a service provider, you agree to be bound by these Terms of
                Service. If you do not agree to these terms, please do not use
                our app.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                2. Service Provider Responsibilities
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                As a service provider, you are responsible for providing
                professional cleaning services to customers. You must maintain
                appropriate licenses, insurance, and qualifications required by
                local laws and regulations.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                3. Account Requirements
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You must create an account and provide accurate, complete
                information. You must be at least 18 years old and legally
                authorized to work in your service area. You are responsible for
                maintaining the confidentiality of your account credentials.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                4. Background Checks and Verification
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We may conduct background checks and verify your identity,
                qualifications, and references. You consent to these checks and
                agree to provide any additional information requested. Failure
                to pass background checks may result in account termination.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                5. Service Standards
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You must provide services in a professional manner, arrive on
                time, use appropriate cleaning supplies and equipment, and
                maintain a clean, safe work environment. You must comply with
                all applicable health and safety regulations.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                6. Payment and Fees
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We will process payments for services you provide and remit your
                earnings minus our platform fees. Payment schedules and fee
                structures are subject to change with notice. You are
                responsible for reporting and paying taxes on your earnings.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                7. Independent Contractor Status
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You are an independent contractor, not our employee. You are
                responsible for your own taxes, insurance, equipment, and
                business expenses. We do not provide benefits, workers&apos;
                compensation, or unemployment insurance.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                8. Customer Interactions
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You must treat customers with respect and professionalism. You
                may not discriminate against customers based on protected
                characteristics. You must maintain customer confidentiality and
                not share personal information.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                9. Insurance and Liability
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You must maintain appropriate liability insurance to cover
                damages that may occur during service provision. We are not
                liable for damages, injuries, or losses arising from your
                services or actions.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                10. Prohibited Activities
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                You may not use our platform for illegal activities, provide
                false information, engage in fraud, or violate any applicable
                laws or regulations. Violation may result in immediate account
                termination.
              </Text>
            </VStack>

            <VStack className="gap-2">
              <Text className="text-lg font-inter-semibold text-black">
                11. Termination
              </Text>
              <Text className="text-sm text-gray-700 leading-6">
                We may terminate your account at any time for violation of these
                terms, poor performance, or for any other reason. You may
                terminate your account by contacting customer support. Upon
                termination, you must complete any pending services.
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
