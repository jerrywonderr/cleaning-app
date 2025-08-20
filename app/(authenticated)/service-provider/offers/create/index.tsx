import { PrimaryButton } from "@/lib/components/custom-buttons";
import { PickerField, TextField } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import serviceCategoryOptions from "@/lib/constants/service-category";
import { CreateOfferFormData } from "@/lib/schemas/create-offer";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Camera } from "lucide-react-native";
import { useFormContext } from "react-hook-form";
import { Alert, Image } from "react-native";

export default function BasicInfoStep() {
  const { watch, setValue } = useFormContext<CreateOfferFormData>();
  const formData = watch();

  const handleImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setValue("image", uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const isStepValid =
    formData.title?.trim() &&
    formData.category &&
    formData.description?.trim() &&
    formData.image;

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={() =>
            router.push("/service-provider/offers/create/service-details")
          }
          disabled={!isStepValid}
        >
          Next
        </PrimaryButton>
      }
    >
      <StepIndicator steps={4} currentStep={1} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-6">
          {/* Image Upload */}
          <VStack className="gap-2">
            <Text className="text-base font-inter-semibold text-gray-900">
              Service Image *
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

          {/* Basic Info Fields */}
          <VStack className="gap-4">
            <TextField
              name="title"
              label="Service Title *"
              placeholder="Enter service title"
            />

            <PickerField
              name="category"
              label="Service Category *"
              items={serviceCategoryOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              placeholder="Select service category"
              helperText="Choose the type of cleaning service"
            />

            <TextField
              name="description"
              label="Description *"
              placeholder="Enter service description"
              multiline
              numberOfLines={4}
              helperText="Describe what this service includes"
            />
          </VStack>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
