import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import ProposalCard from "@/lib/features/proposals/ProposalCard";
import { useUserType } from "@/lib/hooks/useAuth";
import { useProviderProposalsByStatus } from "@/lib/hooks/useServiceRequestsPaginated";
import { ServiceRequestWithCustomer } from "@/lib/types/service-request";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl } from "react-native";

export default function ProposalsScreen() {
  const [activeTab, setActiveTab] = useState<"pending" | "accepted">("pending");
  const router = useRouter();
  const { profile } = useUserType();

  const {
    requests: serviceRequests,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    loadInitial,
  } = useProviderProposalsByStatus(profile?.id || "", activeTab);

  useEffect(() => {
    if (profile?.id) {
      loadInitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, activeTab]);

  const handleRefresh = () => {
    refresh();
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadMore();
    }
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
        {!isLoading && serviceRequests.length > 0 && (
          <Text className="text-sm text-gray-500 mb-4 font-medium px-6">
            {serviceRequests.length}+ {getTabTitle(activeTab).toLowerCase()}{" "}
            service request{serviceRequests.length !== 1 ? "s" : ""}
          </Text>
        )}

        {isLoading && serviceRequests.length === 0 ? (
          <Box className="flex-1 items-center justify-center py-12">
            <ActivityIndicator size="large" color="#6366f1" />
          </Box>
        ) : serviceRequests.length > 0 ? (
          <FlashList
            data={serviceRequests as ServiceRequestWithCustomer[]}
            keyExtractor={(item) => item.serviceRequest.id}
            estimatedItemSize={120}
            renderItem={({ item }) => {
              const { serviceRequest, customer } = item;
              return (
                <ProposalCard
                  key={serviceRequest.id}
                  type={
                    serviceRequest.serviceType as
                      | "classic-cleaning"
                      | "deep-cleaning"
                      | "end-of-tenancy"
                  }
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
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoadingMore ? (
                <Box className="p-4 items-center">
                  <ActivityIndicator color="#6366f1" />
                </Box>
              ) : null
            }
            refreshControl={
              <RefreshControl
                refreshing={false}
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
