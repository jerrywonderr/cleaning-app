import { EmptyState } from "@/lib/components/EmptyState";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { ServiceProviderResult } from "@/lib/types";
import { FlashList } from "@shopify/flash-list";
import { ProviderItem } from "./ProviderItem";

interface ProviderListProps {
  providers: ServiceProviderResult[];
  selectedProviderId?: string;
  onProviderSelect: (providerId: string) => void;
  serviceId?: string;
  error?: string;
}

export const ProviderList = ({
  providers,
  selectedProviderId,
  onProviderSelect,
  serviceId,
  error,
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
          />
        )}
        ItemSeparatorComponent={() => <VStack className="h-px bg-gray-200" />}
        estimatedItemSize={200}
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
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
};
