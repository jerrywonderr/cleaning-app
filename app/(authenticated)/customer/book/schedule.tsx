import { PrimaryButton } from "@/lib/components/custom-buttons";
import { Box } from "@/lib/components/ui/box";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";

export default function ScheduleStep() {
  const [dateTime, setDateTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDateTime(selectedDate);
    }
  };

  return (
    <Box className="flex-1 bg-white justify-between">
      <Box>
        <Text className="text-2xl font-bold mb-6">When should we come?</Text>
        <Text className="text-base mb-2">Pick a convenient date and time</Text>

        <Pressable
          onPress={() => setShowPicker(true)}
          className="bg-gray-100 p-4 rounded-xl"
        >
          <Text className="text-base text-gray-800">
            {dateTime.toLocaleString()}
          </Text>
        </Pressable>

        {showPicker && (
          <DateTimePicker
            value={dateTime}
            mode="datetime"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleChange}
            minimumDate={new Date()}
          />
        )}
      </Box>

      <Box className="mb-6">
        <PrimaryButton onPress={() => router.push("/book/confirm")}>
          Next
        </PrimaryButton>
      </Box>
    </Box>
  );
}
