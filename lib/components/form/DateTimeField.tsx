import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Pressable } from "react-native";
import { Text } from "../ui/text";

interface DateTimeFieldProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  display?: "default" | "spinner";
  className?: string;
}

export const DateTimeField: React.FC<DateTimeFieldProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  display = Platform.OS === "ios" ? "spinner" : "default",
  className = "bg-gray-100 p-4 rounded-xl",
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <>
      <Pressable
        onPress={() => setShowPicker(true)}
        className={className}
      >
        <Text className="text-base text-gray-800">
          {value.toLocaleString()}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="datetime"
          display={display}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </>
  );
};
