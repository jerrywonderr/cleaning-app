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
import { useLoader } from "@/lib/components/ui/loader";
import { Menu, MenuItem, MenuItemLabel } from "@/lib/components/ui/menu";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  useServiceRequestWithProvider,
  useUpdateServiceRequest,
} from "@/lib/hooks/useServiceRequests";
import { formatCurrency } from "@/lib/utils/formatNaira";
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
  Star,
  User,
  XCircle,
} from "lucide-react-native";
import { Alert, ScrollView } from "react-native";

export default function CustomerAppointmentDetailScreen() {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId: string }>();
  const appointmentId = params.appointmentId as string;

  // Fetch service request data
  const {
    data: serviceRequestData,
    isLoading,
    error,
  } = useServiceRequestWithProvider(appointmentId);

  // Mutations
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

  const handleMarkCompleted = async () => {
    if (!serviceRequestData) return;

    try {
      showLoader();
      await updateServiceRequestMutation.mutateAsync({
        id: serviceRequestData.serviceRequest.id,
        data: {
          status: "completed",
        },
      });

      Alert.alert("Success", "Appointment marked as completed!");
      // TODO: Navigate to rating screen or show rating prompt
    } catch (error: any) {
      Alert.alert("Error", `Failed to mark as completed: ${error.message}`);
    } finally {
      hideLoader();
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

  const handleViewProviderInfo = async () => {
    if (!serviceRequestData?.provider) return;

    try {
      showLoader();
      // TODO: Implement provider info view
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      Alert.alert(
        "Provider Info",
        `Provider: ${serviceRequestData.provider.firstName} ${serviceRequestData.provider.lastName}`,
        [{ text: "OK" }]
      );
    } catch (error: any) {
      Alert.alert("Error", `Failed to load provider info: ${error.message}`);
    } finally {
      hideLoader();
    }
  };

  const handleAddReview = () => {
    if (!serviceRequestData) return;
    if (!canRate) {
      Alert.alert(
        "Error",
        "You can only add review for completed appointments"
      );
      return;
    }
    router.push(
      `/(authenticated)/customer/rate/${serviceRequestData.serviceRequest.providerId}`
    );
  };

  const canMarkCompleted =
    serviceRequestData?.serviceRequest.status === "in-progress";
  const canCancel = ["pending", "confirmed"].includes(
    serviceRequestData?.serviceRequest.status || ""
  );
  const canRate = serviceRequestData?.serviceRequest.status === "completed";
  const markedAsNoShow =
    serviceRequestData?.serviceRequest.status === "no-show";

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
            {canMarkCompleted && (
              <PrimaryButton onPress={handleMarkCompleted} icon={CheckCircle}>
                Mark as Completed
              </PrimaryButton>
            )}

            {canRate && (
              <PrimaryButton onPress={handleAddReview} icon={Star}>
                Rate Service Provider
              </PrimaryButton>
            )}

            {markedAsNoShow && (
              <PrimaryButton disabled icon={XCircle}>
                Service No Show
              </PrimaryButton>
            )}

            {!canMarkCompleted && !canRate && !markedAsNoShow && (
              <DangerOutlineButton
                onPress={() => handleStatusUpdate("cancelled")}
                icon={XCircle}
                disabled={!canCancel}
              >
                Cancel Appointment
              </DangerOutlineButton>
            )}
          </Box>

          <PrimaryOutlineButton
            onPress={() => {
              handleCallProvider(
                serviceRequestData.provider?.phone ?? "",
                serviceRequestData.provider?.firstName
              );
            }}
            icon={Phone}
          />

          <PrimaryOutlineButton
            onPress={() =>
              handleMessageProvider(
                serviceRequestData.provider?.phone ?? "",
                serviceRequestData.provider?.firstName
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
                    key="ViewProviderInfo"
                    textValue="View Provider Info"
                    onPress={handleViewProviderInfo}
                  >
                    <Icon as={User} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Provider Profile</MenuItemLabel>
                  </MenuItem>

                  <MenuItem
                    key="AddReview"
                    textValue="Add Review"
                    // disabled={!canRate}
                    onPress={handleAddReview}
                  >
                    <Icon as={Star} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Add Review</MenuItemLabel>
                  </MenuItem>
                </Menu>
              }
            />
          ),
        }}
      />
      <ScrollView
        className="flex-1 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-6"
      >
        {/* Header */}
        <VStack className="gap-2 px-4">
          <HStack className="items-center justify-between">
            <Text className="text-2xl font-inter-bold text-gray-900">
              {serviceRequestData.serviceRequest.serviceName}
            </Text>
            <Text className="text-xl font-inter-semibold text-brand-500">
              {formatCurrency(serviceRequestData.serviceRequest.totalPrice)}
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

        {/* Section: Provider */}
        <Section title="Provider Details">
          <InfoRow
            icon={User}
            text={`${serviceRequestData.provider.firstName} ${serviceRequestData.provider.lastName}`}
          />
          {serviceRequestData.provider.phone && (
            <InfoRow icon={Phone} text={serviceRequestData.provider.phone} />
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
            text={`Amount: ${formatCurrency(
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
