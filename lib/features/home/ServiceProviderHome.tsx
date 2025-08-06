import AppointmentItem from "@/lib/components/AppointmentItem";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Bell, Info } from "lucide-react-native";
import React from "react";

export default function ServiceProviderHome() {
  const { user } = useAuthStore();
  const hasNotification = true;

  return (
    <ScrollableScreen addTopInset={true} addBottomInset={false}>
      <Box className="mb-4">
        {/* Header */}
        <HStack className="flex-row justify-between items-center">
          <VStack>
            <Text className="text-2xl font-inter-bold mt-8 mb-6 text-left">
              Welcome back, {user?.firstName}!
            </Text>
            <Text className="text-gray-600">
              Service Provider Dashboard
            </Text>
          </VStack>
          <HStack className="flex-row gap-3">
            <Pressable>
              <Box className="relative">
                <Box className="bg-[#e3e5f4] p-2.5 rounded-xl">
                  <Icon className="" as={Bell} />
                </Box>

                {hasNotification && (
                  <Box className="absolute top-2 right-2 w-2 h-2 bg-red-500" />
                )}
              </Box>
            </Pressable>
            <Pressable>
              <Box className="bg-[#e3e5f4] p-2.5 rounded-xl">
                <Icon className="" as={Info} />
              </Box>
            </Pressable>
          </HStack>
        </HStack>

        {/* Quick Stats */}
        <Box className="bg-gray-50 rounded-xl p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Today&apos;s Overview
          </Text>
          <VStack className="space-y-3">
            <Box className="flex-row justify-between">
              <Text className="text-gray-600">Pending Jobs</Text>
              <Text className="font-semibold text-gray-900">5</Text>
            </Box>
            <Box className="flex-row justify-between">
              <Text className="text-gray-600">Completed Today</Text>
              <Text className="font-semibold text-gray-900">3</Text>
            </Box>
            <Box className="flex-row justify-between">
              <Text className="text-gray-600">Earnings Today</Text>
              <Text className="font-semibold text-green-600">$120</Text>
            </Box>
          </VStack>
        </Box>



        {/* Upcoming Appointments */}
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Upcoming Appointments
        </Text>
        <VStack className="space-y-3">
          {[
            {
              id: 1,
              date: "Today",
              time: "14:00",
              client: "Mrs. Johnson",
              service: "Deep Cleaning",
              status: "upcoming" as const
            },
            {
              id: 2,
              date: "Tomorrow",
              time: "10:00",
              client: "Mr. Smith",
              service: "Standard Cleaning",
              status: "upcoming" as const
            },
            {
              id: 3,
              date: "Dec 15",
              time: "13:30",
              client: "Ms. Davis",
              service: "Move-in Cleaning",
              status: "upcoming" as const
            },
          ].map((appointment) => (
            <AppointmentItem
              key={appointment.id}
              id={appointment.id}
              date={appointment.date}
              time={appointment.time}
              client={appointment.client}
              service={appointment.service}
              status={appointment.status}
            />
          ))}
        </VStack>
      </Box>
    </ScrollableScreen>
  );
} 