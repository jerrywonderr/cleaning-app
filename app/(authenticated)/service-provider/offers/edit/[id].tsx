import {
  DangerOutlineButton,
  PrimaryButton,
} from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { FormControl } from "@/lib/components/ui/form-control";
import { Icon } from "@/lib/components/ui/icon";
import { Input, InputField } from "@/lib/components/ui/input";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useOffer, useUpdateOffer } from "@/lib/hooks/useOffers";
import { CreateOfferData } from "@/lib/types/offer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Image } from "react-native";

type URLParams = {
  id: string;
};

export default function EditOfferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<URLParams>();
  const offerId = params.id as string;

  // Fetch existing offer data
  const { data: offer, isLoading, error } = useOffer(offerId);
  const updateOfferMutation = useUpdateOffer();

  // Initialize form state
  const [formData, setFormData] = useState<CreateOfferData>({
    title: "",
    price: 0,
    description: "",
    image: "",
    category: "deep-cleaning",
    duration: 2,
    location: "",
    tags: [],
    whatIncluded: [],
    requirements: [],
  });

  // Update form data when offer is loaded
  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title,
        price: offer.price,
        description: offer.description,
        image: offer.image,
        category: offer.category,
        duration: offer.duration,
        location: offer.location || "",
        tags: offer.tags || [],
        whatIncluded: offer.whatIncluded,
        requirements: offer.requirements || [],
      });
    }
  }, [offer]);

  const handleSave = async () => {
    if (!offer) return;

    try {
      await updateOfferMutation.mutateAsync({
        offerId,
        data: formData,
      });

      Alert.alert("Success", "Offer updated successfully!");
      router.back();
    } catch {
      Alert.alert("Error", "Failed to update offer. Please try again.");
    }
  };

  const handleImagePicker = () => {
    // TODO: Implement image picker functionality
    Alert.alert("Image Picker", "Image picker functionality coming soon!");
  };

  // Show loading state
  if (isLoading) {
    return (
      <ScrollableScreen addTopInset={false} addBottomInset={false}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading offer...</Text>
        </Box>
      </ScrollableScreen>
    );
  }

  // Show error state
  if (error || !offer) {
    return (
      <ScrollableScreen addTopInset={false} addBottomInset={false}>
        <Box className="flex-1 items-center justify-center">
          <Text className="text-red-500">Failed to load offer</Text>
          <Button onPress={() => router.back()} className="mt-4">
            <ButtonText>Go Back</ButtonText>
          </Button>
        </Box>
      </ScrollableScreen>
    );
  }

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <VStack className="gap-3">
          <PrimaryButton
            onPress={handleSave}
            disabled={updateOfferMutation.isPending}
          >
            {updateOfferMutation.isPending ? "Saving..." : "Save Changes"}
          </PrimaryButton>

          <DangerOutlineButton onPress={() => router.back()}>
            Cancel
          </DangerOutlineButton>
        </VStack>
      }
    >
      <Box>
        {/* Image Upload */}
        <VStack className="gap-2 mb-6">
          <Text className="text-lg font-inter-semibold text-gray-900">
            Offer Image
          </Text>
          <Pressable onPress={handleImagePicker}>
            <Box className="relative">
              <Image
                source={{ uri: formData.image }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 16,
                  backgroundColor: "#f0f0f0",
                }}
              />
              <Box className="absolute top-4 right-4 bg-white/80 p-2 rounded-full">
                <Icon as={Camera} className="text-gray-600" size="xl" />
              </Box>
            </Box>
          </Pressable>
        </VStack>

        {/* Form Fields */}
        <VStack className="gap-3">
          {/* Title */}
          <FormControl>
            <Text className="text-base font-inter-semibold text-gray-900 mb-2">
              Service Title
            </Text>
            <Input>
              <InputField
                value={formData.title}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, title: text }))
                }
                placeholder="Enter service title"
                className="flex-1 text-base text-gray-900"
              />
            </Input>
          </FormControl>

          {/* Price */}
          <FormControl>
            <Text className="text-base font-inter-semibold text-gray-900 mb-2">
              Price ($)
            </Text>
            <Input>
              <InputField
                value={formData.price.toString()}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: Number(text) || 0,
                  }))
                }
                placeholder="Enter price"
                keyboardType="numeric"
                className="flex-1 text-base text-gray-900"
              />
            </Input>
          </FormControl>

          {/* Duration */}
          <FormControl>
            <Text className="text-base font-inter-semibold text-gray-900 mb-2">
              Duration (hours)
            </Text>
            <Input>
              <InputField
                value={formData.duration.toString()}
                onChangeText={(text) =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: Number(text) || 1,
                  }))
                }
                placeholder="Enter duration in hours"
                keyboardType="numeric"
                className="flex-1 text-base text-gray-900"
              />
            </Input>
          </FormControl>

          {/* Location */}
          <FormControl>
            <Text className="text-base font-inter-semibold text-gray-900 mb-2">
              Location
            </Text>
            <Input>
              <InputField
                value={formData.location}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, location: text }))
                }
                placeholder="Enter service location"
                className="flex-1 text-base text-gray-900"
              />
            </Input>
          </FormControl>

          {/* Description */}
          <FormControl>
            <Text className="text-base font-inter-semibold text-gray-900 mb-2">
              Description
            </Text>
            <Input>
              <InputField
                value={formData.description}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, description: text }))
                }
                placeholder="Enter service description"
                className="text-base text-gray-900"
                multiline
                numberOfLines={4}
              />
            </Input>
          </FormControl>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
