import { PrimaryButton } from "@/lib/components/custom-buttons";
import { DateField } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { serviceConfigs } from "@/lib/constants/service-config";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Alert, Pressable } from "react-native";

const serviceProviders = [
  {
    id: "provider-1",
    name: "CleanCo Experts",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    workingHours: { start: "09:00", end: "17:00" },
  },
  {
    id: "provider-2",
    name: "Sparkle Team",
    workingDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
    workingHours: { start: "10:00", end: "18:00" },
  },
  {
    id: "provider-3",
    name: "Shiny Homes",
    workingDays: ["Mon", "Wed", "Fri", "Sat"],
    workingHours: { start: "08:00", end: "14:00" },
  },
];

// Generate hourly slots
const generateTimeSlots = (start: string, end: string) => {
  const slots: string[] = [];
  let [hour] = start.split(":").map(Number);
  const [endHour] = end.split(":").map(Number);
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
  const allSlots = generateTimeSlots(providerHours.start, providerHours.end);
  const ranges: string[] = [];
  for (let i = 0; i <= allSlots.length - duration; i++) {
    const startTime = allSlots[i].split("-")[0];
    const endTime = allSlots[i + duration - 1].split("-")[1];
    ranges.push(`${startTime}-${endTime}`);
  }
  return ranges;
};

export default function CreateProposalPage() {
  const { watch, setValue } = useFormContext();
  const router = useRouter();

  const serviceId = watch("serviceId");
  const providerId = watch("providerId");

  const selectedService = serviceConfigs.find((s) => s.id === serviceId);
  const selectedProvider = serviceProviders.find((p) => p.id === providerId);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const formattedDate = selectedDate?.toISOString().split("T")[0] || "";
  const dayName = selectedDate ? dayNames[selectedDate.getDay()] : "";

  const availableRanges =
    selectedProvider &&
    selectedDate &&
    selectedProvider.workingDays.includes(dayName)
      ? getAvailableRanges(
          serviceId,
          formattedDate,
          duration,
          selectedProvider.workingHours
        )
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
      !selectedRange
    ) {
      Alert.alert("Missing Info", "Please select all required fields.");
      return;
    }
    router.push("/(authenticated)/customer/proposals/extra-options");
  };

  return (
    <FootedScrollableScreen
      footer={<PrimaryButton onPress={handleSubmit}>Next</PrimaryButton>}
    >
      <VStack className="gap-6">
        <Text className="text-2xl font-inter-bold text-black">
          Create Your Proposal
        </Text>

        {/* Selected Service */}
        <Box className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-lg font-inter-bold mb-2">Selected Service</Text>
          <Text className="font-inter-medium">{selectedService?.name}</Text>
          <Text className="text-gray-600">{selectedService?.description}</Text>
        </Box>

        {/* Provider */}
        <Box className="bg-gray-50 p-4 rounded-lg">
          <Text className="text-lg font-inter-bold mb-2">Service Provider</Text>
          <Text className="font-inter-medium">{selectedProvider?.name}</Text>
          <Text className="text-gray-600">
            {selectedProvider?.workingDays.join(", ")} |{" "}
            {selectedProvider?.workingHours.start} -{" "}
            {selectedProvider?.workingHours.end}
          </Text>
        </Box>

        {/* Date */}
        <DateField
          name="date"
          label="Select Date"
          onConfirm={setSelectedDate}
          minimumDate={new Date()}
        />

        {/* Duration */}
        <VStack className="gap-2">
          <Text className="text-lg font-inter-bold mb-2">Duration (hours)</Text>
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
            {selectedDate ? (
              availableRanges.length ? (
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
                <Text className="text-gray-500">No available ranges</Text>
              )
            ) : (
              <Text className="text-gray-500">Please select a date first</Text>
            )}
          </HStack>
        </VStack>
      </VStack>
    </FootedScrollableScreen>
  );
}
