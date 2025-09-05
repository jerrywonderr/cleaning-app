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
  MapPin,
  MessageCircle,
  MoreVertical,
  Phone,
  User,
  XCircle,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, Modal, ScrollView, TextInput } from "react-native";

export default function ServiceProviderProposalDetailScreen() {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const proposalId = params.id as string;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch service request data
  const {
    data: serviceRequestData,
    isLoading,
    error,
  } = useServiceRequestWithCustomer(proposalId);
  const updateServiceRequestMutation = useUpdateServiceRequest();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "accepted":
        return "text-blue-600 bg-blue-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      case "confirmed":
        return "text-green-600 bg-green-50";
      case "in-progress":
        return "text-green-600 bg-green-50";
      case "completed":
        return "text-green-700 bg-green-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "New Request - Action Required";
      case "accepted":
        return "Accepted - Awaiting Customer Payment";
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
      default:
        return status;
    }
  };

  const handleAcceptProposal = async () => {
    if (!serviceRequestData) return;

    try {
      showLoader();
      await updateServiceRequestMutation.mutateAsync({
        id: serviceRequestData.serviceRequest.id,
        data: { status: "accepted" },
      });

      Alert.alert("Success", "Service request accepted successfully!");
    } catch (error: any) {
      Alert.alert("Error", `Failed to accept request: ${error.message}`);
    } finally {
      hideLoader();
    }
  };

  const handleRejectProposal = async () => {
    if (!serviceRequestData || !rejectionReason.trim()) return;

    try {
      showLoader();
      await updateServiceRequestMutation.mutateAsync({
        id: serviceRequestData.serviceRequest.id,
        data: {
          status: "rejected",
          rejectionReason: rejectionReason.trim(),
        },
      });

      setShowRejectModal(false);
      setRejectionReason("");
      Alert.alert("Success", "Service request rejected successfully!");
    } catch (error: any) {
      Alert.alert("Error", `Failed to reject request: ${error.message}`);
    } finally {
      hideLoader();
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

  const canAccept = serviceRequestData?.serviceRequest.status === "pending";
  const canReject = serviceRequestData?.serviceRequest.status === "pending";

  // Show loading state
  if (isLoading) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading proposal details...</Text>
        </Box>
      </FixedScreen>
    );
  }

  // Show error state
  if (error || !serviceRequestData) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text className="text-red-500">Failed to load proposal details</Text>
          <PrimaryButton onPress={() => router.back()} className="mt-4">
            Go Back
          </PrimaryButton>
        </Box>
      </FixedScreen>
    );
  }

  const { serviceRequest, customer } = serviceRequestData;
  const scheduledDate = new Date(serviceRequest.scheduledDate);
  const formattedTime = new Date(scheduledDate);
  const timeString = format(formattedTime, "HH:mm");

  return (
    <FootedScrollableScreen
      addTopInset={false}
      addBottomInset={true}
      contentContainerClassName="px-0"
      footer={
        <HStack className="gap-3">
          <Box className="flex-1">
            {canAccept && (
              <PrimaryButton onPress={handleAcceptProposal} icon={CheckCircle}>
                Accept Request
              </PrimaryButton>
            )}

            {canReject && (
              <DangerOutlineButton
                onPress={() => setShowRejectModal(true)}
                icon={XCircle}
              >
                Reject Request
              </DangerOutlineButton>
            )}
          </Box>

          <PrimaryOutlineButton
            onPress={() => {
              handleCallProvider(customer?.phone ?? "", customer?.firstName);
            }}
            icon={Phone}
          />

          <PrimaryOutlineButton
            onPress={() =>
              handleMessageProvider(customer?.phone ?? "", customer?.firstName)
            }
            icon={MessageCircle}
          />
        </HStack>
      }
    >
      <Stack.Screen
        options={{
          title: "Service Request Details",
          header: ({ navigation }) => (
            <ScreenHeader
              navigation={navigation}
              title="Service Request Details"
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
                    key="ViewCustomerInfo"
                    textValue="View Customer Info"
                    onPress={handleViewCustomerInfo}
                  >
                    <Icon as={User} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Customer Profile</MenuItemLabel>
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
              {serviceRequest.serviceName}
            </Text>
            <Box
              className={`px-3 py-1 rounded-full ${getStatusColor(
                serviceRequest.status
              )}`}
            >
              <Text className="text-sm font-medium">
                {getStatusText(serviceRequest.status)}
              </Text>
            </Box>
          </HStack>
          <Text className="text-xl font-inter-semibold text-brand-500">
            {formatNaira(serviceRequest.totalPrice)}
          </Text>
        </VStack>

        {/* Section: Service Details */}
        <Section title="Service Details">
          <InfoRow
            icon={Calendar}
            text={format(scheduledDate, "EEEE, MMMM d, yyyy")}
          />
          <InfoRow icon={Clock} text={timeString} />
          <InfoRow
            icon={Clock}
            text={`Duration: ${serviceRequest.duration} hour${
              serviceRequest.duration !== 1 ? "s" : ""
            }`}
          />
          <InfoRow icon={MapPin} text={serviceRequest.location.fullAddress} />
        </Section>

        {/* Section: Customer */}
        <Section title="Customer Details">
          <InfoRow
            icon={User}
            text={`${customer.firstName} ${customer.lastName}`}
          />
          {customer.phone && <InfoRow icon={Phone} text={customer.phone} />}
        </Section>

        {/* Section: Pricing Breakdown */}
        <Section title="Pricing Breakdown">
          <HStack className="items-center justify-between">
            <Text className="text-base text-gray-700">Base Service</Text>
            <Text className="text-base font-medium text-gray-900">
              {formatNaira(serviceRequest.basePrice)}
            </Text>
          </HStack>
          {serviceRequest.extrasPrice > 0 && (
            <HStack className="items-center justify-between">
              <Text className="text-base text-gray-700">Extra Services</Text>
              <Text className="text-base font-medium text-gray-900">
                {formatNaira(serviceRequest.extrasPrice)}
              </Text>
            </HStack>
          )}
          <HStack className="items-center justify-between border-t border-gray-200 pt-2">
            <Text className="text-lg font-semibold text-gray-900">Total</Text>
            <Text className="text-lg font-bold text-brand-500">
              {formatNaira(serviceRequest.totalPrice)}
            </Text>
          </HStack>
        </Section>

        {/* Section: Extra Services */}
        {serviceRequest.extraOptions &&
          serviceRequest.extraOptions.length > 0 && (
            <Section title="Extra Services">
              <Text className="text-base text-gray-700">
                {serviceRequest.extraOptions.length} extra service
                {serviceRequest.extraOptions.length !== 1 ? "s" : ""} selected
              </Text>
              <Text className="text-sm text-gray-500">
                Extra services: {serviceRequest.extraOptions.join(", ")}
              </Text>
            </Section>
          )}

        {/* Section: Special Instructions */}
        {serviceRequest.customerNotes && (
          <Section title="Special Instructions">
            <Text className="text-base text-gray-700">
              {serviceRequest.customerNotes}
            </Text>
          </Section>
        )}

        {/* Section: Rejection Reason (if rejected) */}
        {serviceRequest.status === "rejected" &&
          serviceRequest.rejectionReason && (
            <Section title="Rejection Reason">
              <Text className="text-base text-red-600">
                {serviceRequest.rejectionReason}
              </Text>
            </Section>
          )}
      </ScrollView>

      {/* Rejection Modal */}
      <Modal
        visible={showRejectModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <Box className="flex-1 bg-white p-6">
          <VStack className="space-y-6">
            <Text className="text-2xl font-bold text-center">
              Reject Service Request
            </Text>

            <VStack className="space-y-4">
              <Text className="text-lg font-medium">
                Please provide a reason for rejecting this service request:
              </Text>

              <TextInput
                value={rejectionReason}
                onChangeText={setRejectionReason}
                placeholder="Enter rejection reason..."
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-lg p-3 text-base"
                textAlignVertical="top"
              />
            </VStack>

            {/* Action Buttons */}
            <VStack className="space-y-3">
              <DangerOutlineButton
                onPress={handleRejectProposal}
                disabled={!rejectionReason.trim()}
              >
                Reject Request
              </DangerOutlineButton>

              <PrimaryOutlineButton
                onPress={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
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
