import {
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import serviceCategoryOptions from "@/lib/constants/service-category";
import { useCurrentUser } from "@/lib/hooks/useAuth";
import { useCreateOffer, useUpdateOffer } from "@/lib/hooks/useOffers";
import { StorageService } from "@/lib/services/storageService";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert, Image } from "react-native";

const durationOptions = [
  { label: "1 hour", value: 1 },
  { label: "2 hours", value: 2 },
  { label: "3 hours", value: 3 },
  { label: "4 hours", value: 4 },
  { label: "5 hours", value: 5 },
  { label: "6 hours", value: 6 },
  { label: "8 hours", value: 8 },
  { label: "10 hours", value: 10 },
  { label: "12 hours", value: 12 },
  { label: "24 hours", value: 24 },
];

export default function ReviewStep() {
  const { watch, handleSubmit } = useFormContext();
  const formData = watch();
  const createOfferMutation = useCreateOffer();
  const updateOfferMutation = useUpdateOffer();
  const [isUploading, setIsUploading] = useState(false);
  const { data: currentUser } = useCurrentUser();

  // Create AbortController for cancelling operations
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup effect to abort operations when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const getCategoryLabel = (value: string) => {
    return (
      serviceCategoryOptions.find((c) => c.value === value)?.label || value
    );
  };

  const getDurationLabel = (value: number) => {
    return (
      durationOptions.find((d) => d.value === value)?.label || `${value} hours`
    );
  };

  const onSubmit = async (data: any) => {
    try {
      setIsUploading(true);

      // Create new AbortController for this operation
      abortControllerRef.current = new AbortController();

      // Test storage connection first
      const isStorageConnected = await StorageService.testStorageConnection();
      if (!isStorageConnected) {
        throw new Error("Firebase Storage is not accessible");
      }

      // Create the offer first to get the real offer ID
      const offerData = {
        ...data,
        // For now, use the local image URI
        // We'll upload it to Firebase Storage after offer creation
      };

      const createdOffer = await createOfferMutation.mutateAsync(offerData);

      // Now upload the image to Firebase Storage with the real offer ID
      if (data.image && !data.image.startsWith("http")) {
        try {
          const imageUrl = await StorageService.uploadOfferImage(
            data.image,
            createdOffer.id, // Use the real offer ID
            undefined,
            "main",
            currentUser?.uid
          );

          // Update the offer with the Firebase Storage image URL
          await updateOfferMutation.mutateAsync({
            offerId: createdOffer.id,
            data: { image: imageUrl },
          });

          console.log(
            "Image uploaded and offer updated successfully:",
            imageUrl
          );
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          // Don't fail the entire operation, just log the error
          // The offer was created successfully, just without the image
        }
      }

      Alert.alert("Success", "Offer created successfully!");
      router.back();
    } catch (error) {
      console.error("Offer creation failed:", error);
      Alert.alert("Error", "Failed to create offer. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <VStack className="gap-3">
          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            disabled={createOfferMutation.isPending || isUploading}
          >
            {isUploading
              ? "Uploading Image..."
              : createOfferMutation.isPending
              ? "Creating..."
              : "Create Offer"}
          </PrimaryButton>
          <PrimaryOutlineButton
            onPress={() => {
              // Abort any ongoing operations
              if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
              }
              router.back();
            }}
          >
            Back
          </PrimaryOutlineButton>
        </VStack>
      }
    >
      <StepIndicator steps={4} currentStep={4} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-6">
          <Text className="text-xl font-inter-semibold text-gray-900">
            Review Your Offer
          </Text>

          {/* Basic Info Review */}
          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-gray-800">
              Basic Information
            </Text>

            <Box className="bg-gray-50 p-4 rounded-lg">
              <Image
                source={{ uri: formData.image }}
                style={{
                  width: "100%",
                  height: 150,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              />
              <VStack className="gap-2">
                <Text className="text-base font-inter-medium">
                  <Text className="text-gray-600">Title: </Text>
                  {formData.title}
                </Text>
                <Text className="text-base font-inter-medium">
                  <Text className="text-gray-600">Category: </Text>
                  {getCategoryLabel(formData.category)}
                </Text>
                <Text className="text-base font-inter-medium">
                  <Text className="text-gray-600">Description: </Text>
                  {formData.description}
                </Text>
              </VStack>
            </Box>
          </VStack>

          {/* Service Details Review */}
          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-gray-800">
              Service Details
            </Text>

            <Box className="bg-gray-50 p-4 rounded-lg">
              <VStack className="gap-2">
                <Text className="text-base font-inter-medium">
                  <Text className="text-gray-600">Price: </Text>₦
                  {formData.price}
                </Text>
                <Text className="text-base font-inter-medium">
                  <Text className="text-gray-600">Duration: </Text>
                  {getDurationLabel(formData.duration)}
                </Text>
              </VStack>
            </Box>
          </VStack>

          {/* Service Content Review */}
          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-gray-800">
              Service Content
            </Text>

            <Box className="bg-gray-50 p-4 rounded-lg">
              <VStack className="gap-4">
                {/* What's Included */}
                <VStack className="gap-2">
                  <Text className="text-base font-inter-medium text-gray-800">
                    What&apos;s Included:
                  </Text>
                  {(formData.whatIncluded || []).length > 0 ? (
                    <VStack className="gap-1">
                      {(formData.whatIncluded || []).map(
                        (item: string, index: number) => (
                          <Text
                            key={index}
                            className="text-sm text-gray-700 ml-4"
                          >
                            • {item}
                          </Text>
                        )
                      )}
                    </VStack>
                  ) : (
                    <Text className="text-sm text-gray-500 italic ml-4">
                      No items added
                    </Text>
                  )}
                </VStack>

                {/* Requirements */}
                <VStack className="gap-2">
                  <Text className="text-base font-inter-medium text-gray-800">
                    Customer Requirements:
                  </Text>
                  {(formData.requirements || []).length > 0 ? (
                    <VStack className="gap-1">
                      {(formData.requirements || []).map(
                        (item: string, index: number) => (
                          <Text
                            key={index}
                            className="text-sm text-gray-700 ml-4"
                          >
                            • {item}
                          </Text>
                        )
                      )}
                    </VStack>
                  ) : (
                    <Text className="text-sm text-gray-500 italic ml-4">
                      No requirements added
                    </Text>
                  )}
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
