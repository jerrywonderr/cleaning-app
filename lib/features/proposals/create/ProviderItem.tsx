import { Avatar } from "@/lib/components/ui/avatar";
import { HStack } from "@/lib/components/ui/hstack";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { ServiceProviderResult } from "@/lib/types";
import { cn } from "@/lib/utils/style";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import { Rating } from "react-native-ratings";
import { ScheduleGrid } from "./ScheduleGrid";

interface ProviderItemProps {
  provider: ServiceProviderResult;
  isSelected: boolean;
  onSelect: () => void;
}

export const ProviderItem = ({
  provider,
  isSelected,
  onSelect,
}: ProviderItemProps) => (
  <Pressable onPress={onSelect}>
    <VStack
      className={cn("gap-5 p-4", isSelected ? "bg-brand-50" : "bg-white")}
    >
      <HStack className="gap-4">
        <VStack className="items-center">
          <Avatar className="w-16 h-16 border-2 border-white shadow-soft-1">
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
                <Text className="text-white/80 font-inter-bold text-xl">
                  {provider.profile.firstName[0]}
                  {provider.profile.lastName[0]}
                </Text>
              </LinearGradient>
            )}
          </Avatar>
        </VStack>

        <VStack className="flex-1 gap-3">
          <HStack className="items-center justify-between">
            <VStack className="gap-1">
              <Text className="text-gray-900 font-inter-bold text-lg">
                {provider.profile.firstName} {provider.profile.lastName}
              </Text>
              <HStack className="items-center gap-2">
                <HStack className="items-center gap-1 px-2 py-1 bg-brand-50 rounded-full">
                  <Text className="text-brand-600 text-sm">💼</Text>
                  <Text className="text-brand-700 text-sm font-inter-medium">
                    {provider.totalJobs || 0} jobs
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </HStack>

      <ScheduleGrid schedule={provider.workingPreferences?.workingSchedule} />

      <HStack className="items-center justify-between gap-2">
        <HStack className="items-center gap-2">
          <Text className="text-brand-500">📍</Text>
          <Text className="text-gray-600 text-sm font-inter-medium">
            {Math.round(provider.distance / 1000)}km away
          </Text>
        </HStack>
        <Rating
          type="star"
          startingValue={provider.rating || 0}
          imageSize={16}
          readonly={true}
          ratingColor="#fbbf24"
          ratingBackgroundColor="transparent"
          tintColor="transparent"
          fractions={2}
          showRating={false}
        />
      </HStack>
    </VStack>
  </Pressable>
);
