import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { FormControl } from "@/lib/components/ui/form-control";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Input, InputField } from "@/lib/components/ui/input";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Camera } from "lucide-react-native";
import { useState } from "react";
import { Image } from "react-native";

export default function EditOfferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Initialize form state with existing offer data
  const [formData, setFormData] = useState({
    title: (params.title as string) || "",
    price: params.price ? Number(params.price) : 0,
    provider: (params.provider as string) || "",
    description: (params.description as string) || "",
    image: (params.image as string) || "",
  });

  const handleSave = () => {
    console.log("Saving offer:", formData);

    router.back();
  };

  const handleImagePicker = () => {
    console.log("Open image picker");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollableScreen addTopInset={true} addBottomInset={false}>
        <Box>
          {/* Header */}
          <HStack className="flex-row justify-between items-center mb-6 pt-4">
            <Pressable onPress={() => router.back()}>
              <Box className="bg-gray-100 p-2 rounded-full">
                <Icon as={ArrowLeft} className="text-gray-600" size="sm" />
              </Box>
            </Pressable>
            <Text className="text-xl font-inter-bold">Edit Offer</Text>
            <Box className="w-8" />
          </HStack>

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
                Price (₦)
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

            {/* Provider */}
            <FormControl>
              <Text className="text-base font-inter-semibold text-gray-900 mb-2">
                Provider Name
              </Text>
              <Input>
                <InputField
                  value={formData.provider}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, provider: text }))
                  }
                  placeholder="Enter provider name"
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
                />
              </Input>
            </FormControl>
          </VStack>

          {/* Action Buttons */}

          <VStack className="gap-3 mt-8">
            <Button onPress={handleSave} className="rounded-xl bg-brand-500">
              <ButtonText className="text-lg">Save Changes</ButtonText>
            </Button>

            <Button
              variant="outline"
              onPress={() => router.back()}
              className="rounded-xl border-red-600"
            >
              <ButtonText className="text-red-600 text-lg ">Cancel</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollableScreen>
    </>
  );
}
