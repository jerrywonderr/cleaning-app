import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { formatNaira } from "@/lib/utils/formatNaira";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Clock, Edit, MapPin } from "lucide-react-native";
import { Image } from "react-native";

export default function OfferDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Parse the offer data from route params
  const offer = {
    title: params.title as string,
    price: Number(params.price),
    provider: params.provider as string,
    description: params.description as string,
    image: params.image as string,
  };

  const handleEditOffer = () => {
    router.push({
      pathname: "/service-provider/edit-offer",
      params: offer,
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollableScreen addTopInset={true} addBottomInset={true}>
        <Box className="mb-3">
          {/* Header */}
          <HStack className="flex-row justify-between items-center mb-6 pt-4">
            <Pressable onPress={() => router.back()}>
              <Box className="bg-gray-100 p-2 rounded-full">
                <Icon as={ArrowLeft} className="text-gray-600" size="lg" />
              </Box>
            </Pressable>
            <Text className="text-xl font-inter-bold">Offer Details</Text>
            <Pressable onPress={handleEditOffer}>
              <Box className="bg-brand-500 p-2 rounded-full">
                <Icon as={Edit} className="text-white" size="lg" />
              </Box>
            </Pressable>
          </HStack>

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
                Estimated duration: 2-3 hours
              </Text>
            </HStack>
          </VStack>

          {/* Description */}
          <VStack className="gap-2 mb-6">
            <Text className="text-lg font-inter-semibold text-gray-900">
              Description
            </Text>
            <Text className="text-base text-gray-700 leading-6">
              {offer.description}
            </Text>
            <Text className="text-base text-gray-700 leading-6">
              Our professional cleaning service includes deep cleaning of all
              rooms, kitchen appliances, bathroom sanitization, and floor care.
              We use eco-friendly products that are safe for your family and
              pets.
            </Text>
          </VStack>

          {/* What's Included */}
          <VStack className="gap-2 mb-6">
            <Text className="text-lg font-inter-semibold text-gray-900">
              What&apos;s Included
            </Text>
            <VStack className="gap-1">
              {[
                "Complete room cleaning",
                "Kitchen deep clean",
                "Bathroom sanitization",
                "Floor mopping and vacuuming",
                "Eco-friendly cleaning products",
                "Professional cleaning equipment",
              ].map((item, index) => (
                <HStack key={index} className="items-center gap-2">
                  <Box className="w-2 h-2 bg-brand-500 rounded-full" />
                  <Text className="text-base text-gray-700">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>

          {/* Action Buttons */}
          <VStack className="gap-2">
            <Button
              onPress={handleEditOffer}
              className="rounded-xl bg-brand-500"
            >
              <ButtonText className="text-lg">Edit Offer</ButtonText>
            </Button>

            <Button variant="outline" className="rounded-xl border-red-600">
              <ButtonText className="text-red-600 text-lg ">
                Delete Offer
              </ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollableScreen>
    </>
  );
}
