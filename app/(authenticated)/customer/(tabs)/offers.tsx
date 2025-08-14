import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Input, InputField } from "@/lib/components/ui/input";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import OfferCard from "@/lib/features/offers/OfferCard";
import { useActiveOffers, useSearchOffers } from "@/lib/hooks/useOffers";
import { useRouter } from "expo-router";
import { Filter, Package, Search } from "lucide-react-native";
import { useState } from "react";

export default function OffersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Get offers based on search query
  const { data: searchResults, isLoading: isSearching } =
    useSearchOffers(searchQuery);
  const { data: allOffers, isLoading: isLoadingOffers } = useActiveOffers();

  // Use search results if there's a query, otherwise use all offers
  const offers = searchQuery.trim() ? searchResults : allOffers;
  const isLoading = searchQuery.trim() ? isSearching : isLoadingOffers;

  const handleViewOffer = (offerId: string) => {
    router.push(`/customer/offers/${offerId}`);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
          <Text>Loading available offers...</Text>
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
            {searchQuery.trim() ? "No offers found" : "No offers available"}
          </Text>
          <Text className="text-gray-500 text-center max-w-xs">
            {searchQuery.trim()
              ? `No offers match "${searchQuery}". Try a different search term.`
              : "Check back later for new cleaning service offers."}
          </Text>
          {searchQuery.trim() && (
            <Button
              onPress={() => setSearchQuery("")}
              className="bg-brand-500 rounded-xl"
            >
              <ButtonText>Clear Search</ButtonText>
            </Button>
          )}
        </VStack>
      </ScrollableScreen>
    );
  }

  return (
    <ScrollableScreen
      addTopInset={false}
      addBottomInset={false}
      contentContainerClassName="px-4"
    >
      {/* Header */}
      <VStack className="mb-6">
        <Text className="text-2xl font-inter-bold text-gray-900">
          Available Services
        </Text>
        <Text className="text-gray-500">
          {offers.length} offer{offers.length !== 1 ? "s" : ""} available
        </Text>
      </VStack>

      {/* Search and Filters */}
      <VStack className="gap-3 mb-6">
        {/* Search Bar */}
        <HStack className="items-center gap-3">
          <Box className="flex-1 relative">
            <Icon
              as={Search}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size="sm"
            />
            <Input>
              <InputField
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Search for cleaning services..."
                className="pl-10 text-base text-gray-900"
              />
            </Input>
          </Box>
          <Pressable onPress={toggleFilters}>
            <Box className="bg-gray-100 p-3 rounded-lg">
              <Icon as={Filter} className="text-gray-600" size="sm" />
            </Box>
          </Pressable>
        </HStack>

        {/* Search Results Info */}
        {searchQuery.trim() && (
          <HStack className="items-center gap-2">
            <Text className="text-sm text-gray-500">
              Search results for &ldquo;{searchQuery}&rdquo;
            </Text>
            <Pressable onPress={() => setSearchQuery("")}>
              <Text className="text-sm text-brand-500 font-medium">Clear</Text>
            </Pressable>
          </HStack>
        )}
      </VStack>

      {/* Offers List */}
      <VStack className="gap-3">
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
      </VStack>
    </ScrollableScreen>
  );
}
