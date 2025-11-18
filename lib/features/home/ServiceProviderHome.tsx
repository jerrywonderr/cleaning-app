import { PrimaryButton } from "@/lib/components/custom-buttons";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import AppointmentItem from "@/lib/features/appointments/AppointmentItem";
import { useUserType } from "@/lib/hooks/useAuth";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useProviderServiceRequests } from "@/lib/hooks/useServiceRequests";
import { formatCurrency } from "@/lib/utils/formatNaira";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Bell, Calendar, ChevronRight } from "lucide-react-native";
import React from "react";
import { ScrollView } from "react-native";

export default function ServiceProviderHome() {
  const { profile } = useUserType();
  const { stripeConnectAccount, isLoadingStripeAccount } = useBankAccount();
  const router = useRouter();

  const hasNotification = true;

  // Fetch service requests for this provider
  const { data: serviceRequests = [] } = useProviderServiceRequests(
    profile?.id || ""
  );

  // Filter appointments based on status
  const upcomingAppointments = serviceRequests.filter(
    (request) => request.serviceRequest.status === "confirmed"
  );
  const ongoingAppointments = serviceRequests.filter(
    (request) => request.serviceRequest.status === "in-progress"
  );
  const needsStripeSetup =
    !isLoadingStripeAccount &&
    (!stripeConnectAccount ||
      (stripeConnectAccount.stripeAccountStatus !== "active" &&
        stripeConnectAccount.stripeAccountStatus !== "completed"));

  // Calculate monthly earnings from paid jobs in the last month
  const getMonthlyEarnings = (): number => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Statuses where payment has NOT been made yet
    const unpaidStatuses = [
      "pending",
      "accepted",
      "rejected",
      "pending_payment",
      "payment_failed",
    ];

    return serviceRequests
      .filter((request) => {
        const status = request.serviceRequest.status;
        const hasBeenPaid = !unpaidStatuses.includes(status);

        // For paid jobs, check if they were paid within the last month
        // Use confirmedAt (when payment was made) or completedAt as fallback
        const paymentDate =
          request.serviceRequest.confirmedAt ||
          request.serviceRequest.completedAt;
        const isWithinLastMonth =
          paymentDate && new Date(paymentDate) >= oneMonthAgo;

        return hasBeenPaid && isWithinLastMonth;
      })
      .reduce((total, request) => total + request.serviceRequest.totalPrice, 0);
  };

  if (!profile) {
    return (
      <FixedScreen addTopInset={true} addBottomInset={false}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading...</Text>
        </Box>
      </FixedScreen>
    );
  }

  return (
    <FixedScreen addTopInset={true} addBottomInset={false}>
      <Box className="flex-1">
        <HStack className="flex-row justify-between items-center mb-4 pt-4 mt-8">
          <Text className="text-xl font-inter-bold">
            Hello, {profile.firstName || "Service Provider"}!
          </Text>
          <HStack className="flex-row gap-3">
            <Pressable>
              <Box className="relative">
                <Box className="bg-brand-500 p-3 rounded-2xl">
                  <Icon as={Bell} size="xl" className="text-white" />
                </Box>
                {hasNotification && (
                  <Box
                    className="bg-white rounded-full"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 14,
                      width: 8,
                      height: 8,
                    }}
                  />
                )}
              </Box>
            </Pressable>
            {/* <Pressable>
              <Box className="bg-[#e3e5f4] p-2.5 rounded-xl">
                <Icon as={Info} />
              </Box>
            </Pressable> */}
          </HStack>
        </HStack>

        <LinearGradient
          colors={["#3B82F6", "#454EB0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="px-6 py-5 mb-6 rounded-xl"
          style={{
            borderRadius: 16,
            paddingHorizontal: 24,
            paddingVertical: 20,
            marginBottom: 16,
          }}
        >
          <HStack className="justify-between items-center mb-4">
            <Text className="text-white text-lg font-inter-semibold">
              Today&apos;s Overview
            </Text>
            <Pressable
              onPress={() => router.push("/service-provider/account/balance")}
            >
              <HStack className="items-center gap-1">
                <Text className="text-sm font-medium text-white">
                  View Details
                </Text>
                <Icon as={ChevronRight} size="sm" className="text-white" />
              </HStack>
            </Pressable>
          </HStack>

          <HStack className="justify-between items-center gap-4">
            <VStack className="flex-1 items-center">
              <Text className="text-2xl font-inter-bold text-white">
                {upcomingAppointments.length}
              </Text>
              <Text className="text-xs text-blue-100">Upcoming</Text>
            </VStack>
            <VStack className="flex-1 items-center">
              <Text className="text-2xl font-inter-bold text-white">
                {ongoingAppointments.length}
              </Text>
              <Text className="text-xs text-blue-100">In Progress</Text>
            </VStack>
            <VStack className="flex-1 items-center">
              <Text className="text-2xl font-inter-bold text-white">
                {formatCurrency(getMonthlyEarnings())}
              </Text>
              <Text className="text-xs text-blue-100">Monthly Earnings</Text>
            </VStack>
          </HStack>
        </LinearGradient>

        {needsStripeSetup && (
          <Box className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-4">
            <VStack className="gap-3">
              <Text className="text-base font-inter-semibold text-brand-700">
                Finish Stripe setup to get paid
              </Text>
              <Text className="text-sm text-gray-600">
                Complete onboarding to enable payouts and deposits to your bank
                account.
              </Text>
              <PrimaryButton
                size="sm"
                onPress={() =>
                  router.push(
                    "/service-provider/account/bank-account/provision-account"
                  )
                }
              >
                Continue setup
              </PrimaryButton>
            </VStack>
          </Box>
        )}

        {/* Appointments Section */}
        <HStack className="flex-row justify-between items-center mb-4">
          <HStack className="flex-row items-center gap-2">
            <Icon as={Calendar} size="lg" className="text-brand-500" />
            <Text className="text-lg font-semibold text-gray-900">
              Appointments
            </Text>
          </HStack>
          <Pressable
            onPress={() =>
              router.push(
                "/(authenticated)/service-provider/(tabs)/appointments"
              )
            }
            className="flex-row items-center gap-1"
          >
            <Text className="text-brand-500 font-inter-medium text-sm">
              View All
            </Text>
            <Icon as={ChevronRight} size="sm" className="text-brand-500" />
          </Pressable>
        </HStack>

        {/* Appointments List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack className="gap-4">
            {/* Ongoing Appointments */}
            <Box className="mb-4">
              <Box className="bg-white py-2 mb-2">
                <Text className="font-inter-medium text-base text-gray-700">
                  Ongoing ({ongoingAppointments.length})
                </Text>
              </Box>
              {ongoingAppointments.length > 0 ? (
                <VStack className="gap-3">
                  {ongoingAppointments.slice(0, 5).map((request) => {
                    return (
                      <AppointmentItem
                        key={request.serviceRequest.id}
                        id={request.serviceRequest.id}
                        date={request.serviceRequest.scheduledDate}
                        time={request.serviceRequest.timeRange.split("-")[0]}
                        client={`${request.customer.firstName} ${request.customer.lastName}`}
                        service={request.serviceRequest.serviceName}
                        status={request.serviceRequest.status}
                        onPress={() =>
                          router.push(
                            `/service-provider/appointments/${request.serviceRequest.id}`
                          )
                        }
                      />
                    );
                  })}
                </VStack>
              ) : (
                <Box className="bg-gray-50 p-4 rounded-xl items-center">
                  <Text className="text-gray-500 text-center text-sm">
                    No ongoing appointments
                  </Text>
                </Box>
              )}
            </Box>

            {/* Upcoming Appointments */}
            <Box className="mb-4">
              <Box className="bg-white py-2 mb-2">
                <Text className="font-inter-medium text-base text-gray-700">
                  Upcoming ({upcomingAppointments.length})
                </Text>
              </Box>
              {upcomingAppointments.length > 0 ? (
                <VStack className="gap-3">
                  {upcomingAppointments.slice(0, 5).map((request) => {
                    return (
                      <AppointmentItem
                        key={request.serviceRequest.id}
                        id={request.serviceRequest.id}
                        date={request.serviceRequest.scheduledDate}
                        time={request.serviceRequest.timeRange.split("-")[0]}
                        client={`${request.customer.firstName} ${request.customer.lastName}`}
                        service={request.serviceRequest.serviceName}
                        status={request.serviceRequest.status}
                        onPress={() =>
                          router.push(
                            `/service-provider/appointments/${request.serviceRequest.id}`
                          )
                        }
                      />
                    );
                  })}
                </VStack>
              ) : (
                <Box className="bg-gray-50 p-4 rounded-xl items-center">
                  <Text className="text-gray-500 text-center text-sm">
                    No upcoming appointments
                  </Text>
                </Box>
              )}
            </Box>
          </VStack>
        </ScrollView>
      </Box>
    </FixedScreen>
  );
}
