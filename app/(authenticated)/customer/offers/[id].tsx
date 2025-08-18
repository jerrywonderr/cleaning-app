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
import {
  handleCallProvider,
  handleMessageProvider,
} from "@/lib/utils/providerContact";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Clock, MapPin, MessageCircle, Phone, Star } from "lucide-react-native";
import { Dimensions, Image } from "react-native";

type URLParams = {
  id: string;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CustomerOfferDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<URLParams>();
  const offerId = params.id as string;

  // Fetch offer data using the service
  const { data: offer, isLoading, error } = useOffer(offerId);

  // Fetch service provider details once offer is loaded
  const { data: providerProfile } = useUserProfile(offer?.providerId || "");

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
      contentContainerClassName="px-0"
      footer={
        <VStack className="gap-3">
          <PrimaryButton
            onPress={() =>
              router.push(`/customer/appointments/offer/${offerId}/new`)
            }
          >
            Book This Service
          </PrimaryButton>

          <HStack className="gap-3">
            <Box className="flex-1">
              <PrimaryOutlineButton
                onPress={() =>
                  handleCallProvider(
                    providerProfile?.phone ?? "",
                    providerProfile?.firstName
                  )
                }
                icon={Phone}
              >
                Call
              </PrimaryOutlineButton>
            </Box>

            <Box className="flex-1">
              <PrimaryOutlineButton
                onPress={() =>
                  handleMessageProvider(
                    providerProfile?.phone ?? "",
                    providerProfile?.firstName
                  )
                }
                icon={MessageCircle}
              >
                Message
              </PrimaryOutlineButton>
            </Box>
          </HStack>
        </VStack>
      }
    >
      <Box>
        {/* Offer Image */}
        <Image
          source={{ uri: offer.image }}
          style={{
            width: "100%",
            height: SCREEN_HEIGHT * 0.3,
            // borderRadius: 16,
            backgroundColor: "#f0f0f0",
          }}
        />
      </Box>
      <VStack className="gap-4 my-4">
        {/* Offer Info */}
        <VStack className="gap-4 bg-white p-4 rounded-2xl shadow-sm mx-4">
          <VStack className="flex-1">
            <Text className="text-2xl font-inter-bold text-gray-900 mb-1">
              {offer.title}
            </Text>
            <Text className="text-xl font-inter-semibold text-brand-600">
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

          {/* Contact */}
          {providerProfile && (
            <HStack className="items-center gap-2">
              <Icon as={Phone} className="text-gray-500" size="sm" />
              <Text className="text-base text-gray-700">
                {providerProfile.phone}
              </Text>
            </HStack>
          )}

          {/* Duration */}
          <HStack className="items-center gap-2">
            <Icon as={Clock} className="text-gray-500" size="sm" />
            <Text className="text-base text-gray-700">
              {offer.duration} hour{offer.duration !== 1 ? "s" : ""}
            </Text>
          </HStack>

          {/* Category */}
          {offer.category && (
            <Box className="self-start bg-brand-100 px-3 py-1 rounded-full">
              <Text className="text-brand-700 text-sm font-medium capitalize">
                {offer.category.replace("-", " ")}
              </Text>
            </Box>
          )}

          {/* Rating */}
          <HStack className="items-center gap-2">
            <Icon as={Star} className="text-yellow-400" size="sm" />
            <Text className="text-base text-gray-700">
              4.8 (24 reviews) • Professional cleaner
            </Text>
          </HStack>
        </VStack>

        {/* Description */}
        <VStack className="gap-2 bg-white p-4 rounded-2xl shadow-sm mx-4">
          <Text className="text-xl font-inter-semibold text-gray-900">
            About This Service
          </Text>
          <Text className="text-base text-gray-600 leading-6">
            {offer.description}
          </Text>
        </VStack>

        {/* What's Included */}
        {offer.whatIncluded && offer.whatIncluded.length > 0 && (
          <VStack className="gap-2 bg-white p-4 rounded-2xl shadow-sm mx-4">
            <Text className="text-xl font-inter-semibold text-gray-900">
              What&apos;s Included
            </Text>
            <VStack className="gap-2">
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
          <VStack className="gap-2 bg-white p-4 rounded-2xl shadow-sm mx-4">
            <Text className="text-xl font-inter-semibold text-gray-900">
              What You Need to Prepare
            </Text>
            <VStack className="gap-2">
              {offer.requirements.map((item, index) => (
                <HStack key={index} className="items-center gap-2">
                  <Box className="w-2 h-2 bg-gray-400 rounded-full" />
                  <Text className="text-base text-gray-700">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        )}
      </VStack>
    </FootedScrollableScreen>
  );
}
