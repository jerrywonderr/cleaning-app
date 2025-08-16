import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import AppointmentItem from "@/lib/features/appointments/AppointmentItem";
import { useAppointmentsByStatus } from "@/lib/hooks/useAppointments";
import { useUserStore } from "@/lib/store/useUserStore";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl } from "react-native";

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "ongoing" | "past">(
    "upcoming"
  );
  const router = useRouter();
  const { profile } = useUserStore();

  // Fetch appointments based on active tab
  const {
    data: appointments = [],
    isLoading,
    refetch,
    isRefetching,
  } = useAppointmentsByStatus(activeTab, "customer");

  const handleRefresh = () => {
    refetch();
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "upcoming":
        return "Upcoming";
      case "ongoing":
        return "Ongoing";
      case "past":
        return "Past";
      default:
        return tab;
    }
  };

  const getEmptyStateMessage = (tab: string) => {
    switch (tab) {
      case "upcoming":
        return "You don't have any upcoming appointments scheduled.";
      case "ongoing":
        return "No appointments are currently in progress.";
      case "past":
        return "No completed appointments yet.";
      default:
        return "No appointments found.";
    }
  };

  const getEmptyStateSubtitle = (tab: string) => {
    switch (tab) {
      case "upcoming":
        return "Book a cleaning service to get started.";
      case "ongoing":
        return "Your appointments will appear here once they start.";
      case "past":
        return "Your completed appointments will appear here.";
      default:
        return "";
    }
  };

  return (
    <FixedScreen addTopInset={false}>
      {/* Header */}
      <Box className="bg-white px-2 py-4 border-b border-gray-100">
        <Text className="text-gray-500">Manage your cleaning schedules</Text>
      </Box>

      {/* Tab Navigation */}
      <Box className="bg-white border-b border-gray-100">
        <Box className="flex-row mx-6">
          {(["upcoming", "ongoing", "past"] as const).map((tab) => (
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
          ))}
        </Box>
      </Box>

      {/* Appointments List */}
      <Box className="flex-1 pt-6">
        {appointments.length > 0 && (
          <Text className="text-sm text-gray-500 mb-4 font-medium px-6">
            {appointments.length} {getTabTitle(activeTab).toLowerCase()}{" "}
            appointment
            {appointments.length !== 1 ? "s" : ""}
          </Text>
        )}

        {appointments.length > 0 ? (
          <FlashList
            data={appointments}
            keyExtractor={(item) => item.id}
            estimatedItemSize={100}
            renderItem={({ item }) => (
              <AppointmentItem
                id={item.id}
                date={item.scheduledDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
                time={item.scheduledTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
                client={item.serviceType.replace("-", " ")}
                service={item.serviceType}
                status={item.status}
                onPress={() => router.push(`/customer/appointments/${item.id}`)}
              />
            )}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <Box className="h-4" />}
            // contentContainerStyle={{ paddingHorizontal: 6 }}
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
