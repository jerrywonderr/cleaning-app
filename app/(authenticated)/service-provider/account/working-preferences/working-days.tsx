import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useRouter } from "expo-router";
import { Calendar, Check, Save } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";

const daysOfWeek = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

export default function WorkingDaysScreen() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);

  const toggleDay = (dayId: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = async () => {
    try {
      if (selectedDays.length === 0) {
        Alert.alert("Error", "Please select at least one working day");
        return;
      }

      // TODO: Save working days to database
      console.log("Working days:", selectedDays);

      Alert.alert("Success", "Working days updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update working days");
    }
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={handleSubmit}
          disabled={selectedDays.length === 0}
          icon={Save}
        >
          Save Working Days ({selectedDays.length} selected)
        </PrimaryButton>
      }
    >
      <Box className="flex-1">
        <VStack className="gap-6 mb-4">
          <Box className="items-center gap-4">
            <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
              <Icon as={Calendar} size="xl" className="text-green-600" />
            </Box>
            <Text className="text-xl font-inter-bold text-black text-center">
              Select Working Days
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              Choose which days of the week you&apos;re available to work.
            </Text>
          </Box>

          <VStack className="gap-4">
            <Text className="text-lg font-inter-semibold text-black">
              Available Days
            </Text>

            <VStack className="gap-3">
              {daysOfWeek.map((day) => (
                <Pressable key={day.id} onPress={() => toggleDay(day.id)}>
                  <HStack
                    className={`justify-between items-center p-4 rounded-lg border ${
                      selectedDays.includes(day.id)
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`font-inter-medium ${
                        selectedDays.includes(day.id)
                          ? "text-green-800"
                          : "text-black"
                      }`}
                    >
                      {day.label}
                    </Text>
                    {selectedDays.includes(day.id) && (
                      <Icon as={Check} className="text-green-600" />
                    )}
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </VStack>

          <Box className="bg-green-50 rounded-lg p-4 border border-green-200">
            <VStack className="gap-2">
              <Text className="text-sm font-inter-medium text-green-800">
                Working Days Info
              </Text>
              <Text className="text-xs text-green-700 leading-4">
                • Selected days will show your availability to customers
              </Text>
              <Text className="text-xs text-green-700 leading-4">
                • You can change these days anytime
              </Text>
              <Text className="text-xs text-green-700 leading-4">
                • Working hours apply to all selected days
              </Text>
            </VStack>
          </Box>

          <Text className="text-xs text-gray-500 text-center">
            Your working days will be visible to customers
          </Text>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
}
