import BaseBottomSheet from "@/lib/components/BaseBottomSheet";
import { PrimaryButton } from "@/lib/components/custom-buttons";
import ExtraServiceOptionCard from "@/lib/components/ExtraServiceOptionCard";
import ServiceCard from "@/lib/components/ServiceCard";
import { Avatar } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  extraServiceOptions,
  serviceConfigs,
} from "@/lib/constants/service-config";
import { ServiceProviderResult } from "@/lib/types";
import { LinearGradient } from "expo-linear-gradient";
import { forwardRef } from "react";
import { Image, ScrollView } from "react-native";
import { Rating } from "react-native-ratings";
import { WorkingHoursSection } from "./WorkingHoursSection";

interface ProviderProfileSheetProps {
  provider: ServiceProviderResult;
  onBookProvider?: () => void;
}

export const ProviderProfileSheet = forwardRef<any, ProviderProfileSheetProps>(
  ({ provider, onBookProvider }, ref) => {
    const enabledServices = serviceConfigs.filter(
      (service) =>
        provider.services[service.id as keyof typeof provider.services]
    );

    const enabledExtraOptions = extraServiceOptions.filter(
      (option) =>
        provider.extraOptions[option.id as keyof typeof provider.extraOptions]
    );

    return (
      <BaseBottomSheet
        ref={ref}
        snapPoints={["90%"]}
        index={0}
        enablePanDownToClose
        containerStyle={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <VStack className="gap-6 pb-6">
            {/* Header Section */}
            <VStack className="items-center gap-4 py-6">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                {provider.profile.profileImage ? (
                  <Image
                    source={{ uri: provider.profile.profileImage }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <LinearGradient
                    colors={["#8B5CF6", "#A855F7", "#C084FC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text className="text-white font-inter-bold text-xl">
                      {provider.profile.firstName[0]}
                      {provider.profile.lastName[0]}
                    </Text>
                  </LinearGradient>
                )}
              </Avatar>

              <VStack className="items-center gap-2">
                <Text className="text-xl font-inter-bold text-gray-900">
                  {provider.profile.firstName} {provider.profile.lastName}
                </Text>
                <HStack className="items-center gap-2">
                  <Rating
                    type="star"
                    ratingCount={5}
                    startingValue={provider.rating || 0}
                    imageSize={18}
                    readonly={true}
                    ratingColor="#fbbf24"
                    ratingBackgroundColor="#0000"
                    // tintColor="transparent"
                    fractions={2}
                    showRating={false}
                  />
                </HStack>
                <HStack className="items-center gap-2">
                  <HStack className="items-center gap-1">
                    <Text className="text-brand-500">📍</Text>
                    <Text className="text-gray-600 text-sm">
                      {Math.round(provider.distance / 1000)}km away
                    </Text>
                  </HStack>
                  <Text className="text-gray-600 text-sm">
                    ({provider.totalJobs} jobs)
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            {/* Contact Information */}
            <Box className="bg-gray-50 rounded-lg p-4">
              <VStack className="gap-3">
                <Text className="text-base font-inter-semibold text-gray-900">
                  Contact Information
                </Text>
                <VStack className="gap-2">
                  <HStack className="items-center gap-3">
                    <Text className="text-gray-500">📧</Text>
                    <Text className="text-gray-700 text-sm">
                      {/* {provider.profile.email} */}
                      jerrycul2001@gmail.com
                    </Text>
                  </HStack>
                  <HStack className="items-center gap-3">
                    <Text className="text-gray-500">📱</Text>
                    <Text className="text-gray-700 text-sm">
                      {provider.profile.phone}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Box>

            {/* Services Section */}
            <VStack className="gap-3">
              <Text className="text-base font-inter-semibold text-gray-900">
                Available Services
              </Text>
              <Text className="text-xs text-gray-600">
                Main cleaning services offered by this provider
              </Text>
              {enabledServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onToggle={() => {}} // Read-only
                  showToggle={false}
                  showPrice={false}
                />
              ))}
            </VStack>

            {/* Extra Services Section */}
            <VStack className="gap-3">
              <Text className="text-base font-inter-semibold text-gray-900">
                Additional Services
              </Text>
              <Text className="text-xs text-gray-600">
                Extra services that can be added to any cleaning service
              </Text>
              {enabledExtraOptions.map((option) => (
                <ExtraServiceOptionCard
                  key={option.id}
                  option={option}
                  onToggle={() => {}} // Read-only
                  showToggle={false}
                  showPrice={false}
                />
              ))}
            </VStack>

            {/* Working Hours Section */}
            <WorkingHoursSection provider={provider} />

            {/* Reviews Section */}
            <VStack className="gap-3">
              <Text className="text-base font-inter-semibold text-gray-900">
                Recent Reviews
              </Text>
              <VStack className="gap-3">
                {/* Mock reviews */}
                {[
                  {
                    id: "1",
                    customerName: "John Doe",
                    rating: 5,
                    comment:
                      "Excellent service! Sarah was very thorough and professional. Highly recommended!",
                    date: "2 days ago",
                  },
                  {
                    id: "2",
                    customerName: "Jane Smith",
                    rating: 4,
                    comment:
                      "Great cleaning service. Very punctual and the house was spotless after.",
                    date: "1 week ago",
                  },
                ].map((review) => (
                  <Box
                    key={review.id}
                    className="bg-white border border-gray-200 rounded-lg p-3"
                  >
                    <VStack className="gap-2">
                      <HStack className="justify-between items-start">
                        <VStack className="gap-1">
                          <Text className="font-inter-semibold text-gray-900 text-sm">
                            {review.customerName}
                          </Text>
                          <Rating
                            type="star"
                            ratingCount={5}
                            startingValue={review.rating}
                            imageSize={12}
                            readonly={true}
                            ratingColor="#fbbf24"
                            ratingBackgroundColor="#0000"
                            // tintColor="transparent"
                            fractions={0}
                            showRating={false}
                          />
                        </VStack>
                        <Text className="text-gray-500 text-xs">
                          {review.date}
                        </Text>
                      </HStack>
                      <Text className="text-gray-700 text-xs">
                        {review.comment}
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </VStack>

            {/* Action Button */}
            <VStack className="gap-3 pt-4">
              <PrimaryButton onPress={onBookProvider}>
                Book This Provider
              </PrimaryButton>
            </VStack>
          </VStack>
        </ScrollView>
      </BaseBottomSheet>
    );
  }
);

ProviderProfileSheet.displayName = "ProviderProfileSheet";
