import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import AppointmentItem from "@/lib/features/appointments/AppointmentItem";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Bell, ChevronRight, Eye, EyeOff, Info } from "lucide-react-native";
import React, { useState } from "react";

export default function ServiceProviderHome() {
  const { user } = useAuthStore();
  const hasNotification = true;
  const [showBalance, setShowBalance] = useState(true);

  const formatNaira = (amount: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <ScrollableScreen addTopInset={true} addBottomInset={false}>
      <Box>
        {/* Header */}
        <HStack className="flex-row justify-between items-center mb-4 pt-4">
          <Text className="text-2xl font-inter-bold">
            Welcome back, {user?.firstName}!
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
              <Pressable onPress={() => setShowBalance((prev) => !prev)}>
                <Icon
                  as={showBalance ? EyeOff : Eye}
                  size="lg"
                  className="text-white"
                />
              </Pressable>
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
            <Text className="text-2xl font-bold text-white">
              {showBalance ? formatNaira(85000) : "****"}
            </Text>
            <Button className="bg-white rounded-full">
              <ButtonText className="text-brand-500 text-sm">
                Cashout
              </ButtonText>
            </Button>
          </HStack>
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
              status: "upcoming" as const,
            },
            {
              id: 2,
              date: "Tomorrow",
              time: "10:00",
              client: "Mr. Smith",
              service: "Standard Cleaning",
              status: "upcoming" as const,
            },
            {
              id: 3,
              date: "Dec 15",
              time: "13:30",
              client: "Ms. Davis",
              service: "Move-in Cleaning",
              status: "upcoming" as const,
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
