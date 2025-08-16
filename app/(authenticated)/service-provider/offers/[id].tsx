import {
  DangerOutlineButton,
  PrimaryButton,
} from "@/lib/components/custom-buttons";
import ScreenHeader from "@/lib/components/ScreenHeader";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/lib/components/ui/menu";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useDeleteOffer, useOffer } from "@/lib/hooks/useOffers";
import { formatNaira } from "@/lib/utils/formatNaira";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  MoreVertical,
  Star,
  Trash2,
  User,
} from "lucide-react-native";
import { Alert, Image } from "react-native";

type URLParams = {
  id: string;
};

export default function OfferDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<URLParams>();
  const offerId = params.id as string;

  // Fetch offer data using the service
  const { data: offer, isLoading, error } = useOffer(offerId);
  const deleteOfferMutation = useDeleteOffer();

  const handleEditOffer = () => {
    if (!offer) return;

    router.push({
      pathname: "/service-provider/offers/edit/[id]",
      params: { id: offerId },
    });
  };

  const handleDeleteOffer = () => {
    if (!offer) return;

    Alert.alert(
      "Delete Offer",
      `Are you sure you want to delete "${offer.title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteOfferMutation.mutateAsync(offerId);
              router.back();
            } catch {
              Alert.alert("Error", "Failed to delete offer. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleViewProviderInfo = () => {
    if (!offer) return;

    // For now, show an alert. You can implement the actual navigation later
    Alert.alert(
      "Service Provider Info",
      `Provider: ${offer.provider}\nThis feature will be implemented soon.`,
      [{ text: "OK" }]
    );
  };

  const handleAddReview = () => {
    if (!offer) return;

    // For now, show an alert. You can implement the actual navigation later
    Alert.alert(
      "Add Review",
      `Add a review for: ${offer.title}\nThis feature will be implemented soon.`,
      [{ text: "OK" }]
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <ScrollableScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading offer details...</Text>
        </Box>
      </ScrollableScreen>
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
          <PrimaryButton onPress={handleEditOffer}>Edit Offer</PrimaryButton>

          <DangerOutlineButton onPress={handleDeleteOffer}>
            Delete Offer
          </DangerOutlineButton>
        </VStack>
      }
    >
      <Stack.Screen
        options={{
          title: "Offer Details",
          header: ({ navigation }) => (
            <ScreenHeader
              navigation={navigation}
              title="Offer Details"
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
                    key="Edit"
                    textValue="Edit"
                    onPress={handleEditOffer}
                  >
                    <Icon as={Edit} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Edit</MenuItemLabel>
                  </MenuItem>

                  <MenuItem
                    key="ViewAppointments"
                    textValue="View Appointments"
                    onPress={() =>
                      router.push(
                        `/service-provider/appointments/offer/${offer.id}`
                      )
                    }
                  >
                    <Icon
                      as={Calendar}
                      size="sm"
                      className="mr-2 text-gray-600"
                    />
                    <MenuItemLabel>View Appointments</MenuItemLabel>
                  </MenuItem>

                  <MenuItem
                    key="ViewProviderInfo"
                    textValue="View Service Provider Info"
                    onPress={handleViewProviderInfo}
                  >
                    <Icon as={User} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>View Service Provider Info</MenuItemLabel>
                  </MenuItem>

                  <MenuItem
                    key="AddReview"
                    textValue="Add Review"
                    onPress={handleAddReview}
                  >
                    <Icon as={Star} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Add Review</MenuItemLabel>
                  </MenuItem>

                  <MenuItem
                    key="Delete"
                    textValue="Delete"
                    onPress={handleDeleteOffer}
                  >
                    <Icon as={Trash2} size="sm" className="mr-2 text-red-600" />
                    <MenuItemLabel className="text-red-600">
                      Delete
                    </MenuItemLabel>
                  </MenuItem>
                </Menu>
              }
            />
          ),
        }}
      />

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
              <Text className="font-inter-semibold">{offer.provider}</Text>
            </Text>
          </HStack>

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
        </VStack>

        {/* Description */}
        <VStack className="gap-2 mb-6">
          <Text className="text-lg font-inter-semibold text-gray-900">
            Description
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
              Requirements
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
