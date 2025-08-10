import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import AppointmentItem from "@/lib/features/appointments/AppointmentItem";
import { FlashList } from "@shopify/flash-list";
import { Calendar } from "lucide-react-native";
import { useState } from "react";

const appointments = [
  {
    id: 1,
    date: "24 Oct",
    time: "09:00",
    client: "Mrs/Mrs kay",
    service: "Deep Cleaning",
    status: "upcoming" as const,
  },
  {
    id: 2,
    date: "25 Oct",
    time: "14:30",
    client: "Mr. Johnson",
    service: "Standard Cleaning",
    status: "upcoming" as const,
  },
  {
    id: 3,
    date: "26 Oct",
    time: "11:00",
    client: "Ms. Smith",
    service: "Deep Cleaning",
    status: "upcoming" as const,
  },
  {
    id: 4,
    date: "27 Oct",
    time: "16:00",
    client: "Dr. Williams",
    service: "Move-in Cleaning",
    status: "upcoming" as const,
  },
  {
    id: 5,
    date: "28 Oct",
    time: "10:30",
    client: "Mrs. Davis",
    service: "Standard Cleaning",
    status: "upcoming" as const,
  },
  {
    id: 6,
    date: "20 Oct",
    time: "09:00",
    client: "Mr. Brown",
    service: "Deep Cleaning",
    status: "delivered" as const,
  },
  {
    id: 7,
    date: "19 Oct",
    time: "14:00",
    client: "Ms. Wilson",
    service: "Standard Cleaning",
    status: "delivered" as const,
  },
  {
    id: 8,
    date: "18 Oct",
    time: "11:30",
    client: "Mrs. Taylor",
    service: "Move-out Cleaning",
    status: "delivered" as const,
  },
  {
    id: 9,
    date: "18 Oct",
    time: "11:30",
    client: "Mrs. Taylor",
    service: "Move-out Cleaning",
    status: "delivered" as const,
  },
  {
    id: 10,
    date: "18 Oct",
    time: "11:30",
    client: "Mrs. Taylor",
    service: "Move-out Cleaning",
    status: "delivered" as const,
  },
  {
    id: 11,
    date: "18 Oct",
    time: "11:30",
    client: "Mrs. Taylor",
    service: "Move-out Cleaning",
    status: "delivered" as const,
  },
  {
    id: 12,
    date: "18 Oct",
    time: "11:30",
    client: "Mrs. Taylor",
    service: "Move-out Cleaning",
    status: "delivered" as const,
  },
  {
    id: 13,
    date: "24 Oct",
    time: "09:00",
    client: "Mrs/Mrs kay",
    service: "Deep Cleaning",
    status: "upcoming" as const,
  },
  {
    id: 14,
    date: "25 Oct",
    time: "14:30",
    client: "Mr. Johnson",
    service: "Standard Cleaning",
    status: "upcoming" as const,
  },
  {
    id: 15,
    date: "26 Oct",
    time: "11:00",
    client: "Ms. Smith",
    service: "Deep Cleaning",
    status: "upcoming" as const,
  },
  {
    id: 16,
    date: "27 Oct",
    time: "16:00",
    client: "Dr. Williams",
    service: "Move-in Cleaning",
    status: "upcoming" as const,
  },
];

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "delivered">(
    "upcoming"
  );

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  return (
    <Box className="flex-1 bg-gray-50">
      {/* Header */}
      <Box className="bg-white px-6 py-4 border-b border-gray-100">
        <Text className="text-gray-500">Manage your cleaning schedules</Text>
      </Box>

      {/* Tab Navigation */}
      <Box className="bg-white border-b border-gray-100">
        <Box className="flex-row mx-6">
          <Pressable
            className={`flex-1 py-4 ${
              activeTab === "upcoming" ? "border-b-2 border-brand-500" : ""
            }`}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              className={`text-center font-semibold text-base ${
                activeTab === "upcoming" ? "text-brand-500" : "text-gray-500"
              }`}
            >
              Upcoming
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 py-4 ${
              activeTab === "delivered" ? "border-b-2 border-brand-500" : ""
            }`}
            onPress={() => setActiveTab("delivered")}
          >
            <Text
              className={`text-center font-semibold text-base ${
                activeTab === "delivered" ? "text-brand-500" : "text-gray-500"
              }`}
            >
              Delivered
            </Text>
          </Pressable>
        </Box>
      </Box>

      {/* Appointments List */}
      <Box className="flex-1 px-6 pt-6">
        {filteredAppointments.length > 0 && (
          <Text className="text-sm text-gray-500 mb-4 font-medium">
            {filteredAppointments.length} {activeTab} appointment
            {filteredAppointments.length !== 1 ? "s" : ""}
          </Text>
        )}

        {filteredAppointments.length > 0 ? (
          <FlashList
            data={filteredAppointments}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={100}
            renderItem={({ item }) => (
              <AppointmentItem
                id={item.id}
                date={item.date}
                time={item.time}
                client={item.client}
                service={item.service}
                status={item.status}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Box className="flex-1 items-center justify-center py-12">
            <Icon as={Calendar} size="xl" className="text-gray-300 mb-4" />
            <Text className="text-gray-500 text-center text-lg font-medium mb-2">
              No {activeTab} appointments
            </Text>
            <Text className="text-gray-400 text-center">
              {activeTab === "upcoming"
                ? "You don't have any upcoming appointments scheduled."
                : "No completed appointments yet."}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
