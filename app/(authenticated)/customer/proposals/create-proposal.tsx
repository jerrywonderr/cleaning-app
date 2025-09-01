import { PrimaryButton } from "@/lib/components/custom-buttons";
import { DateField } from "@/lib/components/form";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import {
  extraServiceOptions,
  serviceConfigs,
} from "@/lib/constants/service-config";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView } from "react-native";

// Mock booked slots
const bookedSlots: Record<string, { date: string; timeRange: string }[]> = {
  "classic-cleaning": [
    { date: "2025-08-26", timeRange: "09:00-10:00" },
    { date: "2025-08-26", timeRange: "13:00-14:00" },
  ],
  "deep-cleaning": [{ date: "2025-08-26", timeRange: "11:00-12:00" }],
};

// Service providers
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

// Generate time slots based on start/end hours
const generateTimeSlots = (start: string, end: string) => {
  const slots: string[] = [];
  let [hour, minute] = start.split(":").map(Number);
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

// Filter available ranges for a date
const getAvailableRanges = (
  serviceId: string,
  date: string,
  duration: number,
  providerHours: { start: string; end: string }
) => {
  const allSlots = generateTimeSlots(providerHours.start, providerHours.end);
  const booked =
    bookedSlots[serviceId]
      ?.filter((b) => b.date === date)
      .map((b) => b.timeRange) || [];
  const ranges: string[] = [];

  for (let i = 0; i <= allSlots.length - duration; i++) {
    const range = allSlots.slice(i, i + duration).join(",");
    const conflict = booked.some((b) => range.includes(b));
    if (!conflict) ranges.push(range.replaceAll(",", " | "));
  }
  return ranges;
};

export default function CreateProposalPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const serviceId = params.serviceId as string;
  const providerId = params.providerId as string;

  const selectedService = serviceConfigs.find((s) => s.id === serviceId);
  const selectedProvider = serviceProviders.find((p) => p.id === providerId);

  const methods = useForm();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const formattedDate = selectedDate.toISOString().split("T")[0];
  const dayName = dayNames[selectedDate.getDay()];

  const availableRanges =
    selectedProvider && selectedProvider.workingDays.includes(dayName)
      ? getAvailableRanges(
          serviceId,
          formattedDate,
          duration,
          selectedProvider.workingHours
        )
      : [];

  const toggleExtra = (optionId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const submitProposal = () => {
    if (!selectedService || !selectedProvider || !selectedRange) {
      Alert.alert("Missing Info", "Please select all required fields.");
      return;
    }
    console.log("Proposal created:", {
      serviceId: selectedService.id,
      providerId: selectedProvider.id,
      date: formattedDate,
      timeRange: selectedRange,
      extras: selectedExtras,
    });

    Alert.alert("Success", "Proposal created successfully!");
    router.push("/(authenticated)/customer/(tabs)/proposals");
  };

  return (
    <FormProvider {...methods}>
      <ScrollableScreen addTopInset={false}>
        <ScrollView className="p-4">
          <VStack className="gap-6">
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-lg font-inter-bold text-black mb-2">
                Selected Service
              </Text>
              <Text className="text-black font-inter-medium">
                {selectedService?.name}
              </Text>
              <Text className="text-gray-600">
                {selectedService?.description}
              </Text>
            </Box>

            {/* Provider info */}
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-lg font-inter-bold text-black mb-2">
                Service Provider
              </Text>
              <Text className="text-black font-inter-medium">
                {selectedProvider?.name}
              </Text>
              <Text className="text-gray-600">
                Available Days: {selectedProvider?.workingDays.join(", ")} |
                Hours: {selectedProvider?.workingHours.start} -{" "}
                {selectedProvider?.workingHours.end}
              </Text>
            </Box>

            {/* Date */}
            <DateField
              name="date"
              label="Select Date"
              onConfirm={(date) => setSelectedDate(date)}
              minimumDate={new Date()}
            />

            {/* Duration */}
            <VStack className="gap-2 mt-4">
              <Text className="text-lg font-inter-bold text-black mb-2">
                Duration (hours)
              </Text>
              <HStack className="flex-wrap gap-2">
                {[1, 2, 3, 4].map((h) => (
                  <Pressable
                    key={h}
                    onPress={() => setDuration(h)}
                    className={`px-4 py-2 rounded-lg border ${
                      duration === h
                        ? "bg-brand-500 border-brand-500"
                        : "border-gray-300"
                    }`}
                  >
                    <Text
                      className={`${
                        duration === h ? "text-white" : "text-black"
                      }`}
                    >
                      {h} hr{h > 1 ? "s" : ""}
                    </Text>
                  </Pressable>
                ))}
              </HStack>
            </VStack>

            {/* Time Ranges */}
            <VStack className="gap-2 mt-4">
              <Text className="text-lg font-inter-bold text-black mb-2">
                Select Time Range
              </Text>
              <HStack className="flex-wrap gap-2">
                {availableRanges.length > 0 ? (
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
                )}
              </HStack>
            </VStack>

            {/* Extra Options */}
            <VStack className="gap-2 mt-4">
              <Text className="text-lg font-inter-bold text-black mb-2">
                Extra Options
              </Text>
              <HStack className="flex-wrap gap-2">
                {extraServiceOptions.map((option) => (
                  <Pressable
                    key={option.id}
                    onPress={() => toggleExtra(option.id)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedExtras.includes(option.id)
                        ? "bg-brand-500 border-brand-500"
                        : "border-gray-300"
                    }`}
                  >
                    <Text
                      className={`${
                        selectedExtras.includes(option.id)
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {option.name} (₦{option.additionalPrice})
                    </Text>
                  </Pressable>
                ))}
              </HStack>
            </VStack>

            <Box className="mt-6">
              <PrimaryButton onPress={submitProposal}>
                Create Proposal
              </PrimaryButton>
            </Box>
          </VStack>
        </ScrollView>
      </ScrollableScreen>
    </FormProvider>
  );
}
