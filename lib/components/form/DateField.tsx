import { formatDate } from "@/lib/utils/date-helper";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Pressable, View } from "react-native";
import { FormControl, FormControlLabel, FormControlLabelText } from "../ui/form-control";
import { Text } from "../ui/text";

interface DateFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  methods?: UseFormReturn<any>;
  value?: string | Date;
  onChange?: (value: string) => void;
  maximumDate?: Date;
  minimumDate?: Date;
  mode?: "date" | "time" | "datetime";
  display?: "default" | "spinner" | "calendar" | "clock";
}

export const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  placeholder = "Select date",
  methods,
  value,
  onChange,
  maximumDate = new Date(),
  minimumDate,
  mode = "date",
  display = "default",
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle both form context and direct value/onChange props
  const currentValue = methods ? methods.watch(name) : value;
  
  const handleChange = methods ? 
    (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        // Store as UTC ISO string
        methods.setValue(name, selectedDate.toISOString(), {
          shouldValidate: true,
        });
      }
    } : 
    (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate && onChange) {
        onChange(selectedDate.toISOString());
      }
    };

  const displayValue = currentValue
    ? formatDate(currentValue)
    : placeholder;

  return (
    <>
      <Pressable onPress={() => setShowDatePicker(true)}>
        <View pointerEvents="none">
          <FormControl>
            {label && (
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-inter-medium">
                  {label}
                </FormControlLabelText>
              </FormControlLabel>
            )}
            <View className="h-12 border border-black/60 rounded-lg px-3 justify-center bg-white">
            <Text className={`text-base font-inter-medium ${
                currentValue ? "text-gray-900" : "text-gray-500"
              }`}
            >
                {displayValue}
              </Text>
            </View>
          </FormControl>
        </View>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={
            currentValue ? new Date(currentValue) : new Date()
          }
          mode={mode}
          display={display}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={handleChange}
        />
      )}
    </>
  );
};
