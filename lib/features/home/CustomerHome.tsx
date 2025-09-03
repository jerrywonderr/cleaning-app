import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import AppointmentItem from "@/lib/features/appointments/AppointmentItem";
import { useAppointmentsByStatus } from "@/lib/hooks/useAppointments";
import { useUserStore } from "@/lib/store/useUserStore";
import { useRouter } from "expo-router";
import { Bell, Calendar, ChevronRight, Info, Send } from "lucide-react-native";
import React from "react";
import { Image as RNImage, ScrollView } from "react-native";

export default function CustomerHome() {
  const { profile } = useUserStore();
  const router = useRouter();
  const hasNotification = true;

  // Fetch upcoming and ongoing appointments
  const { data: upcomingAppointments = [] } = useAppointmentsByStatus(
    "upcoming",
    "customer"
  );
  const { data: ongoingAppointments = [] } = useAppointmentsByStatus(
    "ongoing",
    "customer"
  );

  return (
    <FixedScreen addTopInset={true} addBottomInset={false}>
      <Box className="mb-4 flex-1">
        {/* Header */}
        <HStack className="flex-row justify-between items-center">
          <VStack>
            <Text className="text-2xl font-inter-bold mt-8 mb-6 text-left">
              Hello, {profile?.firstName || "Customer"}!
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
        <Box className="bg-brand-500 p-3 rounded-xl mb-4">
          <HStack className="flex-row items-center gap-3">
            <Box className="bg-white p-2 rounded-full">
              <Icon className="" as={Send} />
            </Box>
            <VStack>
              <Text className="text-white font-inter-bold">Home</Text>
              <Text className="text-white text-xs">
                123, Victoria Road Brighton East United Kingdom
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Hero Section */}
        <Box className="mb-6 rounded-xl overflow-hidden relative">
          <RNImage
            source={{
              uri: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&h=400&q=80",
            }}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />

          {/* Overlay */}
          <Box
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          />

          {/* Content */}
          <VStack className="absolute inset-0 items-center justify-center px-4">
            <Text className="text-white text-xl font-inter-bold mb-3 text-center">
              What do you want to get done today?
            </Text>
            <Pressable
              onPress={() => router.push("/(authenticated)/customer/proposals")}
              className="bg-white px-5 py-2 rounded-full"
            >
              <Text className="text-brand-500 font-inter-medium">
                Book a Service
              </Text>
            </Pressable>
          </VStack>
        </Box>

        {/* Offers */}
        {/* <Text className="font-inter-medium text-lg mb-2 text-gray-800">
          What do you want to get done today?
        </Text>
        <Box className="mb-6">
          <Carousel
            loop
            autoPlay
            autoPlayInterval={3500}
            width={Dimensions.get("window").width - 32}
            height={180}
            data={[
              {
                uri: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&h=400&q=80",
              },
              {
                uri: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&h=400&q=80",
              },
              {
                uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&h=400&q=80",
              },
            ]}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ item }) => (
              <Box className="rounded-xl overflow-hidden relative">
                <RNImage
                  source={{ uri: item.uri }}
                  style={{ width: "100%", height: 180 }}
                  resizeMode="cover"
                />
                <Box className="absolute bottom-3 left-0 right-0 flex-row justify-center">
                  {[0, 1, 2].map((_, index) => (
                    <Box
                      key={index}
                      className={`mx-1 rounded-full ${
                        index === currentIndex ? "bg-blue-800" : "bg-white/50"
                      }`}
                      style={{
                        width: 6,
                        height: 6,
                        opacity: index === currentIndex ? 1 : 0.7,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          />
        </Box> */}

        {/* Appointments Section */}
        <HStack className="flex-row justify-between items-center mb-3">
          <HStack className="flex-row items-center gap-2">
            <Icon as={Calendar} size="lg" className="text-brand-500" />
            <Text className="font-inter-medium text-lg text-gray-800">
              Appointments
            </Text>
          </HStack>
          <Pressable
            onPress={() =>
              router.push("/(authenticated)/customer/(tabs)/appointments")
            }
            className="flex-row items-center gap-1"
          >
            <Text className="text-brand-500 font-inter-medium text-sm">
              View All
            </Text>
            <Icon as={ChevronRight} size="sm" className="text-brand-500" />
          </Pressable>
        </HStack>

        {/* Tasks */}
        {/* <Text className="font-inter-medium text-lg mb-2 text-gray-800">
          What do you want to get done today?
        </Text>
        <HStack className="flex-row gap-3 mb-6">
          <Pressable className="flex-1">
            <Box className="p-4 bg-gray-100 rounded-lg gap-2 shadow shadow-black/5 items-start">
              <WashingMachine size={28} color="#4F46E5" />
              <Text className="font-inter-medium mt-2 text-gray-800">
                Clean
              </Text>
              <Text className="text-start text-sm text-gray-500">
                Schedule your end of tenancy cleaning.
              </Text>
            </Box>
          </Pressable>

          <Pressable className="flex-1">
            <Box className="p-4 bg-gray-100 rounded-lg gap-2 shadow shadow-black/5 items-start">
              <WashingMachine size={28} color="#4F46E5" />
              <Text className="font-inter-medium mt-2 text-gray-800">
                Clean
              </Text>
              <Text className="text-start text-sm text-gray-500">
                Experience quick deep classic cleaning.
              </Text>
            </Box>
          </Pressable>
        </HStack> */}

        {/* Appointments List */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack className="gap-4">
            {/* Ongoing Appointments */}
            <Box className="mb-4">
              <Box className="bg-white py-2 mb-2">
                <Text className="font-inter-medium text-base text-gray-700">
                  Ongoing ({ongoingAppointments.length})
                </Text>
              </Box>
              {ongoingAppointments.length > 0 ? (
                <VStack className="gap-3">
                  {ongoingAppointments.slice(0, 5).map((appointment) => (
                    <AppointmentItem
                      key={appointment.id}
                      id={appointment.id}
                      date={appointment.scheduledDate.toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                      time={appointment.scheduledTime.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                      client={appointment.serviceType.replace("-", " ")}
                      service={appointment.serviceType}
                      status={appointment.status}
                      onPress={() =>
                        router.push(`/customer/appointments/${appointment.id}`)
                      }
                    />
                  ))}
                </VStack>
              ) : (
                <Box className="bg-gray-50 p-4 rounded-xl items-center">
                  <Text className="text-gray-500 text-center text-sm">
                    No ongoing appointments
                  </Text>
                </Box>
              )}
            </Box>

            {/* Upcoming Appointments */}
            <Box className="mb-4">
              <Box className="bg-white py-2 mb-2">
                <Text className="font-inter-medium text-base text-gray-700">
                  Upcoming ({upcomingAppointments.length})
                </Text>
              </Box>
              {upcomingAppointments.length > 0 ? (
                <VStack className="gap-3">
                  {upcomingAppointments.slice(0, 5).map((appointment) => (
                    <AppointmentItem
                      key={appointment.id}
                      id={appointment.id}
                      date={appointment.scheduledDate.toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )}
                      time={appointment.scheduledTime.toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                      client={appointment.serviceType.replace("-", " ")}
                      service={appointment.serviceType}
                      status={appointment.status}
                      onPress={() =>
                        router.push(`/customer/appointments/${appointment.id}`)
                      }
                    />
                  ))}
                </VStack>
              ) : (
                <Box className="bg-gray-50 p-4 rounded-xl items-center">
                  <Text className="text-gray-500 text-center text-sm">
                    No upcoming appointments
                  </Text>
                </Box>
              )}
            </Box>
          </VStack>
        </ScrollView>
      </Box>
    </FixedScreen>
  );
}
