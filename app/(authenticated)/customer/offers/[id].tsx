import {
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import ScreenHeader from "@/lib/components/ScreenHeader";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/lib/components/ui/menu";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useOffer, useUserProfile } from "@/lib/hooks/useOffers";
import { formatCurrency } from "@/lib/utils/formatNaira";
import {
  handleCallProvider,
  handleMessageProvider,
} from "@/lib/utils/providerContact";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Clock,
  MapPin,
  MessageCircle,
  MoreVertical,
  Phone,
  Star,
  User,
} from "lucide-react-native";
import { Alert, Dimensions, Image } from "react-native";

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

  const handleViewProviderInfo = () => {
    if (!offer) return;
    Alert.alert(
      "Provider Info",
      `Provider: ${offer.provider}\nThis feature will be implemented soon.`,
      [{ text: "OK" }]
    );
  };

  const handleAddReview = () => {
    if (!offer) return;
    Alert.alert(
      "Add Review",
      `Add a review for: ${offer.title}\nThis feature will be implemented soon.`,
      [{ text: "OK" }]
    );
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      addBottomInset={true}
      contentContainerClassName="px-0"
      footer={
        <HStack className="gap-3">
          <Box className="flex-1">
            <PrimaryButton
              onPress={() =>
                router.push(`/customer/appointments/offer/${offerId}/new`)
              }
            >
              Book This Service
            </PrimaryButton>
          </Box>

          <PrimaryOutlineButton
            onPress={() =>
              handleCallProvider(
                providerProfile?.phone ?? "",
                providerProfile?.firstName
              )
            }
            icon={Phone}
          />

          <PrimaryOutlineButton
            onPress={() =>
              handleMessageProvider(
                providerProfile?.phone ?? "",
                providerProfile?.firstName
              )
            }
            icon={MessageCircle}
          />
        </HStack>
      }
    >
      <Stack.Screen
        options={{
          title: "Offer Details",
          header: ({ navigation }) => (
            <ScreenHeader
              navigation={navigation}
              title="Service Details"
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
                    key="ViewCustomerrInfo"
                    textValue="View Customer Info"
                    onPress={handleViewProviderInfo}
                  >
                    <Icon as={User} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Provider Profile</MenuItemLabel>
                  </MenuItem>

                  <MenuItem
                    key="AddReview"
                    textValue="Add Review"
                    onPress={handleAddReview}
                  >
                    <Icon as={Star} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Add Review</MenuItemLabel>
                  </MenuItem>
                </Menu>
              }
            />
          ),
        }}
      />
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
              {formatCurrency(offer.price)}
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
                  <Box className="w-2 h-2 bg-brand-500 rounded-full" />
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
