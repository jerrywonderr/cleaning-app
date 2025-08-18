import {
  DangerOutlineButton,
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  useAppointment,
  useMarkAppointmentCompleted,
  useUpdateAppointment,
} from "@/lib/hooks/useAppointments";
import { useUserProfile } from "@/lib/hooks/useOffers";
import { formatNaira } from "@/lib/utils/formatNaira";
import {
  handleCallProvider,
  handleMessageProvider,
} from "@/lib/utils/providerContact";
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  CheckCircle,
  Clock,
  Clock as ClockIcon,
  CreditCard,
  FileText,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  User,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, TextInput } from "react-native";

export default function CustomerAppointmentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId: string }>();
  const appointmentId = params.appointmentId as string;

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  // Fetch appointment data
  const { data: appointment, isLoading, error } = useAppointment(appointmentId);

  // Fetch service provider details
  const { data: providerProfile } = useUserProfile(
    appointment?.serviceProviderId || ""
  );

  // Mutations
  const updateAppointmentMutation = useUpdateAppointment();
  const markCompletedMutation = useMarkAppointmentCompleted();

  const handleStatusUpdate = async (newStatus: string) => {
    if (!appointment) return;

    try {
      await updateAppointmentMutation.mutateAsync({
        appointmentId: appointment.id,
        data: { status: newStatus as any },
      });

      Alert.alert("Success", "Appointment status updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", `Failed to update status: ${error.message}`);
    }
  };

  const handleMarkCompleted = async () => {
    if (!appointment) return;

    try {
      await markCompletedMutation.mutateAsync({
        appointmentId: appointment.id,
        rating,
        review: review.trim() || undefined,
      });

      setShowCompletionModal(false);
      Alert.alert("Success", "Appointment marked as completed!");
    } catch (error: any) {
      Alert.alert("Error", `Failed to mark as completed: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const canMarkCompleted = appointment?.status === "in-progress";
  const canCancel = ["pending", "confirmed"].includes(
    appointment?.status || ""
  );

  // Show loading state
  if (isLoading) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading appointment details...</Text>
        </Box>
      </FixedScreen>
    );
  }

  // Show error state
  if (error || !appointment) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text className="text-red-500">
            Failed to load appointment details
          </Text>
          <PrimaryButton onPress={() => router.back()} className="mt-4">
            Go Back
          </PrimaryButton>
        </Box>
      </FixedScreen>
    );
  }

  return (
    <FootedScrollableScreen
      addTopInset={false}
      addBottomInset={true}
      contentContainerClassName="px-0"
      footer={
        <VStack className="gap-3">
          {/* Status-specific actions */}
          {canMarkCompleted && (
            <PrimaryButton
              onPress={() => setShowCompletionModal(true)}
              icon={CheckCircle}
            >
              Mark as Completed
            </PrimaryButton>
          )}

          {canCancel && (
            <DangerOutlineButton
              onPress={() => handleStatusUpdate("cancelled")}
              icon={XCircle}
            >
              Cancel Appointment
            </DangerOutlineButton>
          )}

          {/* Contact provider */}
          <HStack className="gap-3">
            <Box className="flex-1">
              <PrimaryOutlineButton
                onPress={() => {
                  handleCallProvider(
                    providerProfile?.phone ?? "",
                    providerProfile?.firstName
                  );
                }}
                icon={Phone}
              >
                Call
              </PrimaryOutlineButton>
            </Box>
            <Box className="flex-1">
              <PrimaryOutlineButton
                onPress={() =>
                  handleMessageProvider(
                    providerProfile?.phone ?? "",
                    providerProfile?.firstName
                  )
                }
                icon={MessageCircle}
              >
                Message
              </PrimaryOutlineButton>
            </Box>
          </HStack>
        </VStack>
      }
    >
      <ScrollView
        className="flex-1 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6"
      >
        {/* Header */}
        <VStack className="gap-2 px-4">
          <HStack className="items-center justify-between">
            <Text className="text-2xl font-inter-bold text-gray-900">
              {appointment.serviceType
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>
            <Box
              className={`px-3 py-1 rounded-full ${getStatusColor(
                appointment.status
              )}`}
            >
              <Text className="text-sm font-medium">
                {getStatusText(appointment.status)}
              </Text>
            </Box>
          </HStack>
          <Text className="text-xl font-inter-semibold text-brand-500">
            {formatNaira(appointment.price)}
          </Text>
        </VStack>

        {/* Section: Service Details */}
        <Section title="Service Details">
          <InfoRow
            icon={Calendar}
            text={format(appointment.scheduledDate, "EEEE, MMMM d, yyyy")}
          />
          <InfoRow
            icon={Clock}
            text={format(appointment.scheduledTime, "h:mm a")}
          />
          <InfoRow
            icon={ClockIcon}
            text={`Duration: ${appointment.duration} hour${
              appointment.duration !== 1 ? "s" : ""
            }`}
          />
          <InfoRow icon={MapPin} text={appointment.address} />
        </Section>

        {/* Section: Customer */}
        <Section title="Customer Details">
          <InfoRow
            icon={User}
            text={
              providerProfile
                ? `${providerProfile.firstName} ${providerProfile.lastName}`
                : "Service Provider"
            }
          />
          {providerProfile?.phone && (
            <InfoRow icon={Phone} text={providerProfile.phone} />
          )}
        </Section>

        {/* Section: Payment */}
        <Section title="Payment">
          <HStack className="items-center justify-between">
            <InfoRow icon={CreditCard} text="Payment Status" />
            <Box
              className={`px-3 py-1 rounded-full ${
                appointment.isPaid
                  ? "text-green-600 bg-green-100"
                  : "text-yellow-600 bg-yellow-100"
              }`}
            >
              <Text className="text-sm font-medium">
                {appointment.isPaid ? "Paid" : "Pending"}
              </Text>
            </Box>
          </HStack>
          <InfoRow
            icon={FileText}
            text={`Amount: ${formatNaira(appointment.price)}`}
          />
        </Section>

        {/* Notes */}
        {appointment.notes && (
          <Section title="Special Instructions">
            <Text className="text-base text-gray-700">{appointment.notes}</Text>
          </Section>
        )}

        {/* Customer Review */}
        {appointment.customerRating && (
          <Section title="Customer Review">
            <HStack className="items-center gap-2">
              <Icon as={Star} className="text-yellow-400" size="sm" />
              <Text className="text-base text-gray-700">
                {appointment.customerRating}/5 stars
              </Text>
            </HStack>
            {appointment.customerReview && (
              <Text className="text-base text-gray-700 italic">
                “{appointment.customerReview}”
              </Text>
            )}
          </Section>
        )}
      </ScrollView>
      <Modal
        visible={showCompletionModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <Box className="flex-1 bg-white p-6">
          <VStack className="space-y-6">
            <Text className="text-2xl font-bold text-center">
              Rate Your Experience
            </Text>

            <VStack className="space-y-4">
              <Text className="text-lg font-medium">
                How would you rate this service?
              </Text>

              {/* Star Rating */}
              <HStack className="justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    onPress={() => setRating(star)}
                    className="p-2"
                  >
                    <Icon
                      as={Star}
                      size="xl"
                      className={
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  </Pressable>
                ))}
              </HStack>

              <Text className="text-center text-gray-600">
                {rating} star{rating !== 1 ? "s" : ""}
              </Text>

              {/* Review Text */}
              <VStack className="space-y-2">
                <Text className="text-base font-medium">
                  Additional comments (optional)
                </Text>
                <TextInput
                  value={review}
                  onChangeText={setReview}
                  placeholder="Tell us about your experience..."
                  multiline
                  numberOfLines={4}
                  className="border border-gray-300 rounded-lg p-3 text-base"
                  textAlignVertical="top"
                />
              </VStack>
            </VStack>

            {/* Action Buttons */}
            <VStack className="space-y-3">
              <PrimaryButton
                onPress={handleMarkCompleted}
                disabled={markCompletedMutation.isPending}
              >
                {markCompletedMutation.isPending
                  ? "Submitting..."
                  : "Submit Review"}
              </PrimaryButton>

              <PrimaryOutlineButton
                onPress={() => setShowCompletionModal(false)}
              >
                Cancel
              </PrimaryOutlineButton>
            </VStack>
          </VStack>
        </Box>
      </Modal>
    </FootedScrollableScreen>
  );
}

/* --- Small UI Helpers --- */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <VStack className="gap-3 bg-white p-4 rounded-xl shadow-sm mx-4">
      <Text className="text-lg font-inter-semibold text-gray-900">{title}</Text>
      <VStack className="gap-3">{children}</VStack>
    </VStack>
  );
}

function InfoRow({ icon, text }: { icon: any; text: string }) {
  return (
    <HStack className="items-center gap-3">
      <Icon as={icon} className="text-gray-500" size="sm" />
      <Text className="text-base text-gray-700">{text}</Text>
    </HStack>
  );
}
