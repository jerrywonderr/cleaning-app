import {
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
import { useLoader } from "@/lib/components/ui/loader";
import { Menu, MenuItem, MenuItemLabel } from "@/lib/components/ui/menu";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  useServiceRequestWithCustomer,
  useUpdateServiceRequest,
} from "@/lib/hooks/useServiceRequests";
import { formatNaira } from "@/lib/utils/formatNaira";
import {
  handleCallProvider,
  handleMessageProvider,
} from "@/lib/utils/providerContact";
import { format } from "date-fns";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
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
  User,
  XCircle,
} from "lucide-react-native";
import { Alert, ScrollView } from "react-native";

export default function ProviderAppointmentDetailScreen() {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId: string }>();
  const appointmentId = params.appointmentId as string;

  // Fetch service request data
  const {
    data: serviceRequestData,
    isLoading,
    error,
  } = useServiceRequestWithCustomer(appointmentId);

  const updateServiceRequestMutation = useUpdateServiceRequest();

  const handleStatusUpdate = async (newStatus: string) => {
    if (!serviceRequestData) return;

    try {
      showLoader();
      await updateServiceRequestMutation.mutateAsync({
        id: serviceRequestData.serviceRequest.id,
        data: { status: newStatus as any },
      });

      Alert.alert("Success", "Appointment status updated successfully!");
    } catch (error: any) {
      Alert.alert("Error", `Failed to update status: ${error.message}`);
    } finally {
      hideLoader();
    }
  };

  const handleMarkNoShow = async () => {
    if (!serviceRequestData) return;

    try {
      showLoader();
      await updateServiceRequestMutation.mutateAsync({
        id: serviceRequestData.serviceRequest.id,
        data: { status: "no-show", noShowReason: "No show" },
      });

      Alert.alert("Success", "Appointment marked as no show successfully!");
    } catch (error: any) {
      Alert.alert("Error", `Failed to mark as no show: ${error.message}`);
    } finally {
      hideLoader();
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

  const handleViewCustomerInfo = async () => {
    if (!serviceRequestData?.customer) return;

    try {
      showLoader();
      // TODO: Implement customer info view
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      Alert.alert(
        "Customer Info",
        `Customer: ${serviceRequestData.customer.firstName} ${serviceRequestData.customer.lastName}\nThis feature will be implemented soon.`,
        [{ text: "OK" }]
      );
    } catch (error: any) {
      Alert.alert("Error", `Failed to load customer info: ${error.message}`);
    } finally {
      hideLoader();
    }
  };

  const canMarkCompleted =
    serviceRequestData?.serviceRequest.status === "in-progress";
  // const canConfirm = serviceRequestData?.serviceRequest.status === "pending";
  const canStart = serviceRequestData?.serviceRequest.status === "confirmed";
  const canMarkNoShow = ["confirmed"].includes(
    serviceRequestData?.serviceRequest.status || ""
  );
  const isComplete = serviceRequestData?.serviceRequest.status === "completed";
  const isNoShow = serviceRequestData?.serviceRequest.status === "no-show";

  if (isLoading) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading appointment details...</Text>
        </Box>
      </FixedScreen>
    );
  }

  if (error || !serviceRequestData) {
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
        <HStack className="gap-3">
          <Box className="flex-1">
            {canStart && (
              <PrimaryButton
                onPress={() => handleStatusUpdate("in-progress")}
                icon={ClockIcon}
              >
                Start Service
              </PrimaryButton>
            )}

            {canMarkCompleted && (
              <PrimaryButton disabled icon={ClockIcon}>
                Service in Progress
              </PrimaryButton>
            )}

            {isComplete && (
              <PrimaryButton disabled icon={CheckCircle}>
                Service Completed
              </PrimaryButton>
            )}

            {isNoShow && (
              <PrimaryButton disabled icon={XCircle}>
                Service No Show
              </PrimaryButton>
            )}
          </Box>

          <PrimaryOutlineButton
            onPress={() =>
              handleCallProvider(
                serviceRequestData.customer?.phone ?? "",
                serviceRequestData.customer?.firstName
              )
            }
            icon={Phone}
          />

          <PrimaryOutlineButton
            onPress={() =>
              handleMessageProvider(
                serviceRequestData.customer?.phone ?? "",
                serviceRequestData.customer?.firstName
              )
            }
            icon={MessageCircle}
          />
        </HStack>
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

                  {canMarkNoShow && (
                    <MenuItem
                      key="MarkNoShow"
                      textValue="Mark as no show"
                      onPress={handleMarkNoShow}
                    >
                      <Icon
                        as={XCircle}
                        size="sm"
                        className="mr-2 text-gray-600"
                      />
                      <MenuItemLabel>Mark as No Show</MenuItemLabel>
                    </MenuItem>
                  )}

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
              {serviceRequestData.serviceRequest.serviceName}
            </Text>
            <Text className="text-xl font-inter-semibold text-brand-500">
              {formatNaira(serviceRequestData.serviceRequest.totalPrice)}
            </Text>
          </HStack>
          <HStack>
            <Box
              className={`px-3 py-1 rounded-full ${getStatusColor(
                serviceRequestData.serviceRequest.status
              )}`}
            >
              <Text className="text-sm font-medium">
                {getStatusText(serviceRequestData.serviceRequest.status)}
              </Text>
            </Box>
          </HStack>
        </VStack>

        {/* Section: Service Details */}
        <Section title="Service Details">
          <InfoRow
            icon={Calendar}
            text={format(
              new Date(serviceRequestData.serviceRequest.scheduledDate),
              "EEEE, MMMM d, yyyy"
            )}
          />
          <InfoRow
            icon={Clock}
            text={serviceRequestData.serviceRequest.timeRange}
          />
          <InfoRow
            icon={ClockIcon}
            text={`Duration: ${
              serviceRequestData.serviceRequest.duration
            } hour${
              serviceRequestData.serviceRequest.duration !== 1 ? "s" : ""
            }`}
          />
          <InfoRow
            icon={MapPin}
            text={serviceRequestData.serviceRequest.location.fullAddress}
          />
        </Section>

        {/* Section: Customer */}
        <Section title="Customer Details">
          <InfoRow
            icon={User}
            text={`${serviceRequestData.customer.firstName} ${serviceRequestData.customer.lastName}`}
          />
          {serviceRequestData.customer.phone && (
            <InfoRow icon={Phone} text={serviceRequestData.customer.phone} />
          )}
        </Section>

        {/* Section: Payment */}
        <Section title="Payment">
          <HStack className="items-center justify-between">
            <InfoRow icon={CreditCard} text="Payment Status" />
            <Box
              className={`px-3 py-1 rounded-full ${
                serviceRequestData.serviceRequest.status === "confirmed" ||
                serviceRequestData.serviceRequest.status === "in-progress" ||
                serviceRequestData.serviceRequest.status === "completed"
                  ? "text-green-600 bg-green-100"
                  : "text-yellow-600 bg-yellow-100"
              }`}
            >
              <Text className="text-sm font-medium">
                {serviceRequestData.serviceRequest.status === "confirmed" ||
                serviceRequestData.serviceRequest.status === "in-progress" ||
                serviceRequestData.serviceRequest.status === "completed"
                  ? "Paid"
                  : "Pending"}
              </Text>
            </Box>
          </HStack>
          <InfoRow
            icon={FileText}
            text={`Amount: ${formatNaira(
              serviceRequestData.serviceRequest.totalPrice
            )}`}
          />
        </Section>

        {/* Notes */}
        {serviceRequestData.serviceRequest.customerNotes && (
          <Section title="Special Instructions">
            <Text className="text-base text-gray-700">
              {serviceRequestData.serviceRequest.customerNotes}
            </Text>
          </Section>
        )}

        {/* Customer Rating */}
        {serviceRequestData.serviceRequest.status === "completed" && (
          <Section title="Customer Rating">
            <VStack className="gap-2">
              <Text className="text-base text-gray-700">
                This service has been completed. Customer rating will appear
                here once submitted.
              </Text>
              <Text className="text-sm text-gray-500">
                Customers can rate your service after completion.
              </Text>
            </VStack>
          </Section>
        )}

        {/* Timeline */}
        <Section title="Timeline">
          <TimelineItem
            label="Created"
            date={new Date(serviceRequestData.serviceRequest.createdAt)}
          />
          {serviceRequestData.serviceRequest.confirmedAt && (
            <TimelineItem
              label="Confirmed"
              date={new Date(serviceRequestData.serviceRequest.confirmedAt)}
            />
          )}
          {serviceRequestData.serviceRequest.startedAt && (
            <TimelineItem
              label="Started"
              date={new Date(serviceRequestData.serviceRequest.startedAt)}
            />
          )}
          {serviceRequestData.serviceRequest.completedAt && (
            <TimelineItem
              label="Completed"
              date={new Date(serviceRequestData.serviceRequest.completedAt)}
            />
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
