import { PrimaryButton } from "@/lib/components/custom-buttons";
import { DateField } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import StepIndicator from "@/lib/components/StepIndicator";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { serviceConfigs } from "@/lib/constants/service-config";
import { CreateProposalFormData } from "@/lib/schemas/create-proposal";
import { searchServiceProviders } from "@/lib/services/cloudFunctionsService";
import { ServiceProviderResult } from "@/lib/types";
import { format } from "date-fns";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert, Pressable } from "react-native";

// Helper function to format time from ISO string
const formatTime = (timeString: string) => {
  try {
    const date = new Date(timeString);
    return format(date, "HH:mm");
  } catch (error) {
    return timeString;
  }
};

// Generate hourly slots
const generateTimeSlots = (start: string, end: string) => {
  if (!start || !end) return [];

  const slots: string[] = [];
  let [hour] = start.split(":").map(Number);
  const [endHour] = end.split(":").map(Number);

  if (isNaN(hour) || isNaN(endHour)) return [];

  while (hour < endHour) {
    const nextHour = hour + 1;
    slots.push(
      `${hour.toString().padStart(2, "0")}:00-${nextHour
        .toString()
        .padStart(2, "0")}:00`
    );
    hour = nextHour;
  }
  return slots;
};

// Generate time ranges based on duration
const getAvailableRanges = (
  serviceId: string,
  date: string,
  duration: number,
  providerHours: { start: string; end: string }
) => {
  if (!providerHours?.start || !providerHours?.end || duration <= 0) {
    return [];
  }

  const allSlots = generateTimeSlots(providerHours.start, providerHours.end);
  if (allSlots.length === 0) return [];

  const ranges: string[] = [];
  for (let i = 0; i <= allSlots.length - duration; i++) {
    const startTime = allSlots[i]?.split("-")[0];
    const endTime = allSlots[i + duration - 1]?.split("-")[1];

    if (startTime && endTime) {
      ranges.push(`${startTime}-${endTime}`);
    }
  }
  return ranges;
};

export default function CreateProposalPage() {
  const { watch, setValue } = useFormContext<CreateProposalFormData>();
  const serviceId = watch("serviceId");
  const providerId = watch("providerId");
  const location = watch("location");

  const selectedService = serviceConfigs.find((s) => s.id === serviceId);

  // Fetch provider data based on providerId from form
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProviderResult | null>(null);

  // Fetch provider data when providerId or location changes
  useEffect(() => {
    const fetchProviderData = async () => {
      if (!providerId || !location || !serviceId) {
        setSelectedProvider(null);
        return;
      }

      try {
        const results = await searchServiceProviders(serviceId, {
          latitude: location.latitude,
          longitude: location.longitude,
        });

        const provider = (results as ServiceProviderResult[]).find(
          (p) => p.id === providerId
        );

        setSelectedProvider(provider || null);
      } catch (error) {
        console.error("Error fetching provider data:", error);
        setSelectedProvider(null);
      }
    };

    fetchProviderData();
  }, [providerId, location, serviceId]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const formattedDate = selectedDate?.toISOString().split("T")[0] || "";
  const dayName = selectedDate ? dayNames[selectedDate.getDay()] : "";

  // Get working hours for the selected day
  const getWorkingHours = () => {
    if (!selectedProvider?.workingPreferences?.workingSchedule || !dayName) {
      return null;
    }

    const daySchedule =
      selectedProvider.workingPreferences.workingSchedule[dayName];
    if (
      !daySchedule?.isActive ||
      !daySchedule.startTime ||
      !daySchedule.endTime
    ) {
      return null;
    }

    const startTime = formatTime(daySchedule.startTime);
    const endTime = formatTime(daySchedule.endTime);

    if (!startTime || !endTime) {
      return null;
    }

    return {
      start: startTime,
      end: endTime,
    };
  };

  const workingHours = getWorkingHours();
  const isWorkingDay = workingHours !== null;

  const availableRanges =
    selectedProvider && selectedDate && isWorkingDay && workingHours
      ? getAvailableRanges(serviceId, formattedDate, duration, workingHours)
      : [];

  useEffect(() => {
    if (selectedDate)
      setValue("proposalDetails.date", selectedDate.toISOString());
    setValue("proposalDetails.duration", duration);
    setValue("proposalDetails.timeRange", selectedRange);
  }, [selectedDate, duration, selectedRange]);

  const handleSubmit = () => {
    if (
      !selectedService ||
      !selectedProvider ||
      !selectedDate ||
      !selectedRange ||
      !duration
    ) {
      Alert.alert("Missing Info", "Please select all required fields.");
      return;
    }

    // Check if provider has extra services available
    const hasExtraServices = Object.values(selectedProvider.extraOptions).some(
      Boolean
    );

    if (hasExtraServices) {
      // Navigate to extra options step
      router.push("/customer/proposals/create/extra-options");
    } else {
      // Skip directly to final proposal
      router.push("/customer/proposals/create/final-proposal");
    }
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={<PrimaryButton onPress={handleSubmit}>Next</PrimaryButton>}
    >
      <StepIndicator steps={6} currentStep={4} />

      <Box className="flex-1 bg-white pt-6">
        <VStack className="gap-6">
          <Text className="text-2xl font-inter-bold text-black">
            Create Your Proposal
          </Text>

          {/* Selected Service */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-inter-bold mb-2">
              Selected Service
            </Text>
            <Text className="font-inter-medium">{selectedService?.name}</Text>
            <Text className="text-gray-600">
              {selectedService?.description}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              ₦{selectedService?.perHourPrice}/hour
            </Text>
          </Box>

          {/* Location */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-inter-bold mb-2">
              Service Location
            </Text>
            <Text className="font-inter-medium">{location?.fullAddress}</Text>
          </Box>

          {/* Provider */}
          {selectedProvider && (
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-lg font-inter-bold mb-2">
                Service Provider
              </Text>
              <Text className="font-inter-medium">
                {selectedProvider.profile.firstName}{" "}
                {selectedProvider.profile.lastName}
              </Text>
              <Text className="text-gray-600">
                {selectedProvider.rating
                  ? `⭐ ${selectedProvider.rating}`
                  : "New Provider"}{" "}
                |
                {selectedProvider.totalJobs
                  ? ` ${selectedProvider.totalJobs} jobs`
                  : " No jobs yet"}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {Math.round(selectedProvider.distance / 1000)}km away
              </Text>
            </Box>
          )}

          {/* Date */}
          <DateField
            name="date"
            label="Select Date"
            onConfirm={setSelectedDate}
            minimumDate={new Date()}
          />

          {/* Duration */}
          <VStack className="gap-2">
            <Text className="text-lg font-inter-bold mb-2">
              Duration (hours)
            </Text>
            <HStack className="flex-wrap gap-2">
              {[1, 2, 3, 4].map((h) => (
                <Pressable
                  key={h}
                  onPress={() => selectedDate && setDuration(h)}
                  disabled={!selectedDate}
                  className={`px-4 py-2 rounded-lg border ${
                    duration === h
                      ? "bg-brand-500 border-brand-500"
                      : !selectedDate
                      ? "border-gray-200 bg-gray-100"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Text
                    className={`${
                      duration === h
                        ? "text-white"
                        : !selectedDate
                        ? "text-gray-400"
                        : "text-black"
                    }`}
                  >
                    {h} hr{h > 1 ? "s" : ""}
                  </Text>
                </Pressable>
              ))}
            </HStack>
          </VStack>

          {/* Time Ranges */}
          <VStack className="gap-2">
            <Text className="text-lg font-inter-bold mb-2">
              Select Time Range
            </Text>
            <HStack className="flex-wrap gap-2">
              {!selectedDate ? (
                <Text className="text-gray-500">
                  Please select a date first
                </Text>
              ) : !selectedProvider ? (
                <Text className="text-gray-500">
                  Please select a provider first
                </Text>
              ) : !isWorkingDay ? (
                <Text className="text-gray-500">
                  Provider is not available on {dayName}
                </Text>
              ) : !duration ? (
                <Text className="text-gray-500">
                  Please select duration first
                </Text>
              ) : availableRanges.length ? (
                availableRanges.map((range) => (
                  <Pressable
                    key={range}
                    onPress={() => setSelectedRange(range)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedRange === range
                        ? "bg-brand-500 border-brand-500"
                        : "border-gray-300"
                    }`}
                  >
                    <Text
                      className={`${
                        selectedRange === range ? "text-white" : "text-black"
                      }`}
                    >
                      {range}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text className="text-gray-500">
                  No available time slots for {duration} hour
                  {duration > 1 ? "s" : ""}
                </Text>
              )}
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
