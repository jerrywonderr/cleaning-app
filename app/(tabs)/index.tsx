import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "expo-router";
import { Bell, Info, Send, WashingMachine } from "lucide-react-native";
import React from "react";
import { Dimensions, Image as RNImage } from "react-native";
import Carousel from "react-native-reanimated-carousel";

export default function HomeScreen() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const hasNotification = true;

  return (
    <ScrollableScreen addTopInset={true}>
      <Box className=" pb-10">
        {/* Header */}
        <HStack className="flex-row justify-between items-center">
          <VStack>
            <Text className="text-2xl font-bold mt-8 mb-6 text-left">
              Hello, Kay!
            </Text>
          </VStack>
          <HStack className="flex-row gap-3">
            <Pressable>
              <Box className="relative">
                <Box className="bg-[#e3e5f4] p-2.5 rounded-xl">
                  <Icon className="" as={Bell} />
                </Box>

                {hasNotification && (
                  <Box className="absolute top-2 right-2 w-2 h-2 bg-red-500" />
                )}
              </Box>
            </Pressable>
            <Pressable>
              <Box className="bg-[#e3e5f4] p-2.5 rounded-xl">
                <Icon className="" as={Info} />
              </Box>
            </Pressable>
          </HStack>
        </HStack>

        {/* Address Card */}
        <Box className="bg-[#454eb0] p-3 rounded-xl mb-4">
          <HStack className="flex-row items-center gap-3">
            <Box className="bg-white p-2 rounded-full">
              <Icon className="" as={Send} />
            </Box>
            <VStack>
              <Text className="text-white font-bold">Home</Text>
              <Text className="text-white text-xs">
                123, Victoria Road Brighton East United Kingdom
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Offers */}
        <Text className="font-medium text-lg mb-2 text-gray-800">
          Latest Offers
        </Text>
        <Box className="mb-6">
          <Carousel
            loop
            autoPlay
            width={Dimensions.get("window").width - 32}
            height={180}
            data={[
              { uri: "https://source.unsplash.com/800x400/?cleaning" },
              { uri: "https://source.unsplash.com/800x400/?laundry" },
              { uri: "https://source.unsplash.com/800x400/?housekeeping" },
            ]}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Box className="rounded-xl overflow-hidden">
                <RNImage
                  source={{ uri: item.uri }}
                  style={{ width: "100%", height: 180 }}
                  resizeMode="cover"
                />
              </Box>
            )}
          />
        </Box>

        {/* Tasks */}
        <Text className="font-medium text-lg mb-2 text-gray-800">
          What do you want to get done today?
        </Text>
        <HStack className="flex-row gap-3 mb-6">
          <Pressable className="flex-1">
            <Box className="p-4 bg-gray-100 rounded-lg gap-2 shadow shadow-black/5 items-start">
              <WashingMachine size={28} color="#4F46E5" />
              <Text className="font-medium mt-2 text-gray-800">Clean</Text>
              <Text className="text-start text-sm text-gray-500">
                Schedule your end of tenancy cleaning.
              </Text>
            </Box>
          </Pressable>

          <Pressable className="flex-1">
            <Box className="p-4 bg-gray-100 rounded-lg gap-2 shadow shadow-black/5 items-start">
              <WashingMachine size={28} color="#4F46E5" />
              <Text className="font-medium mt-2 text-gray-800">Clean</Text>
              <Text className="text-start text-sm text-gray-500">
                Experience quick deep classic cleaning.
              </Text>
            </Box>
          </Pressable>
        </HStack>

        {/* Ongoing Orders */}
        <Text className="font-medium text-lg mb-2 text-gray-800">
          Ongoing Orders
        </Text>
        <VStack className="gap-3 mb-10">
          {[
            { label: "Washing machine 4", time: "3 mins left" },
            { label: "Washing machine 12", time: "7 mins left" },
            { label: "Washing machine 2", time: "14 mins left" },
            { label: "Washing machine 8", time: "18 mins left" },
            { label: "Washing machine 3", time: "24 mins left" },
            { label: "Washing machine 15", time: "38 mins left" },
            { label: "Washing machine 1", time: "47 mins left" },
            { label: "Washing machine 10", time: "52 mins left" },
            { label: "Washing machine 9", time: "73 mins left" },
            { label: "Washing machine 11", time: "90 mins left" },
          ].map((order, index) => (
            <HStack
              key={index}
              className="flex-row justify-between items-center  bg-gray-200 p-4 rounded-lg"
            >
              <HStack className="flex-row items-center gap-2">
                <WashingMachine size={18} color="#4F46E5" />
                <Text>{order.label}</Text>
              </HStack>
              <Text className="text-sm text-blue-600">{order.time}</Text>
            </HStack>
          ))}
        </VStack>

        {/* Logout Button
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-red-100 py-3 rounded-lg"
        >
          <LogOut size={18} color="#DC2626" />
          <Text className="ml-2 font-semibold text-red-600">Logout</Text>
        </Pressable> */}
      </Box>
    </ScrollableScreen>
  );
}
