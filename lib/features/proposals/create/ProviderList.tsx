import { EmptyState } from "@/lib/components/EmptyState";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { ServiceProviderResult } from "@/lib/types";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native";
import { ProviderItem } from "./ProviderItem";

interface ProviderListProps {
  providers: ServiceProviderResult[];
  selectedProviderId?: string;
  onProviderSelect: (providerId: string) => void;
  onViewProfile: (providerId: string) => void;
  serviceId?: string;
  error?: string;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  isRefreshing?: boolean;
}

export const ProviderList = ({
  providers,
  selectedProviderId,
  onProviderSelect,
  onViewProfile,
  serviceId,
  error,
  onLoadMore,
  onRefresh,
  hasMore,
  isLoadingMore,
  isRefreshing,
}: ProviderListProps) => {
  if (error) {
    return (
      <VStack className="items-center justify-center py-8">
        <Text className="text-red-600 text-center">{error}</Text>
      </VStack>
    );
  }

  return (
    <VStack style={{ minHeight: 200, flex: 1 }}>
      <FlashList
        data={providers}
        renderItem={({ item: provider }) => (
          <ProviderItem
            provider={provider}
            isSelected={selectedProviderId === provider.id}
            onSelect={() => onProviderSelect(provider.id)}
            onViewProfile={() => onViewProfile(provider.id)}
          />
        )}
        ItemSeparatorComponent={() => <VStack className="h-px bg-gray-200" />}
        estimatedItemSize={200}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing || false}
              onRefresh={onRefresh}
              tintColor="#6366f1"
            />
          ) : undefined
        }
        ListEmptyComponent={
          <EmptyState
            title={serviceId ? "No providers found" : "Select a service first"}
            description={
              serviceId
                ? "No service providers found in your area for this service."
                : "Choose a service to see available providers nearby."
            }
          />
        }
        ListFooterComponent={
          isLoadingMore && hasMore ? (
            <Box className="items-center py-4">
              <Text className="text-sm text-gray-500">
                Loading more providers...
              </Text>
            </Box>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
};
