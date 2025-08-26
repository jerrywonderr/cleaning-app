import { AddressField } from "@/lib/components/form";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { LocationData } from "@/lib/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

type WorkingPreferencesRoute =
  | "working-hours"
  | "working-days"
  | "service-area";

const schema = yup.object().shape({
  serviceArea: yup.object().shape({
    address: yup.string().required("Service area address is required"),
    radius: yup
      .number()
      .min(1, "Radius must be at least 1 mile")
      .max(100, "Radius cannot exceed 100 miles"),
  }),
});

export default function WorkingPreferencesScreen() {
  const router = useRouter();

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      serviceArea: {
        address: "",
        radius: 25,
      },
    },
  });

  // TODO: Replace with actual data from your store/hook
  const workingPreferences = {
    workingHours: {
      start: "09:00",
      end: "17:00",
      isSet: true,
    },
    workingDays: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      isSet: true,
    },
    serviceArea: {
      address: "123 Main St, City",
      radius: 25,
      isSet: true,
    },
  };

  const handleNavigate = (route: WorkingPreferencesRoute) => {
    router.push(`/service-provider/account/working-preferences/${route}`);
  };

  const handleServiceAreaChange = (location: LocationData | null) => {
    if (location) {
      methods.setValue("serviceArea.address", location.fullAddress);
      console.log("Service area updated:", location);
    }
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6">
          <Box className="items-center gap-4">
            <Box className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
              <Icon as={Clock} size="xl" className="text-blue-600" />
            </Box>
            <Text className="text-xl font-inter-bold text-black text-center">
              Working Preferences
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              Manage your working hours, days, and service area to help
              customers find you.
            </Text>
          </Box>

          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              Your Settings
            </Text>

            <Pressable onPress={() => handleNavigate("working-hours")}>
              <HStack className="bg-white rounded-lg border border-gray-200 p-4 justify-between items-center">
                <HStack className="gap-4 items-center">
                  <Box className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                    <Icon as={Clock} className="text-blue-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="font-inter-semibold text-black">
                      Working Hours
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {workingPreferences.workingHours.isSet
                        ? `${workingPreferences.workingHours.start} - ${workingPreferences.workingHours.end}`
                        : "Set your daily working hours"}
                    </Text>
                  </VStack>
                  <HStack className="gap-2">
                    {workingPreferences.workingHours.isSet && (
                      <Icon as={CheckCircle} className="text-green-500" />
                    )}
                    <Icon as={ChevronRight} className="text-gray-400" />
                  </HStack>
                </HStack>
              </HStack>
            </Pressable>

            <Pressable onPress={() => handleNavigate("working-days")}>
              <HStack className="bg-white rounded-lg border border-gray-200 p-4 justify-between items-center">
                <HStack className="gap-4 items-center">
                  <Box className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center">
                    <Icon as={Calendar} className="text-green-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="font-inter-semibold text-black">
                      Working Days
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {workingPreferences.workingDays.isSet
                        ? `${workingPreferences.workingDays.days.length} days selected`
                        : "Choose which days you work"}
                    </Text>
                  </VStack>
                  <HStack className="gap-2">
                    {workingPreferences.workingDays.isSet && (
                      <Icon as={CheckCircle} className="text-green-500" />
                    )}
                    <Icon as={ChevronRight} className="text-gray-400" />
                  </HStack>
                </HStack>
              </HStack>
            </Pressable>

            <Pressable onPress={() => handleNavigate("service-area")}>
              <HStack className="bg-white rounded-lg border border-gray-200 p-4 justify-between items-center">
                <HStack className="gap-4 items-center">
                  <Box className="w-10 h-10 bg-purple-100 rounded-lg items-center justify-center">
                    <Icon as={MapPin} className="text-purple-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text className="font-inter-semibold text-black">
                      Service Area
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {workingPreferences.serviceArea.isSet
                        ? `${workingPreferences.serviceArea.address} (${workingPreferences.serviceArea.radius} miles)`
                        : "Set your service area and radius"}
                    </Text>
                  </VStack>
                  <HStack className="gap-2">
                    {workingPreferences.serviceArea.isSet && (
                      <Icon as={CheckCircle} className="text-green-500" />
                    )}
                    <Icon as={ChevronRight} className="text-gray-400" />
                  </HStack>
                </HStack>
              </HStack>
            </Pressable>
          </VStack>

          {/* Temporary Service Area Configuration */}
          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              Quick Service Area Setup
            </Text>
            <Text className="text-sm text-gray-600">
              Set your service area address to help customers find you. This is
              a temporary feature for testing.
            </Text>

            <FormProvider {...methods}>
              <AddressField
                name="serviceArea.address"
                label="Service Area Address"
                placeholder="Enter your service area address"
                helperText="This will be the center point of your service area"
                onLocationChange={handleServiceAreaChange}
              />
            </FormProvider>
          </VStack>

          <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-blue-800">
                Why set working preferences?
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Customers can see when you&apos;re available
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • You&apos;ll only receive requests within your service area
              </Text>
              <Text className="text-xs text-blue-700 leading-4">
                • Better matching with customers who need your services
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
