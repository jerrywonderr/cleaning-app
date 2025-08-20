import ScreenHeader from "@/lib/components/ScreenHeader";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/lib/components/ui/menu";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  useDeleteOffer,
  useOffer,
  useUpdateOffer,
} from "@/lib/hooks/useOffers";
import { capitalizeFirstLetter } from "@/lib/utils/capitalizeFirstLetter";
import { formatNaira } from "@/lib/utils/formatNaira";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, Image, TextInput } from "react-native";

type URLParams = { id: string };

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function OfferDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<URLParams>();
  const offerId = params.id as string;

  const { data: offer, isLoading, error } = useOffer(offerId);
  const deleteOfferMutation = useDeleteOffer();
  const updateOfferMutation = useUpdateOffer();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });

  // Per-field edit toggles
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  // Initialize form from offer
  useEffect(() => {
    if (offer) {
      setForm({
        title: offer.title || "",
        price: String(offer.price ?? ""),
        description: offer.description || "",
      });
    }
  }, [offer]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanged = useMemo(() => {
    if (!offer) return { title: false, price: false, description: false };
    return {
      title: form.title !== (offer.title || ""),
      price: String(form.price) !== String(offer.price ?? ""),
      description: form.description !== (offer.description || ""),
    };
  }, [form, offer]);

  const saveField = async (field: keyof typeof form) => {
    try {
      const value =
        field === "price" ? Number(form.price) : (form[field] as string);

      await updateOfferMutation.mutateAsync({
        offerId,
        data: { [field]: value },
      });

      Alert.alert(
        "Success",
        `${capitalizeFirstLetter(field)} updated successfully`
      );
      if (field === "title") setIsEditingTitle(false);
      if (field === "price") setIsEditingPrice(false);
      if (field === "description") setIsEditingDescription(false);
    } catch {
      Alert.alert(
        "Error",
        `Failed to update ${capitalizeFirstLetter(field)}. Please try again.`
      );
    }
  };

  const cancelField = (field: keyof typeof form) => {
    if (!offer) return;

    setForm((prev) => ({
      ...prev,
      [field]:
        field === "price"
          ? String(offer.price ?? "")
          : (offer[field] as string) || "",
    }));

    if (field === "title") setIsEditingTitle(false);
    if (field === "price") setIsEditingPrice(false);
    if (field === "description") setIsEditingDescription(false);
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
    <ScrollableScreen
      addTopInset={false}
      addBottomInset={true}
      contentContainerClassName="px-0"
    >
      <Stack.Screen
        options={{
          title: "Service Details",
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

      <Box>
        <Image
          source={{ uri: offer.image }}
          style={{
            width: "100%",
            height: SCREEN_HEIGHT * 0.3,
            backgroundColor: "#f0f0f0",
          }}
        />
      </Box>

      <VStack className="gap-4 my-4">
        {/* Offer Info */}
        <VStack className="gap-4 bg-white p-4 rounded-2xl shadow-sm mx-4">
          <VStack className="flex-1">
            {/* Title */}
            {isEditingTitle ? (
              <VStack className="mb-2">
                <TextInput
                  value={form.title}
                  onChangeText={(t) => handleChange("title", t)}
                  className="text-2xl font-inter-bold text-gray-900  border-b border-gray-400  p-1"
                  placeholder="Enter your service title"
                />
                <HStack className="gap-2 mt-3">
                  <Pressable
                    onPress={() => cancelField("title")}
                    className="px-4 py-2 bg-gray-200 rounded-xl"
                    disabled={updateOfferMutation.isPending}
                  >
                    <Text className="text-gray-800">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => saveField("title")}
                    className="px-4 py-2 bg-brand-500 rounded-xl"
                    disabled={
                      updateOfferMutation.isPending || !hasChanged.title
                    }
                  >
                    <Text className="text-white">
                      {updateOfferMutation.isPending ? "Saving..." : "Save"}
                    </Text>
                  </Pressable>
                </HStack>
              </VStack>
            ) : (
              <HStack className="gap-2">
                <Text className="text-2xl font-inter-bold text-gray-900 mb-1">
                  {offer.title}
                </Text>
                <Pressable
                  onPress={() => setIsEditingTitle(true)}
                  className="p-2"
                >
                  <Icon as={Pencil} size="sm" className="text-gray-600" />
                </Pressable>
              </HStack>
            )}

            {/* Price */}
            {isEditingPrice ? (
              <VStack className="mb-2">
                <TextInput
                  value={form.price}
                  onChangeText={(t) => handleChange("price", t)}
                  className="text-xl font-inter-semibold text-brand-600 border-b border-gray-400 p-1"
                  placeholder="Enter price"
                  keyboardType="numeric"
                />
                <HStack className="gap-2 mt-3">
                  <Pressable
                    onPress={() => cancelField("price")}
                    className="px-4 py-2 bg-gray-200 rounded-xl"
                    disabled={updateOfferMutation.isPending}
                  >
                    <Text className="text-gray-800">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => saveField("price")}
                    className="px-4 py-2 bg-brand-500 rounded-xl"
                    disabled={
                      updateOfferMutation.isPending ||
                      !hasChanged.price ||
                      isNaN(Number(form.price))
                    }
                  >
                    <Text className="text-white">
                      {updateOfferMutation.isPending ? "Saving..." : "Save"}
                    </Text>
                  </Pressable>
                </HStack>
              </VStack>
            ) : (
              <HStack className="gap-2">
                <Text className="text-xl font-inter-semibold text-brand-600">
                  {formatNaira(offer.price)}
                </Text>
                <Pressable
                  onPress={() => setIsEditingPrice(true)}
                  className="p-2"
                >
                  <Icon as={Pencil} size="sm" className="text-gray-600" />
                </Pressable>
              </HStack>
            )}
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
        {isEditingDescription ? (
          <VStack className="gap-2 bg-white p-4 rounded-2xl shadow-sm mx-4">
            <Text className="text-xl font-inter-semibold text-gray-900">
              About This Service
            </Text>

            <TextInput
              value={form.description}
              onChangeText={(t) => handleChange("description", t)}
              className="text-base text-gray-600 leading-6 border-b border-gray-400 rounded-xl p-3"
              placeholder="Enter service description"
              multiline
            />

            <HStack className="gap-2 mt-2">
              <Pressable
                onPress={() => cancelField("description")}
                className="px-4 py-2 bg-gray-200 rounded-xl"
                disabled={updateOfferMutation.isPending}
              >
                <Text className="text-gray-800">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => saveField("description")}
                className="px-4 py-2 bg-brand-500 rounded-xl"
                disabled={
                  updateOfferMutation.isPending || !hasChanged.description
                }
              >
                <Text className="text-white">
                  {updateOfferMutation.isPending ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </HStack>
          </VStack>
        ) : (
          <VStack className="gap-2 bg-white p-4 rounded-2xl shadow-sm mx-4">
            <HStack className="gap-2">
              <Text className="text-xl font-inter-semibold text-gray-900">
                About This Service
              </Text>
              <Pressable
                onPress={() => setIsEditingDescription(true)}
                className="p-2"
              >
                <Icon as={Pencil} size="sm" className="text-gray-600" />
              </Pressable>
            </HStack>

            <Text className="text-base text-gray-600 leading-6">
              {offer.description}
            </Text>
          </VStack>
        )}

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
    </ScrollableScreen>
  );
}
