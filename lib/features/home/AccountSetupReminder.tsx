import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useAccountSetupStatus } from "@/lib/hooks/useAccountSetupStatus";
import { useRouter } from "expo-router";
import { Check, ChevronRight } from "lucide-react-native";
import React from "react";

export default function AccountSetupReminder() {
  const router = useRouter();
  const { hasWorkingPreferences, hasServices, hasStripeSetup, needsSetup } =
    useAccountSetupStatus();

  if (!needsSetup) {
    return null;
  }

  return (
    <Box className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
      <VStack className="gap-3">
        <VStack className="gap-1">
          <Text className="text-sm font-inter-bold text-gray-900">
            Complete Account Setup
          </Text>
          <Text className="text-xs text-gray-600">
            Finish these steps to start receiving service requests
          </Text>
        </VStack>

        <VStack className="gap-2">
          {/* Working Preferences */}
          <Pressable
            onPress={() =>
              !hasWorkingPreferences &&
              router.push("/service-provider/account/working-preferences")
            }
            disabled={hasWorkingPreferences}
          >
            <Box
              className={`rounded-lg p-3 ${
                hasWorkingPreferences ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <HStack className="items-center justify-between">
                <HStack className="flex-1 items-center gap-2">
                  <Box
                    className={`w-6 h-6 rounded-full items-center justify-center ${
                      hasWorkingPreferences
                        ? "bg-green-500"
                        : "bg-white border-2 border-gray-300"
                    }`}
                  >
                    {hasWorkingPreferences && (
                      <Icon as={Check} size="xs" className="text-white" />
                    )}
                  </Box>
                  <VStack className="flex-1">
                    <Text
                      className={`text-xs font-inter-semibold ${
                        hasWorkingPreferences
                          ? "text-green-700"
                          : "text-gray-900"
                      }`}
                    >
                      Working Preferences
                    </Text>
                    <Text style={{ fontSize: 10 }} className="text-gray-500">
                      {hasWorkingPreferences
                        ? "Complete"
                        : "Set schedule & service area"}
                    </Text>
                  </VStack>
                </HStack>
                {!hasWorkingPreferences && (
                  <Icon as={ChevronRight} size="md" className="text-gray-400" />
                )}
              </HStack>
            </Box>
          </Pressable>

          {/* Service Settings */}
          <Pressable
            onPress={() =>
              !hasServices &&
              router.push("/service-provider/account/services-settings")
            }
            disabled={hasServices}
          >
            <Box
              className={`rounded-lg p-3 ${
                hasServices ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <HStack className="items-center justify-between">
                <HStack className="flex-1 items-center gap-2">
                  <Box
                    className={`w-6 h-6 rounded-full items-center justify-center ${
                      hasServices
                        ? "bg-green-500"
                        : "bg-white border-2 border-gray-300"
                    }`}
                  >
                    {hasServices && (
                      <Icon as={Check} size="xs" className="text-white" />
                    )}
                  </Box>
                  <VStack className="flex-1">
                    <Text
                      className={`text-xs font-inter-semibold ${
                        hasServices ? "text-green-700" : "text-gray-900"
                      }`}
                    >
                      Service Settings
                    </Text>
                    <Text style={{ fontSize: 10 }} className="text-gray-500">
                      {hasServices ? "Complete" : "Choose services to offer"}
                    </Text>
                  </VStack>
                </HStack>
                {!hasServices && (
                  <Icon as={ChevronRight} size="md" className="text-gray-400" />
                )}
              </HStack>
            </Box>
          </Pressable>

          {/* Bank Account */}
          <Pressable
            onPress={() =>
              !hasStripeSetup &&
              router.push(
                "/service-provider/account/bank-account/provision-account"
              )
            }
            disabled={hasStripeSetup}
          >
            <Box
              className={`rounded-lg p-3 ${
                hasStripeSetup ? "bg-green-50" : "bg-gray-50"
              }`}
            >
              <HStack className="items-center justify-between">
                <HStack className="flex-1 items-center gap-2">
                  <Box
                    className={`w-6 h-6 rounded-full items-center justify-center ${
                      hasStripeSetup
                        ? "bg-green-500"
                        : "bg-white border-2 border-gray-300"
                    }`}
                  >
                    {hasStripeSetup && (
                      <Icon as={Check} size="xs" className="text-white" />
                    )}
                  </Box>
                  <VStack className="flex-1">
                    <Text
                      className={`text-xs font-inter-semibold ${
                        hasStripeSetup ? "text-green-700" : "text-gray-900"
                      }`}
                    >
                      Bank Account
                    </Text>
                    <Text style={{ fontSize: 10 }} className="text-gray-500">
                      {hasStripeSetup
                        ? "Complete"
                        : "Connect to receive payments"}
                    </Text>
                  </VStack>
                </HStack>
                {!hasStripeSetup && (
                  <Icon as={ChevronRight} size="md" className="text-gray-400" />
                )}
              </HStack>
            </Box>
          </Pressable>
        </VStack>
      </VStack>
    </Box>
  );
}
