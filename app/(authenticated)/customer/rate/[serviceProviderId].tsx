import {
  PrimaryButton,
  PrimaryOutlineButton,
} from "@/lib/components/custom-buttons";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { useLoader } from "@/lib/components/ui/loader";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useUserProfile, useUserType } from "@/lib/hooks/useAuth";
import { useCreateRating } from "@/lib/hooks/useServiceRequests";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, TextInput } from "react-native";

export default function RateServiceProviderScreen() {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const params = useLocalSearchParams<{ serviceProviderId: string }>();
  const serviceProviderId = params.serviceProviderId as string;
  const { profile } = useUserType();

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  // Fetch provider data directly
  const {
    data: provider,
    isLoading,
    error,
  } = useUserProfile(serviceProviderId);

  const createRatingMutation = useCreateRating();

  const handleSubmitRating = async () => {
    if (!provider || !profile) return;

    try {
      showLoader();
      await createRatingMutation.mutateAsync({
        customerId: profile.id,
        providerId: serviceProviderId,
        rating,
        review: review.trim() || "",
      });

      Alert.alert(
        "Thank you!",
        "Your rating has been submitted successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", `Failed to submit rating: ${error.message}`);
    } finally {
      hideLoader();
    }
  };

  if (isLoading) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text>Loading provider details...</Text>
        </Box>
      </FixedScreen>
    );
  }

  if (error || !provider) {
    return (
      <FixedScreen addTopInset={false} addBottomInset={true}>
        <Box className="flex-1 items-center justify-center">
          <Text className="text-red-500">Failed to load provider details</Text>
          <PrimaryButton onPress={() => router.back()} className="mt-4">
            Go Back
          </PrimaryButton>
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
        <HStack className="gap-3">
          <Box className="flex-1">
            <PrimaryButton onPress={handleSubmitRating}>
              Submit Rating
            </PrimaryButton>
          </Box>

          <PrimaryOutlineButton onPress={() => router.back()}>
            Cancel
          </PrimaryOutlineButton>
        </HStack>
      }
    >
      <VStack className="flex-1 py-4 gap-6">
        {/* Header */}
        <VStack className="gap-2 px-4">
          <Text className="text-2xl font-inter-bold text-gray-900">
            Rate Service Provider
          </Text>
          <Text className="text-base text-gray-600">
            How was your experience with {provider.firstName}{" "}
            {provider.lastName}?
          </Text>
        </VStack>

        {/* Rating Section */}
        <Box className="bg-white p-4 rounded-xl shadow-sm mx-4">
          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-gray-900">
              Overall Rating
            </Text>

            {/* Star Rating */}
            <HStack className="justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setRating(star)}
                  className="p-2"
                >
                  <Icon
                    as={Star}
                    size="xl"
                    className={
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }
                  />
                </Pressable>
              ))}
            </HStack>

            <Text className="text-center text-gray-600">
              {rating} star{rating !== 1 ? "s" : ""} -{" "}
              {rating === 1
                ? "Poor"
                : rating === 2
                ? "Fair"
                : rating === 3
                ? "Good"
                : rating === 4
                ? "Very Good"
                : "Excellent"}
            </Text>
          </VStack>
        </Box>

        {/* Review Section */}
        <Box className="bg-white p-4 rounded-xl shadow-sm mx-4">
          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-gray-900">
              Write a Review (Optional)
            </Text>

            <TextInput
              value={review}
              onChangeText={setReview}
              placeholder="Tell others about your experience with this service provider..."
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg p-3 text-base min-h-[100px]"
              textAlignVertical="top"
            />

            <Text className="text-sm text-gray-500">
              {review.length}/500 characters
            </Text>
          </VStack>
        </Box>

        {/* Provider Info */}
        <Box className="bg-white p-4 rounded-xl shadow-sm mx-4">
          <VStack className="gap-3">
            <Text className="text-lg font-inter-semibold text-gray-900">
              Service Provider
            </Text>
            <HStack className="items-center gap-3">
              <Box className="w-12 h-12 bg-brand-100 rounded-full items-center justify-center">
                <Text className="text-brand-600 font-inter-bold text-lg">
                  {provider.firstName?.[0]}
                  {provider.lastName?.[0]}
                </Text>
              </Box>
              <VStack className="flex-1">
                <Text className="text-lg font-inter-semibold text-gray-900">
                  {provider.firstName} {provider.lastName}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </FootedScrollableScreen>
  );
}
