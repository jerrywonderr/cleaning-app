import {
  DangerOutlineButton,
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import ScreenHeader from "@/lib/components/ScreenHeader";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/lib/components/ui/menu";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  useAppointment,
  useUpdateAppointment,
} from "@/lib/hooks/useAppointments";
import { useUserProfile } from "@/lib/hooks/useOffers";
import { formatNaira } from "@/lib/utils/formatNaira";
import {
  handleCallProvider,
  handleMessageProvider,
} from "@/lib/utils/providerContact";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Clock as ClockIcon,
  CreditCard,
  FileText,
  MapPin,
  MessageCircle,
  MoreVertical,
  Phone,
  Star,
  User,
} from "lucide-react-native";
import { Alert, ScrollView } from "react-native";

export default function ProviderAppointmentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId: string }>();
  const appointmentId = params.appointmentId as string;

  // Fetch appointment data
  const { data: appointment, isLoading, error } = useAppointment(appointmentId);
  const { data: customerProfile } = useUserProfile(
    appointment?.customerId || ""
  );

  const updateAppointmentMutation = useUpdateAppointment();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "in-progress":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-green-700 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "no-show":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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

  const handleViewCustomerInfo = () => {
    if (!customerProfile) return;
    Alert.alert(
      "Provider Info",
      `Provider: ${customerProfile.firstName} ${customerProfile.lastName}\nThis feature will be implemented soon.`,
      [{ text: "OK" }]
    );
  };

  const canConfirm = appointment?.status === "pending";
  const canStart = appointment?.status === "confirmed";
  const canMarkNoShow = ["pending", "confirmed"].includes(
    appointment?.status || ""
  );

  if (isLoading) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading appointment details...</Text>
        </Box>
      </FixedScreen>
    );
  }

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
          {canConfirm && (
            <PrimaryButton
              onPress={() => handleStatusUpdate("confirmed")}
              icon={CheckCircle}
            >
              Confirm Appointment
            </PrimaryButton>
          )}

          {canStart && (
            <PrimaryButton
              onPress={() => handleStatusUpdate("in-progress")}
              icon={ClockIcon}
            >
              Start Service
            </PrimaryButton>
          )}

          <HStack className="gap-3">
            <PrimaryOutlineButton
              onPress={() =>
                handleCallProvider(
                  customerProfile?.phone ?? "",
                  customerProfile?.firstName
                )
              }
              icon={Phone}
            />

            <Box className="flex-1">
              {canMarkNoShow && (
                <DangerOutlineButton
                  onPress={() => handleStatusUpdate("no-show")}
                  icon={AlertCircle}
                >
                  Mark as No Show
                </DangerOutlineButton>
              )}
            </Box>

            <PrimaryOutlineButton
              onPress={() =>
                handleMessageProvider(
                  customerProfile?.phone ?? "",
                  customerProfile?.firstName
                )
              }
              icon={MessageCircle}
            />
          </HStack>
        </VStack>
      }
    >
      <Stack.Screen
        options={{
          title: "Appointment Details",
          header: ({ navigation }) => (
            <ScreenHeader
              navigation={navigation}
              title="Appointment Details"
              rightContent={
                <Menu
                  trigger={({ ...triggerProps }) => (
                    <Button
                      {...triggerProps}
                      variant="outline"
                      size="sm"
                      className="bg-gray-100 border-gray-300 p-2 rounded-full"
                    >
                      <Icon
                        as={MoreVertical}
                        className="text-gray-700"
                        size="xl"
                      />
                    </Button>
                  )}
                  placement="bottom left"
                >
                  <MenuItem
                    key="ViewCustomerrInfo"
                    textValue="View Customer Info"
                    onPress={handleViewCustomerInfo}
                  >
                    <Icon as={User} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Customer Profile</MenuItemLabel>
                  </MenuItem>

                  {/* <MenuItem
                    key="AddReview"
                    textValue="Add Review"
                    // onPress={handleAddReview}
                  >
                    <Icon as={Star} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Add Review</MenuItemLabel>
                  </MenuItem> */}
                </Menu>
              }
            />
          ),
        }}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4 mx-4 py-6"
      >
        {/* Header */}
        <VStack className="gap-2">
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
              customerProfile
                ? `${customerProfile.firstName} ${customerProfile.lastName}`
                : "Customer"
            }
          />
          {customerProfile?.phone && (
            <InfoRow icon={Phone} text={customerProfile.phone} />
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

        {/* Timeline */}
        <Section title="Timeline">
          <TimelineItem label="Created" date={appointment.createdAt} />
          {appointment.confirmedAt && (
            <TimelineItem label="Confirmed" date={appointment.confirmedAt} />
          )}
          {appointment.startedAt && (
            <TimelineItem label="Started" date={appointment.startedAt} />
          )}
          {appointment.completedAt && (
            <TimelineItem label="Completed" date={appointment.completedAt} />
          )}
        </Section>
      </ScrollView>
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
    <VStack className="gap-3 bg-white p-4 rounded-xl shadow-sm">
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

function TimelineItem({ label, date }: { label: string; date: Date }) {
  return (
    <HStack className="items-center justify-between">
      <Text className="text-sm text-gray-600">{label}</Text>
      <Text className="text-sm text-gray-900">
        {format(date, "MMM d, yyyy 'at' h:mm a")}
      </Text>
    </HStack>
  );
}
