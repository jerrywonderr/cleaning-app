import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import ProposalCard from "@/lib/features/proposals/ProposalCard";
import { useUserType } from "@/lib/hooks/useAuth";
import { useProviderServiceRequests } from "@/lib/hooks/useServiceRequests";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl } from "react-native";

export default function ProposalsScreen() {
  const [activeTab, setActiveTab] = useState<"pending" | "accepted">("pending");
  const router = useRouter();
  const { profile } = useUserType();

  // Fetch service requests for this provider
  const {
    data: serviceRequests = [],
    refetch,
    isRefetching,
  } = useProviderServiceRequests(profile?.id || "");

  // Filter service requests based on tab
  const filteredRequests = serviceRequests.filter((request) => {
    if (activeTab === "pending") {
      return request.serviceRequest.status === "pending";
    } else if (activeTab === "accepted") {
      return request.serviceRequest.status === "accepted";
    }
    return false;
  });

  const handleRefresh = () => {
    refetch();
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "pending":
        return "New Requests";
      case "accepted":
        return "Accepted";
      default:
        return tab;
    }
  };

  const getEmptyStateMessage = (tab: string) => {
    switch (tab) {
      case "pending":
        return "No new service requests at the moment.";
      case "accepted":
        return "No accepted requests waiting for customer payment.";
      default:
        return "No service requests found.";
    }
  };

  const handleViewServiceRequest = (serviceRequestId: string) => {
    router.push(
      `/(authenticated)/service-provider/proposals/${serviceRequestId}`
    );
  };

  return (
    <FixedScreen addTopInset={false}>
      {/* Header */}
      <Box className="bg-white px-2 py-4 border-b border-gray-100">
        <Text className="text-gray-500">Manage incoming service requests</Text>
      </Box>

      {/* Tab Navigation */}
      <Box className="bg-white border-b border-gray-100">
        <Box className="flex-row mx-6">
          {(["pending", "accepted"] as const).map((tab) => (
            <Pressable
              key={tab}
              className={`flex-1 py-4 ${
                activeTab === tab ? "border-b-2 border-brand-500" : ""
              }`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-center font-semibold text-base ${
                  activeTab === tab ? "text-brand-500" : "text-gray-500"
                }`}
              >
                {getTabTitle(tab)}
              </Text>
            </Pressable>
          ))}
        </Box>
      </Box>

      {/* Service Requests List */}
      <Box className="flex-1 pt-6">
        {filteredRequests.length > 0 && (
          <Text className="text-sm text-gray-500 mb-4 font-medium px-6">
            {filteredRequests.length} {getTabTitle(activeTab).toLowerCase()}{" "}
            service request{filteredRequests.length !== 1 ? "s" : ""}
          </Text>
        )}

        {filteredRequests.length > 0 ? (
          <FlashList
            data={filteredRequests}
            keyExtractor={(item) => item.serviceRequest.id}
            estimatedItemSize={120}
            renderItem={({ item }) => {
              const { serviceRequest, customer } = item;
              return (
                <ProposalCard
                  key={serviceRequest.id}
                  title={serviceRequest.serviceName}
                  price={serviceRequest.totalPrice}
                  client={`${customer.firstName} ${customer.lastName}`}
                  description={`${serviceRequest.duration} hour${
                    serviceRequest.duration > 1 ? "s" : ""
                  } • ${serviceRequest.timeRange} • ${
                    serviceRequest.location.fullAddress
                  }`}
                  image={customer.profileImage}
                  status={
                    serviceRequest.status === "pending" ? "pending" : "accepted"
                  }
                  onPress={() => handleViewServiceRequest(serviceRequest.id)}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-3 my-4"
            ItemSeparatorComponent={() => <Box className="h-[0.5] my-2" />}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
                tintColor="#6366f1"
              />
            }
          />
        ) : (
          <Box className="flex-1 items-center justify-center py-12 px-6">
            <Icon as={FileText} size="xl" className="text-gray-300 mb-4" />
            <Text className="text-gray-500 text-center text-lg font-medium mb-2">
              No {getTabTitle(activeTab).toLowerCase()} service requests
            </Text>
            <Text className="text-gray-400 text-center">
              {getEmptyStateMessage(activeTab)}
            </Text>
          </Box>
        )}
      </Box>
    </FixedScreen>
  );
}
