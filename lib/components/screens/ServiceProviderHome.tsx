import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Bell, Calendar, DollarSign, Info, Users } from "lucide-react-native";
import React from "react";

export default function ServiceProviderHome() {
  const { user } = useAuthStore();
  const hasNotification = true;

  return (
    <ScrollableScreen addTopInset={true} addBottomInset={false}>
      <Box className="mb-4">
        {/* Header */}
        <HStack className="flex-row justify-between items-center">
          <VStack>
            <Text className="text-2xl font-inter-bold mt-8 mb-6 text-left">
              Welcome back, {user?.firstName}!
            </Text>
            <Text className="text-gray-600">
              Service Provider Dashboard
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

        {/* Quick Stats */}
        <Box className="bg-gray-50 rounded-xl p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Today&apos;s Overview
          </Text>
          <VStack className="space-y-3">
            <Box className="flex-row justify-between">
              <Text className="text-gray-600">Pending Jobs</Text>
              <Text className="font-semibold text-gray-900">5</Text>
            </Box>
            <Box className="flex-row justify-between">
              <Text className="text-gray-600">Completed Today</Text>
              <Text className="font-semibold text-gray-900">3</Text>
            </Box>
            <Box className="flex-row justify-between">
              <Text className="text-gray-600">Earnings Today</Text>
              <Text className="font-semibold text-green-600">$120</Text>
            </Box>
          </VStack>
        </Box>

        {/* Quick Actions */}
        <VStack className="space-y-4 mb-6">
          <Text className="text-lg font-semibold text-gray-900">
            Quick Actions
          </Text>
          
          <Pressable>
            <Box className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <HStack className="flex-row items-center gap-3">
                <Box className="bg-blue-100 p-2 rounded-lg">
                  <Icon as={Users} size="sm" className="text-blue-600" />
                </Box>
                <VStack className="flex-1">
                  <Text className="font-semibold text-blue-900">
                    View Available Jobs
                  </Text>
                  <Text className="text-blue-700 text-sm">
                    Browse and accept new cleaning requests
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Pressable>

          <Pressable>
            <Box className="bg-green-50 rounded-xl p-4 border border-green-200">
              <HStack className="flex-row items-center gap-3">
                <Box className="bg-green-100 p-2 rounded-lg">
                  <Icon as={Calendar} size="sm" className="text-green-600" />
                </Box>
                <VStack className="flex-1">
                  <Text className="font-semibold text-green-900">
                    My Schedule
                  </Text>
                  <Text className="text-green-700 text-sm">
                    Manage your upcoming appointments
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Pressable>

          <Pressable>
            <Box className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <HStack className="flex-row items-center gap-3">
                <Box className="bg-purple-100 p-2 rounded-lg">
                  <Icon as={DollarSign} size="sm" className="text-purple-600" />
                </Box>
                <VStack className="flex-1">
                  <Text className="font-semibold text-purple-900">
                    Earnings & Payments
                  </Text>
                  <Text className="text-purple-700 text-sm">
                    Track your income and payment history
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Pressable>
        </VStack>

        {/* Recent Jobs */}
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          Recent Jobs
        </Text>
        <VStack className="space-y-3">
          {[
            { 
              client: "Mrs. Johnson", 
              service: "Deep Cleaning", 
              time: "2 hours ago",
              status: "Completed",
              earnings: "$45"
            },
            { 
              client: "Mr. Smith", 
              service: "Standard Cleaning", 
              time: "4 hours ago",
              status: "Completed",
              earnings: "$35"
            },
            { 
              client: "Ms. Davis", 
              service: "Move-in Cleaning", 
              time: "6 hours ago",
              status: "Completed",
              earnings: "$60"
            },
          ].map((job, index) => (
            <Box key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <HStack className="flex-row justify-between items-start mb-2">
                <VStack className="flex-1">
                  <Text className="font-semibold text-gray-900">{job.client}</Text>
                  <Text className="text-gray-600 text-sm">{job.service}</Text>
                </VStack>
                <Text className="text-green-600 font-semibold">{job.earnings}</Text>
              </HStack>
              <HStack className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-sm">{job.time}</Text>
                <Box className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-medium">{job.status}</Text>
                </Box>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </ScrollableScreen>
  );
} 