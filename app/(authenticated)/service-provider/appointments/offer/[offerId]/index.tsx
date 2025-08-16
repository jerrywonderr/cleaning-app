import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useAppointmentsByOffer } from "@/lib/hooks/useAppointments";
import { useOffer } from "@/lib/hooks/useOffers";
import { Appointment, AppointmentStatus } from "@/lib/types/appointment";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Clock as ClockIcon,
  MapPin,
  User,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";

export default function OfferAppointmentsScreen() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch offer details
  const { data: offer, isLoading: offerLoading } = useOffer(offerId as string);

  // Fetch all appointments for this offer
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    refetch,
  } = useAppointmentsByOffer(offerId as string);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return <Icon as={ClockIcon} size="sm" className="text-yellow-500" />;
      case "confirmed":
        return <Icon as={CheckCircle} size="sm" className="text-blue-500" />;
      case "in-progress":
        return <Icon as={ClockIcon} size="sm" className="text-green-500" />;
      case "completed":
        return <Icon as={CheckCircle} size="sm" className="text-green-600" />;
      case "cancelled":
        return <Icon as={XCircle} size="sm" className="text-red-500" />;
      case "no-show":
        return <Icon as={AlertCircle} size="sm" className="text-red-600" />;
      default:
        return <Icon as={ClockIcon} size="sm" className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "confirmed":
        return "text-blue-600 bg-blue-50";
      case "in-progress":
        return "text-green-600 bg-green-50";
      case "completed":
        return "text-green-700 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      case "no-show":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case "pending":
        return "Pending Confirmation";
      case "confirmed":
        return "Confirmed";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "no-show":
        return "No Show";
      default:
        return status;
    }
  };

  const getStatusCount = (status: AppointmentStatus) => {
    return appointments.filter(
      (appointment: Appointment) => appointment.status === status
    ).length;
  };

  // Show loading state
  if (offerLoading || appointmentsLoading) {
    return (
      <FixedScreen addTopInset={false}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading appointments...</Text>
        </Box>
      </FixedScreen>
    );
  }

  // Show error state if no offer
  if (!offer) {
    return (
      <FixedScreen addTopInset={false}>
        <Box className="flex-1 items-center justify-center">
          <Text className="text-red-500">Offer not found</Text>
        </Box>
      </FixedScreen>
    );
  }

  return (
    <FixedScreen addTopInset={false}>
      {/* Header */}
      <Box className="bg-white px-6 py-4 border-b border-gray-100">
        <VStack className="space-y-2">
          <Text className="text-xl font-inter-bold text-gray-900">
            {offer.title}
          </Text>
          <Text className="text-base text-gray-600">
            All appointments for this service
          </Text>
        </VStack>
      </Box>

      {/* Status Summary */}
      <Box className="bg-white px-6 py-4 border-b border-gray-100">
        <HStack className="justify-between">
          <VStack className="items-center">
            <Text className="text-2xl font-inter-bold text-yellow-600">
              {getStatusCount("pending")}
            </Text>
            <Text className="text-sm text-gray-600">Pending</Text>
          </VStack>
          <VStack className="items-center">
            <Text className="text-2xl font-inter-bold text-blue-600">
              {getStatusCount("confirmed")}
            </Text>
            <Text className="text-sm text-gray-600">Confirmed</Text>
          </VStack>
          <VStack className="items-center">
            <Text className="text-2xl font-inter-bold text-green-600">
              {getStatusCount("in-progress")}
            </Text>
            <Text className="text-sm text-gray-600">In Progress</Text>
          </VStack>
          <VStack className="items-center">
            <Text className="text-2xl font-inter-bold text-green-700">
              {getStatusCount("completed")}
            </Text>
            <Text className="text-sm text-gray-600">Completed</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Appointments List */}
      <Box className="flex-1 pt-6">
        {appointments.length > 0 ? (
          <>
            <Text className="text-sm text-gray-500 mb-4 font-medium px-6">
              {appointments.length} appointment
              {appointments.length !== 1 ? "s" : ""} total
            </Text>

            <FlatList
              data={appointments}
              keyExtractor={(item: Appointment) => item.id}
              renderItem={({ item }: { item: Appointment }) => (
                <Box className="mx-6 mb-4">
                  <Box className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    {/* Header with Status */}
                    <Box className="flex-row items-center justify-between mb-3">
                      <HStack className="items-center gap-2">
                        {getStatusIcon(item.status)}
                        <Box
                          className={`px-2 py-1 rounded-full ${getStatusColor(
                            item.status
                          )}`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              getStatusColor(item.status).split(" ")[0]
                            }`}
                          >
                            {getStatusText(item.status)}
                          </Text>
                        </Box>
                      </HStack>
                      <Text className="text-sm text-gray-500">
                        {format(item.scheduledDate, "MMM d, yyyy")}
                      </Text>
                    </Box>

                    {/* Appointment Details */}
                    <VStack className="space-y-2">
                      <HStack className="items-center gap-3">
                        <Icon
                          as={Calendar}
                          className="text-gray-400"
                          size="sm"
                        />
                        <Text className="text-sm text-gray-700">
                          {format(item.scheduledDate, "EEEE, MMMM d, yyyy")}
                        </Text>
                      </HStack>

                      <HStack className="items-center gap-3">
                        <Icon as={Clock} className="text-gray-400" size="sm" />
                        <Text className="text-sm text-gray-700">
                          {format(item.scheduledTime, "h:mm a")}
                        </Text>
                      </HStack>

                      <HStack className="items-center gap-3">
                        <Icon as={MapPin} className="text-gray-400" size="sm" />
                        <Text
                          className="text-sm text-gray-700"
                          numberOfLines={2}
                        >
                          {item.address}
                        </Text>
                      </HStack>

                      <HStack className="items-center gap-3">
                        <Icon as={User} className="text-gray-400" size="sm" />
                        <Text className="text-sm text-gray-700">
                          Customer ID: {item.customerId.substring(0, 8)}...
                        </Text>
                      </HStack>
                    </VStack>

                    {/* Action Button */}
                    <Box className="mt-4 pt-3 border-t border-gray-100">
                      <Box
                        className="bg-brand-50 p-3 rounded-lg items-center"
                        onTouchEnd={() =>
                          router.push(
                            `/service-provider/appointments/${item.id}`
                          )
                        }
                      >
                        <Text className="text-brand-600 font-medium text-center">
                          View Details
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#6366f1"
                />
              }
            />
          </>
        ) : (
          <Box className="flex-1 items-center justify-center py-12 px-6">
            <Icon as={Calendar} size="xl" className="text-gray-300 mb-4" />
            <Text className="text-gray-500 text-center text-lg font-medium mb-2">
              No appointments yet
            </Text>
            <Text className="text-gray-400 text-center">
              This service hasn&apos;t been booked by any customers yet.
            </Text>
          </Box>
        )}
      </Box>
    </FixedScreen>
  );
}
