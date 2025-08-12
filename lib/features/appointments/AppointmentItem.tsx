import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { Calendar, ChevronRight, Clock, User } from "lucide-react-native";
import React from "react";

interface AppointmentItemProps {
  id: number;
  date: string;
  time: string;
  client: string;
  service: string;
  status: "upcoming" | "delivered" | "completed" | "cancelled";
  onPress?: () => void;
  className?: string;
}

export default function AppointmentItem({
  id,
  date,
  time,
  client,
  service,
  status,
  onPress,
  className = "",
}: AppointmentItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      <Box className="flex-row items-start justify-between p-4">
        {/* Left side - Client & Service */}
        <Box className="flex-1 mr-4">
          <Box className="flex-row items-center mb-1">
            <Icon as={User} size="sm" className="text-gray-400 mr-2" />
            <Text className="text-base font-semibold text-gray-900">
              {client}
            </Text>
          </Box>
          <Text className="text-sm text-gray-600 ml-6">{service}</Text>
        </Box>

        {/* Right side - Date & Time */}
        <Box className="items-end">
          <Box className="flex-row items-center mb-1">
            <Icon as={Calendar} size="sm" className="text-gray-400 mr-1" />
            <Text className="text-sm font-medium text-gray-900">{date}</Text>
          </Box>
          <Box className="flex-row items-center mb-2">
            <Icon as={Clock} size="sm" className="text-gray-400 mr-1" />
            <Text className="text-sm text-gray-600">{time}</Text>
          </Box>
          <Icon as={ChevronRight} size="sm" className="text-gray-300" />
        </Box>
      </Box>
    </Pressable>
  );
}
