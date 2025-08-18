import { PrimaryButton } from "@/lib/components/custom-buttons";
import ScreenHeader from "@/lib/components/ScreenHeader";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/lib/components/ui/menu";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  useDeleteOffer,
  useOffer,
  useUpdateOffer,
} from "@/lib/hooks/useOffers";
import { formatNaira } from "@/lib/utils/formatNaira";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  MoreVertical,
  Trash2,
} from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, Pressable, TextInput } from "react-native";

type URLParams = { id: string };

export default function OfferDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<URLParams>();
  const offerId = params.id as string;

  const { data: offer, isLoading, error } = useOffer(offerId);
  const deleteOfferMutation = useDeleteOffer();
  const updateOfferMutation = useUpdateOffer();

  // State for editing fields
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState("");

  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [editedDuration, setEditedDuration] = useState("");

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editedCategory, setEditedCategory] = useState("");

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");

  // const handleEditOffer = () => {
  //   if (!offer) return;
  //   router.push({
  //     pathname: "/service-provider/offers/edit/[id]",
  //     params: { id: offerId },
  //   });
  // };

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

  // const handleViewCustomerInfo = () => {
  //   if (!offer) return;
  //   Alert.alert(
  //     "Customer Info",
  //     `Provider: ${offer.provider}\nThis feature will be implemented soon.`,
  //     [{ text: "OK" }]
  //   );
  // };

  // const handleAddReview = () => {
  //   if (!offer) return;
  //   Alert.alert(
  //     "Add Review",
  //     `Add a review for: ${offer.title}\nThis feature will be implemented soon.`,
  //     [{ text: "OK" }]
  //   );
  // };

  const handleSave = async (field: string, value: string | number) => {
    try {
      await updateOfferMutation.mutateAsync({
        offerId,
        data: { [field]: value },
      });
    } catch {
      Alert.alert("Error", `Failed to update ${field}. Please try again.`);
    }
  };

  if (isLoading) {
    return (
      <ScrollableScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading offer details...</Text>
        </Box>
      </ScrollableScreen>
    );
  }

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
    <ScrollableScreen addTopInset={false} addBottomInset={true}>
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
                  {/* <MenuItem
                    key="Edit"
                    textValue="Edit"
                    onPress={handleEditOffer}
                  >
                    <Icon as={Edit} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Edit</MenuItemLabel>
                  </MenuItem> */}

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
                  {/* 
                  <MenuItem
                    key="ViewCustomerrInfo"
                    textValue="View Customer Info"
                    onPress={handleViewCustomerInfo}
                  >
                    <Icon as={User} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>View Customer Profile</MenuItemLabel>
                  </MenuItem> */}

                  {/* <MenuItem
                    key="AddReview"
                    textValue="Add Review"
                    onPress={handleAddReview}
                  >
                    <Icon as={Star} size="sm" className="mr-2 text-gray-600" />
                    <MenuItemLabel>Add Review</MenuItemLabel>
                  </MenuItem> */}

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

        {/* Title */}
        <VStack className="gap-2 mb-6">
          {isEditingTitle ? (
            <HStack className="items-center gap-2">
              <TextInput
                value={editedTitle}
                onChangeText={setEditedTitle}
                className="flex-1 border border-gray-300 rounded p-2"
              />
              <PrimaryButton
                size="xs"
                className="h-8 px-3 rounded-md"
                onPress={async () => {
                  await handleSave("title", editedTitle);
                  setIsEditingTitle(false);
                }}
              >
                Save
              </PrimaryButton>
            </HStack>
          ) : (
            <HStack className="items-center gap-2">
              <Text className="text-2xl font-inter-bold text-gray-900">
                {offer.title}
              </Text>
              <Pressable
                onPress={() => {
                  setEditedTitle(offer.title);
                  setIsEditingTitle(true);
                }}
              >
                <Icon as={Edit} size="sm" className="text-gray-600" />
              </Pressable>
            </HStack>
          )}

          {/* Price */}
          {isEditingPrice ? (
            <HStack className="items-center gap-2">
              <TextInput
                value={editedPrice}
                onChangeText={setEditedPrice}
                keyboardType="numeric"
                className="flex-1 border border-gray-300 rounded p-2"
              />
              <PrimaryButton
                size="xs"
                className="h-8 px-3 rounded-md"
                onPress={async () => {
                  await handleSave("price", Number(editedPrice));
                  setIsEditingPrice(false);
                }}
              >
                <ButtonText>Save</ButtonText>
              </PrimaryButton>
            </HStack>
          ) : (
            <HStack className="items-center gap-2">
              <Text className="text-xl font-inter-semibold text-brand-500">
                {formatNaira(offer.price)}
              </Text>
              <Pressable
                onPress={() => {
                  setEditedPrice(String(offer.price));
                  setIsEditingPrice(true);
                }}
              >
                <Icon as={Edit} size="sm" className="text-gray-600" />
              </Pressable>
            </HStack>
          )}
        </VStack>

        {/* Provider */}
        <HStack className="items-center gap-2 mb-4">
          <Icon as={MapPin} className="text-gray-500" size="sm" />

          <Text className="text-base text-gray-700">
            Provided by{" "}
            <Text className="font-inter-semibold">{offer.provider}</Text>
          </Text>
        </HStack>

        {/* Duration */}
        <HStack className="items-center gap-2 mb-4">
          <Icon as={Clock} className="text-gray-500" size="sm" />
          {isEditingDuration ? (
            <HStack className="items-center gap-2 flex-1">
              <TextInput
                value={editedDuration}
                onChangeText={setEditedDuration}
                keyboardType="numeric"
                className="flex-1 border border-gray-300 rounded p-2"
              />
              <PrimaryButton
                size="xs"
                className="h-8 px-3 rounded-md"
                onPress={async () => {
                  await handleSave("duration", Number(editedDuration));
                  setIsEditingDuration(false);
                }}
              >
                <ButtonText>Save</ButtonText>
              </PrimaryButton>
            </HStack>
          ) : (
            <HStack className="items-center gap-2">
              <Text className="text-base text-gray-700">
                Estimated duration: {offer.duration} hour
                {offer.duration !== 1 ? "s" : ""}
              </Text>
              <Pressable
                onPress={() => {
                  setEditedDuration(String(offer.duration));
                  setIsEditingDuration(true);
                }}
              >
                <Icon as={Edit} size="sm" className="text-gray-600" />
              </Pressable>
            </HStack>
          )}
        </HStack>

        {/* Category */}
        {isEditingCategory ? (
          <HStack className="items-center gap-2 mb-4">
            <TextInput
              value={editedCategory}
              onChangeText={setEditedCategory}
              className="flex-1 border border-gray-300 rounded p-2"
            />
            <PrimaryButton
              size="xs"
              className="h-8 px-3 rounded-md"
              onPress={async () => {
                await handleSave("category", editedCategory);
                setIsEditingCategory(false);
              }}
            >
              <ButtonText>Save</ButtonText>
            </PrimaryButton>
          </HStack>
        ) : (
          offer.category && (
            <HStack className="items-center gap-2 mb-4">
              <Box className="bg-brand-100 px-3 py-1 rounded-full">
                <Text className="text-brand-700 text-sm font-medium capitalize">
                  {offer.category.replace("-", " ")}
                </Text>
              </Box>
              <Pressable
                onPress={() => {
                  setEditedCategory(offer.category);
                  setIsEditingCategory(true);
                }}
              >
                <Icon as={Edit} size="sm" className="text-gray-600" />
              </Pressable>
            </HStack>
          )
        )}

        {/* Description */}
        <VStack className="gap-2 mb-6">
          <Text className="text-lg font-inter-semibold text-gray-900">
            Description
          </Text>
          {isEditingDescription ? (
            <VStack className="gap-2">
              <TextInput
                value={editedDescription}
                onChangeText={setEditedDescription}
                multiline
                className="border border-gray-300 rounded p-2 h-24"
              />
              <PrimaryButton
                size="xs"
                className="h-8 px-3 rounded-md"
                onPress={async () => {
                  await handleSave("description", editedDescription);
                  setIsEditingDescription(false);
                }}
              >
                <ButtonText>Save</ButtonText>
              </PrimaryButton>
            </VStack>
          ) : (
            <HStack className="items-center gap-2">
              <Text className="text-base text-gray-700 leading-6 flex-1">
                {offer.description}
              </Text>
              <Pressable
                onPress={() => {
                  setEditedDescription(offer.description);
                  setIsEditingDescription(true);
                }}
              >
                <Icon as={Edit} size="sm" className="text-gray-600" />
              </Pressable>
            </HStack>
          )}
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
    </ScrollableScreen>
  );
}
