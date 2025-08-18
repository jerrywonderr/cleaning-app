import FixedScreen from "@/lib/components/screens/FixedScreen";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import OfferCard from "@/lib/features/offers/OfferCard";
import { useProviderOffers } from "@/lib/hooks/useOffers";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Package, Plus } from "lucide-react-native";

export default function OffersScreen() {
  const router = useRouter();
  const { data: offers, isLoading, error } = useProviderOffers();

  const handleCreateOffer = () => {
    router.push("/service-provider/offers/create");
  };

  const handleViewOffer = (offerId: string) => {
    router.push(`/service-provider/offers/${offerId}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <ScrollableScreen
        addTopInset={false}
        addBottomInset={false}
        contentContainerClassName="px-4"
      >
        <Box className="flex-1 items-center justify-center">
          <Text>Loading your offers...</Text>
        </Box>
      </ScrollableScreen>
    );
  }

  // Show error state
  if (error) {
    return (
      <ScrollableScreen
        addTopInset={false}
        addBottomInset={false}
        contentContainerClassName="px-4"
      >
        <Box className="flex-1 items-center justify-center">
          <Text className="text-red-500 mb-4">Failed to load offers</Text>
          <Button
            onPress={() => window.location.reload()}
            className="bg-brand-500"
          >
            <ButtonText>Try Again</ButtonText>
          </Button>
        </Box>
      </ScrollableScreen>
    );
  }

  // Show empty state
  if (!offers || offers.length === 0) {
    return (
      <ScrollableScreen
        addTopInset={false}
        addBottomInset={false}
        contentContainerClassName="px-4"
      >
        <VStack className="flex-1 items-center justify-center gap-4">
          <Box className="bg-gray-100 p-6 rounded-full">
            <Icon as={Package} className="text-gray-400" size="xl" />
          </Box>
          <Text className="text-xl font-inter-semibold text-gray-900 text-center">
            No offers yet
          </Text>
          <Text className="text-gray-500 text-center max-w-xs">
            Create your first offer to start attracting customers and growing
            your business.
          </Text>
          <Button
            onPress={handleCreateOffer}
            className="bg-brand-500 rounded-xl"
          >
            <ButtonText className="text-lg">Create Your First Offer</ButtonText>
          </Button>
        </VStack>
      </ScrollableScreen>
    );
  }

  return (
    <FixedScreen
      addTopInset={false}
      addBottomInset={false}
      contentContainerClassName="px-4"
    >
      {/* Header with Create Button */}
      <HStack className="justify-between items-center">
        <VStack>
          <Text className="text-2xl font-inter-bold text-gray-900">
            My Services
          </Text>
          <Text className="text-gray-500">
            {offers.length} service{offers.length !== 1 ? "s" : ""} • Manage
            your services
          </Text>
        </VStack>
        <Pressable className="shadow-sm" onPress={handleCreateOffer}>
          <Box className="bg-brand-500 p-3 rounded-full">
            <Icon as={Plus} className="text-white" size="lg" />
          </Box>
        </Pressable>
      </HStack>

      {/* Offers List */}
      {/* <VStack className="gap-3">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            title={offer.title}
            price={offer.price}
            provider={offer.provider}
            description={offer.description}
            image={offer.image}
            onPress={() => handleViewOffer(offer.id)}
          />
        ))}
      </VStack> */}
      <FlashList
        data={Array(4).fill(offers).flat()}
        renderItem={({ item: offer }) => (
          <OfferCard
            key={offer.id}
            title={offer.title}
            price={offer.price}
            provider={offer.provider}
            description={offer.description}
            image={offer.image}
            onPress={() => handleViewOffer(offer.id)}
          />
        )}
        contentContainerClassName="gap-3 py-8"
        ItemSeparatorComponent={() => <Box className="h-[0.5] my-2" />}
        estimatedItemSize={109}
        showsVerticalScrollIndicator={false}
      />
    </FixedScreen>
  );
}
