import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import AppointmentItem from "@/lib/features/appointments/AppointmentItem";
import { useUserType } from "@/lib/hooks/useAuth";
import { useProviderServiceRequests } from "@/lib/hooks/useServiceRequests";
import { useAppStore } from "@/lib/store/useAppStore";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import {
  Bell,
  Calendar,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
} from "lucide-react-native";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";

export default function ServiceProviderHome() {
  const { profile } = useUserType();
  const router = useRouter();

  const hasNotification = true;
  const { balanceVisibile, toggleBalanceVisibility } = useAppStore();

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

  // Map ServiceRequestStatus to AppointmentStatus
  const mapServiceRequestStatusToAppointmentStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "pending";
      case "accepted":
        return "pending"; // Map accepted to pending for display
      case "confirmed":
        return "confirmed";
      case "in-progress":
        return "in-progress";
      case "completed":
        return "completed";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  };

  // Format time using Date constructor and date-fns
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return format(date, "HH:mm");
    } catch (error) {
      console.warn("Failed to parse time string:", timeString, error);
      return timeString;
    }
  };

  const formatNaira = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
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
        {/* Header */}
        <HStack className="flex-row justify-between items-center mb-4 pt-4">
          <Text className="text-xl font-inter-bold">
            Hello, {profile.firstName || "Service Provider"}!
          </Text>
          <HStack className="flex-row gap-3">
            <Pressable>
              <Box className="relative">
                <Box className="bg-[#e3e5f4] p-2.5 rounded-xl">
                  <Icon as={Bell} />
                </Box>
                {hasNotification && (
                  <Box className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Box>
            </Pressable>
            <Pressable>
              <Box className="bg-[#e3e5f4] p-2.5 rounded-xl">
                <Icon as={Info} />
              </Box>
            </Pressable>
          </HStack>
        </HStack>

        {/* Balance Card */}
        <Box className="bg-brand-500 px-6 py-4 mb-6 gap-3 rounded-xl">
          <HStack className="justify-between items-center gap-4 mb-2">
            <HStack className="gap-3">
              <Text className="text-white text-sm font-inter-semibold">
                Available Balance
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleBalanceVisibility}
              >
                <Icon
                  as={balanceVisibile ? EyeOff : Eye}
                  size="lg"
                  className="text-white"
                />
              </TouchableOpacity>
            </HStack>

            <Pressable>
              <HStack className="items-center gap-1">
                <Text className="text-sm font-bold text-white">
                  Transaction History
                </Text>
                <Icon as={ChevronRight} size="sm" className="text-white" />
              </HStack>
            </Pressable>
          </HStack>
          <HStack className="justify-between items-center gap-1 mb-2">
            <Text className="text-2xl font-inter-bold text-white">
              {balanceVisibile ? formatNaira(85000) : "****"}
            </Text>
            <Button className="bg-white rounded-full">
              <ButtonText className="text-brand-500 text-sm">
                Cashout
              </ButtonText>
            </Button>
          </HStack>
        </Box>

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
                    const { serviceRequest, customer } = request;
                    const scheduledDate = new Date(
                      serviceRequest.scheduledDate
                    );
                    const [startTime] = serviceRequest.timeRange.split("-");
                    const formattedTime = formatTime(startTime);

                    return (
                      <AppointmentItem
                        key={serviceRequest.id}
                        id={serviceRequest.id}
                        date={scheduledDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        time={formattedTime}
                        client={`${customer.firstName} ${customer.lastName}`}
                        service={serviceRequest.serviceName}
                        status={mapServiceRequestStatusToAppointmentStatus(
                          serviceRequest.status
                        )}
                        onPress={() =>
                          router.push(
                            `/service-provider/appointments/${serviceRequest.id}`
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
                    const { serviceRequest, customer } = request;
                    const scheduledDate = new Date(
                      serviceRequest.scheduledDate
                    );
                    const [startTime] = serviceRequest.timeRange.split("-");
                    const formattedTime = formatTime(startTime);

                    return (
                      <AppointmentItem
                        key={serviceRequest.id}
                        id={serviceRequest.id}
                        date={scheduledDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        time={formattedTime}
                        client={`${customer.firstName} ${customer.lastName}`}
                        service={serviceRequest.serviceName}
                        status={mapServiceRequestStatusToAppointmentStatus(
                          serviceRequest.status
                        )}
                        onPress={() =>
                          router.push(
                            `/service-provider/appointments/${serviceRequest.id}`
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
