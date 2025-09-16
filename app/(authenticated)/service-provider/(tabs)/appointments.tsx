import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import AppointmentItem from "@/lib/features/appointments/AppointmentItem";
import { useUserType } from "@/lib/hooks/useAuth";
import { useProviderServiceRequests } from "@/lib/hooks/useServiceRequests";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl } from "react-native";

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<
    "scheduled" | "active" | "completed" | "cancelled"
  >("scheduled");
  const router = useRouter();
  const { profile } = useUserType();

  // Fetch service requests (confirmed appointments) for this provider
  const {
    data: serviceRequests = [],
    refetch,
    isRefetching,
  } = useProviderServiceRequests(profile?.id || "");

  console.log(serviceRequests.map((request) => request.serviceRequest.status));

  // Filter service requests based on tab
  const filteredAppointments = serviceRequests.filter((request) => {
    const status = request.serviceRequest.status;
    if (activeTab === "scheduled") {
      return status === "confirmed";
    } else if (activeTab === "active") {
      return status === "in-progress";
    } else if (activeTab === "completed") {
      return status === "completed";
    } else if (activeTab === "cancelled") {
      return status === "cancelled" || status === "no-show";
    }
    return false;
  });

  const handleRefresh = () => {
    refetch();
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "scheduled":
        return "Scheduled";
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return tab;
    }
  };

  const getEmptyStateMessage = (tab: string) => {
    switch (tab) {
      case "scheduled":
        return "No confirmed bookings scheduled.";
      case "active":
        return "No services currently in progress.";
      case "completed":
        return "No completed services yet.";
      case "cancelled":
        return "No cancelled appointments.";
      default:
        return "No appointments found.";
    }
  };

  const getEmptyStateSubtitle = (tab: string) => {
    switch (tab) {
      case "scheduled":
        return "Confirmed bookings will appear here once customers pay.";
      case "active":
        return "Active services will appear here once you start them.";
      case "completed":
        return "Your completed services will appear here.";
      case "cancelled":
        return "Cancelled appointments will appear here.";
      default:
        return "";
    }
  };

  return (
    <FixedScreen addTopInset={false}>
      {/* Header */}
      <Box className="bg-white px-2 py-4 border-b border-gray-100">
        <Text className="text-gray-500">Manage your confirmed bookings</Text>
      </Box>

      {/* Tab Navigation */}
      <Box className="bg-white border-b border-gray-100">
        <Box className="flex-row mx-6">
          {(["scheduled", "active", "completed", "cancelled"] as const).map(
            (tab) => (
              <Pressable
                key={tab}
                className={`flex-1 py-4 ${
                  activeTab === tab ? "border-b-2 border-brand-500" : ""
                }`}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`text-center font-semibold text-base ${
                    activeTab === tab ? "text-brand-500" : "text-gray-500"
                  }`}
                >
                  {getTabTitle(tab)}
                </Text>
              </Pressable>
            )
          )}
        </Box>
      </Box>

      {/* Appointments List */}
      <Box className="flex-1 pt-6">
        {filteredAppointments.length > 0 && (
          <Text className="text-sm text-gray-500 mb-4 font-medium px-6">
            {filteredAppointments.length} {getTabTitle(activeTab).toLowerCase()}{" "}
            appointment{filteredAppointments.length !== 1 ? "s" : ""}
          </Text>
        )}

        {filteredAppointments.length > 0 ? (
          <FlashList
            data={filteredAppointments}
            keyExtractor={(item) => item.serviceRequest.id}
            estimatedItemSize={100}
            renderItem={({ item: { serviceRequest, customer } }) => {
              return (
                <AppointmentItem
                  id={serviceRequest.id}
                  date={serviceRequest.scheduledDate}
                  time={serviceRequest.timeRange}
                  client={`${customer.firstName} ${customer.lastName}`}
                  service={serviceRequest.serviceName}
                  status={
                    serviceRequest.status === "confirmed"
                      ? "confirmed"
                      : serviceRequest.status === "in-progress"
                      ? "in-progress"
                      : serviceRequest.status === "completed"
                      ? "completed"
                      : serviceRequest.status === "cancelled"
                      ? "cancelled"
                      : serviceRequest.status === "no-show"
                      ? "no-show"
                      : "pending"
                  }
                  onPress={() =>
                    router.push(
                      `/service-provider/appointments/${serviceRequest.id}`
                    )
                  }
                  showTimeDifference={activeTab === "scheduled"}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <Box className="h-4" />}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor="#6366f1"
              />
            }
          />
        ) : (
          <Box className="flex-1 items-center justify-center py-12 px-6">
            <Icon as={Calendar} size="xl" className="text-gray-300 mb-4" />
            <Text className="text-gray-500 text-center text-lg font-medium mb-2">
              No {getTabTitle(activeTab).toLowerCase()} appointments
            </Text>
            <Text className="text-gray-400 text-center">
              {getEmptyStateMessage(activeTab)}
            </Text>
            {getEmptyStateSubtitle(activeTab) && (
              <Text className="text-gray-400 text-center mt-2">
                {getEmptyStateSubtitle(activeTab)}
              </Text>
            )}
          </Box>
        )}
      </Box>
    </FixedScreen>
  );
}
