import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { FormControl } from "@/lib/components/ui/form-control";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Input, InputField } from "@/lib/components/ui/input";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import serviceCategoryOptions from "@/lib/constants/service-category";
import { useCreateOffer } from "@/lib/hooks/useOffers";
import { CreateOfferData } from "@/lib/types/offer";
import { useRouter } from "expo-router";
import { Camera, Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, ScrollView } from "react-native";

export default function CreateOfferScreen() {
  const router = useRouter();
  const createOfferMutation = useCreateOffer();

  // Initialize form state
  const [formData, setFormData] = useState<CreateOfferData>({
    title: "",
    price: 0,
    description: "",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop", // Default image
    category: "deep-cleaning",
    duration: 2,
    location: "",
    tags: [],
    whatIncluded: [],
    requirements: [],
  });

  // Form validation
  const isFormValid =
    formData.title.trim() &&
    formData.price > 0 &&
    formData.description.trim() &&
    formData.duration > 0;

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    try {
      await createOfferMutation.mutateAsync(formData);
      Alert.alert("Success", "Offer created successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create offer. Please try again.");
    }
  };

  const handleImagePicker = () => {
    // TODO: Implement image picker functionality
    Alert.alert("Image Picker", "Image picker functionality coming soon!");
  };

  const addWhatIncluded = () => {
    Alert.prompt("Add Service Item", "What's included in this service?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add",
        onPress: (text) => {
          if (text && text.trim()) {
            setFormData((prev) => ({
              ...prev,
              whatIncluded: [...(prev.whatIncluded || []), text.trim()],
            }));
          }
        },
      },
    ]);
  };

  const removeWhatIncluded = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      whatIncluded: (prev.whatIncluded || []).filter((_, i) => i !== index),
    }));
  };

  const addRequirement = () => {
    Alert.prompt("Add Requirement", "What does the customer need to prepare?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Add",
        onPress: (text) => {
          if (text && text.trim()) {
            setFormData((prev) => ({
              ...prev,
              requirements: [...(prev.requirements || []), text.trim()],
            }));
          }
        },
      },
    ]);
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: (prev.requirements || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <FixedScreen addTopInset={false} addBottomInset={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                Service Title *
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

            {/* Category */}
            <FormControl>
              <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                Service Category *
              </Text>
              <Input>
                <InputField
                  value={
                    serviceCategoryOptions.find(
                      (c) => c.value === formData.category
                    )?.label || ""
                  }
                  onPressIn={() => {
                    // TODO: Implement category picker
                    Alert.alert(
                      "Category Picker",
                      "Category picker coming soon!"
                    );
                  }}
                  placeholder="Select service category"
                  className="flex-1 text-base text-gray-900"
                  editable={false}
                />
              </Input>
            </FormControl>

            {/* Price */}
            <FormControl>
              <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                Price (₦) *
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
                Duration (hours) *
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
                Description *
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

            {/* What's Included */}
            <FormControl>
              <HStack className="justify-between items-center mb-2">
                <Text className="text-base font-inter-semibold text-gray-900">
                  What&apos;s Included
                </Text>
                <Pressable onPress={addWhatIncluded}>
                  <Box className="bg-brand-500 p-2 rounded-full">
                    <Icon as={Plus} className="text-white" size="sm" />
                  </Box>
                </Pressable>
              </HStack>
              <VStack className="gap-2">
                {(formData.whatIncluded || []).map((item, index) => (
                  <HStack
                    key={index}
                    className="items-center gap-2 bg-gray-50 p-3 rounded-lg"
                  >
                    <Text className="flex-1 text-gray-700">{item}</Text>
                    <Pressable onPress={() => removeWhatIncluded(index)}>
                      <Box className="bg-red-100 p-1 rounded-full">
                        <Icon as={X} className="text-red-600" size="sm" />
                      </Box>
                    </Pressable>
                  </HStack>
                ))}
                {(formData.whatIncluded || []).length === 0 && (
                  <Text className="text-gray-500 text-sm italic">
                    No items added yet. Tap the + button to add services.
                  </Text>
                )}
              </VStack>
            </FormControl>

            {/* Requirements */}
            <FormControl>
              <HStack className="justify-between items-center mb-2">
                <Text className="text-base font-inter-semibold text-gray-900">
                  Customer Requirements
                </Text>
                <Pressable onPress={addRequirement}>
                  <Box className="bg-brand-500 p-2 rounded-full">
                    <Icon as={Plus} className="text-white" size="sm" />
                  </Box>
                </Pressable>
              </HStack>
              <VStack className="gap-2">
                {(formData.requirements || []).map((item, index) => (
                  <HStack
                    key={index}
                    className="items-center gap-2 bg-gray-50 p-3 rounded-lg"
                  >
                    <Text className="flex-1 text-gray-700">{item}</Text>
                    <Pressable onPress={() => removeRequirement(index)}>
                      <Box className="bg-red-100 p-1 rounded-full">
                        <Icon as={X} className="text-red-600" size="sm" />
                      </Box>
                    </Pressable>
                  </HStack>
                ))}
                {(formData.requirements || []).length === 0 && (
                  <Text className="text-gray-500 text-sm italic">
                    No requirements added yet. Tap the + button to add
                    requirements.
                  </Text>
                )}
              </VStack>
            </FormControl>
          </VStack>
        </Box>
      </ScrollView>
      {/* Action Buttons */}
      <VStack className="gap-3 mt-8 mb-6 px-4">
        <Button
          onPress={handleSave}
          className="rounded-xl bg-brand-500"
          disabled={!isFormValid || createOfferMutation.isPending}
        >
          <ButtonText className="text-lg">
            {createOfferMutation.isPending ? "Creating..." : "Create Offer"}
          </ButtonText>
        </Button>

        <Button
          variant="outline"
          onPress={() => router.back()}
          className="rounded-xl border-gray-400"
        >
          <ButtonText className="text-gray-600 text-lg">Cancel</ButtonText>
        </Button>
      </VStack>
    </FixedScreen>
  );
}
