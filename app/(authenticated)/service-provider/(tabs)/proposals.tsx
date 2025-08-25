import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import ProposalCard from "@/lib/features/proposals/ProposalCard";
import { useActiveOffers } from "@/lib/hooks/useOffers";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl } from "react-native";

// mock proposals for now
const mockProposals = {
  pending: [
    { id: "1", title: "Deep Cleaning", provider: "Sparkle Ltd" },
    { id: "2", title: "Move-out Cleaning", provider: "Shiny Homes" },
  ],
  confirmed: [{ id: "3", title: "Carpet Shampoo", provider: "Fresh Floors" }],
};

export default function ProposalsScreen() {
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed">(
    "pending"
  );
  const router = useRouter();

  // Fake refresh handler
  const handleRefresh = () => {
    // Later hook into API
    console.log("Refreshing proposals...");
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      default:
        return tab;
    }
  };

  const getEmptyStateMessage = (tab: string) => {
    switch (tab) {
      case "pending":
        return "You don’t have any pending proposals.";
      case "confirmed":
        return "You don’t have any confirmed proposals yet.";
      default:
        return "No proposals found.";
    }
  };

  const proposals = mockProposals[activeTab] || [];
  const { data: allOffers, isLoading: isLoadingOffers } = useActiveOffers();
  const handleViewOffer = (offerId: string) => {
    router.push(`/service-provider/offers/${offerId}`);
  };

  return (
    <FixedScreen addTopInset={false}>
      {/* Header */}
      <Box className="bg-white px-2 py-4 border-b border-gray-100">
        <Text className="text-gray-500">Manage your proposals</Text>
      </Box>

      {/* Tab Navigation */}
      <Box className="bg-white border-b border-gray-100">
        <Box className="flex-row mx-6">
          {(["pending", "confirmed"] as const).map((tab) => (
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

      {/* Proposals List */}
      <Box className="flex-1 pt-6">
        {proposals.length > 0 && (
          <Text className="text-sm text-gray-500 mb-4 font-medium px-6">
            {proposals.length} {getTabTitle(activeTab).toLowerCase()} proposal
            {proposals.length !== 1 ? "s" : ""}
          </Text>
        )}

        {proposals.length > 0 ? (
          <FlashList
            data={allOffers}
            renderItem={({ item: offer }) => (
              <ProposalCard
                key={offer.id}
                title={offer.title}
                price={offer.price}
                client={offer.provider}
                description={offer.description}
                image={offer.image}
                status="pending"
                onPress={() => handleViewOffer(offer.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-3 my-4"
            ItemSeparatorComponent={() => <Box className="h-[0.5] my-2" />}
            estimatedItemSize={100}
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
              No {getTabTitle(activeTab).toLowerCase()} proposals
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
