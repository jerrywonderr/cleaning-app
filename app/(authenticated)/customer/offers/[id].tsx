import {
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useOffer, useUserProfile } from "@/lib/hooks/useOffers";
import { formatNaira } from "@/lib/utils/formatNaira";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Clock, MapPin, MessageCircle, Phone, Star } from "lucide-react-native";
import { Alert, Image } from "react-native";

type URLParams = {
  id: string;
};

export default function CustomerOfferDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<URLParams>();
  const offerId = params.id as string;

  // Fetch offer data using the service
  const { data: offer, isLoading, error } = useOffer(offerId);

  // Fetch service provider details once offer is loaded
  const { data: providerProfile } = useUserProfile(offer?.providerId || "");

  const handleContactProvider = () => {
    if (!offer) return;

    Alert.alert(
      "Contact Provider",
      `Would you like to contact ${offer.provider}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => Alert.alert("Call", "Call functionality coming soon!"),
        },
        {
          text: "Message",
          onPress: () =>
            Alert.alert("Message", "Message functionality coming soon!"),
        },
      ]
    );
  };

  const handleBookService = () => {
    if (!offer) return;

    Alert.alert(
      "Book Service",
      `Book "${offer.title}" with ${offer.provider}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Book Now",
          onPress: () =>
            Alert.alert("Booking", "Booking functionality coming soon!"),
        },
      ]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading offer details...</Text>
        </Box>
      </FixedScreen>
    );
  }

  // Show error state
  if (error || !offer) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text className="text-red-500">Failed to load offer details</Text>
          <Button onPress={() => router.back()} className="mt-4">
            <ButtonText>Go Back</ButtonText>
          </Button>
        </Box>
      </FixedScreen>
    );
  }

  return (
    <FootedScrollableScreen
      addTopInset={false}
      addBottomInset={true}
      footer={
        <VStack className="gap-3">
          <PrimaryButton onPress={handleBookService}>
            Book This Service
          </PrimaryButton>

          <HStack className="gap-3">
            <Box className="flex-1">
              <PrimaryOutlineButton
                onPress={handleContactProvider}
                icon={Phone}
              >
                Call
              </PrimaryOutlineButton>
            </Box>

            <Box className="flex-1">
              <PrimaryOutlineButton
                onPress={handleContactProvider}
                icon={MessageCircle}
              >
                Message
              </PrimaryOutlineButton>
            </Box>
          </HStack>
        </VStack>
      }
    >
      <Box className="mb-3 mt-3">
        {/* Offer Image */}
        <Box className="mb-6">
          <Image
            source={{ uri: offer.image }}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 16,
              backgroundColor: "#f0f0f0",
            }}
          />
        </Box>

        {/* Offer Info */}
        <VStack className="space-y-4 mb-6">
          <VStack className="flex-1">
            <Text className="text-2xl font-inter-bold text-gray-900 mb-2">
              {offer.title}
            </Text>
            <Text className="text-xl font-inter-semibold text-brand-500">
              {formatNaira(offer.price)}
            </Text>
          </VStack>

          {/* Provider Info */}
          <HStack className="items-center gap-2">
            <Icon as={MapPin} className="text-gray-500" size="sm" />
            <Text className="text-base text-gray-700">
              Provided by{" "}
              <Text className="font-inter-semibold">
                {providerProfile
                  ? `${providerProfile.firstName} ${providerProfile.lastName}`
                  : offer.provider}
              </Text>
            </Text>
          </HStack>

          {/* Provider Contact Info */}
          {providerProfile && (
            <HStack className="items-center gap-2">
              <Icon as={Phone} className="text-gray-500" size="sm" />
              <Text className="text-base text-gray-700">
                Contact: {providerProfile.phone}
              </Text>
            </HStack>
          )}

          {/* Duration */}
          <HStack className="items-center gap-2">
            <Icon as={Clock} className="text-gray-500" size="sm" />
            <Text className="text-base text-gray-700">
              Estimated duration: {offer.duration} hour
              {offer.duration !== 1 ? "s" : ""}
            </Text>
          </HStack>

          {/* Category */}
          {offer.category && (
            <HStack className="items-center gap-2">
              <Box className="bg-brand-100 px-3 py-1 rounded-full">
                <Text className="text-brand-700 text-sm font-medium capitalize">
                  {offer.category.replace("-", " ")}
                </Text>
              </Box>
            </HStack>
          )}

          {/* Provider Rating (Placeholder) */}
          <HStack className="items-center gap-2">
            <Icon as={Star} className="text-yellow-400" size="sm" />
            <Text className="text-base text-gray-700">
              4.8 (24 reviews) • Professional cleaner
            </Text>
          </HStack>
        </VStack>

        {/* Description */}
        <VStack className="gap-2 mb-6">
          <Text className="text-lg font-inter-semibold text-gray-900">
            About This Service
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            {offer.description}
          </Text>
        </VStack>

        {/* What's Included */}
        {offer.whatIncluded && offer.whatIncluded.length > 0 && (
          <VStack className="gap-2 mb-6">
            <Text className="text-lg font-inter-semibold text-gray-900">
              What&apos;s Included
            </Text>
            <VStack className="gap-1">
              {offer.whatIncluded.map((item, index) => (
                <HStack key={index} className="items-center gap-2">
                  <Box className="w-2 h-2 bg-brand-500 rounded-full" />
                  <Text className="text-base text-gray-700">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        )}

        {/* Requirements */}
        {offer.requirements && offer.requirements.length > 0 && (
          <VStack className="gap-2 mb-6">
            <Text className="text-lg font-inter-semibold text-gray-900">
              What You Need to Prepare
            </Text>
            <VStack className="gap-1">
              {offer.requirements.map((item, index) => (
                <HStack key={index} className="items-center gap-2">
                  <Box className="w-2 h-2 bg-gray-400 rounded-full" />
                  <Text className="text-base text-gray-700">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        )}
      </Box>
    </FootedScrollableScreen>
  );
}
