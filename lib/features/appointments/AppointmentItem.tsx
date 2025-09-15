import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { ServiceRequestStatus } from "@/lib/types/service-request";
import { getTimeDifference } from "@/lib/utils/date-helper";
import { cn } from "@/lib/utils/style";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Clock as ClockIcon,
  User,
  XCircle,
} from "lucide-react-native";
import React from "react";

interface AppointmentItemProps {
  id: string;
  date: string;
  time: string;
  client: string;
  service: string;
  status: ServiceRequestStatus;
  onPress?: () => void;
  className?: string;
  // Props for time difference calculation
  // scheduledDate?: string;
  // timeRange?: string;
  showTimeDifference?: boolean;
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
  // scheduledDate,
  // timeRange,
  showTimeDifference = false,
}: AppointmentItemProps) {
  const getStatusIcon = (status: ServiceRequestStatus) => {
    switch (status) {
      case "pending":
        return <Icon as={ClockIcon} size="sm" className="text-yellow-500" />;
      case "accepted":
        return <Icon as={CheckCircle} size="sm" className="text-blue-500" />;
      case "rejected":
        return <Icon as={XCircle} size="sm" className="text-red-500" />;
      case "confirmed":
        return <Icon as={CheckCircle} size="sm" className="text-blue-600" />;
      case "in-progress":
        return <Icon as={ClockIcon} size="sm" className="text-green-500" />;
      case "completed":
        return <Icon as={CheckCircle} size="sm" className="text-green-600" />;
      case "cancelled":
        return <Icon as={XCircle} size="sm" className="text-red-500" />;
      case "expired":
        return <Icon as={AlertCircle} size="sm" className="text-red-600" />;
      default:
        return <Icon as={ClockIcon} size="sm" className="text-gray-400" />;
    }
  };

  const getStatusText = (status: ServiceRequestStatus) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "confirmed":
        return "Confirmed";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  const getStatusColor = (status: ServiceRequestStatus) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "accepted":
        return "text-blue-600 bg-blue-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "confirmed":
        return "text-blue-700 bg-blue-50";
      case "in-progress":
        return "text-green-600 bg-green-50";
      case "completed":
        return "text-green-700 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "expired":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Calculate time difference if needed
  const timeInfo =
    showTimeDifference && date && time ? getTimeDifference(date, time) : null;

  return (
    <Box>
      <Pressable onPress={onPress} className="px-4">
        <Box
          className={cn(
            "flex-row items-start justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4",
            className
          )}
        >
          {/* Left side - Client & Service */}
          <Box className="flex-1 mr-4">
            <Box className="flex-row items-center mb-1">
              <Icon as={User} size="sm" className="text-gray-700 mr-2" />
              <Text className="text-base font-inter-semibold text-gray-900 capitalize">
                {client}
              </Text>
            </Box>
            <Text className="text-sm font-inter-medium text-gray-600 ml-6 capitalize">
              {service.replace("-", " ")}
            </Text>

            {/* Status Badge */}
            <Box className="flex-row items-center mt-2 ml-6">
              {getStatusIcon(status)}
              <Text
                className={`text-xs font-inter-medium px-2 py-1 rounded-full ml-2 ${getStatusColor(
                  status
                )}`}
              >
                {getStatusText(status)}
              </Text>
            </Box>
          </Box>

          {/* Right side - Date & Time */}
          <Box className="items-col items-end justify-between gap-1">
            <Box className="flex-row justify-end items-center gap-2 mb-1">
              <Icon as={Calendar} size="sm" className="text-gray-400 mr-1" />
              <Text className="text-sm font-inter-medium text-gray-700">
                {format(new Date(date), "MMM d, yyyy")}
              </Text>
            </Box>
            <Box className="flex-row justify-end items-center gap-2">
              <Icon as={Clock} size="sm" className="text-gray-400 mr-1" />
              <Text className="text-sm font-inter-medium text-gray-700">
                {time}
              </Text>
            </Box>

            {/* Time difference tag */}
            {timeInfo && (
              <HStack className="items-center gap-1">
                <Icon as={Clock} size="sm" className="text-gray-400 mr-1" />
                <Box className={`px-2 py-1 rounded-full ${timeInfo.color}`}>
                  <Text className="text-xs font-medium">{timeInfo.text}</Text>
                </Box>
              </HStack>
            )}
          </Box>
        </Box>
      </Pressable>
    </Box>
  );
}
