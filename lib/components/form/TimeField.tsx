import { format } from "date-fns";
import { Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Pressable } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";

interface TimeFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (date: Date) => void;
}

export const TimeField = ({
  name,
  label,
  helperText,
  placeholder,
  confirmText,
  cancelText,
  onConfirm,
  ...props
}: TimeFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  // Reset picker state when field value changes
  useEffect(() => {
    if (field.value) {
      console.log(`TimeField ${name} field value changed:`, field.value);
    }
  }, [field.value, name]);

  // Debug logging
  console.log(`TimeField ${name}:`, {
    value: field.value,
    error,
    parsedValue: field.value ? new Date(field.value) : null,
    currentTime: new Date(),
    displayValue:
      field.value && !isNaN(new Date(field.value).getTime())
        ? format(new Date(field.value), "HH:mm")
        : "NO_VALUE",
  });

  // Get the current time for the picker, defaulting to 9 AM today if no value exists
  const getPickerDate = () => {
    if (field.value && !isNaN(new Date(field.value).getTime())) {
      const parsedDate = new Date(field.value);
      console.log(
        `TimeField ${name} getPickerDate - using existing value:`,
        parsedDate
      );
      // Return a fresh date object to avoid reference issues
      return new Date(parsedDate.getTime());
    }

    // Default to 9:00 AM today to avoid any timezone or edge case issues
    const now = new Date();
    now.setHours(9, 0, 0, 0);

    console.log(`TimeField ${name} getPickerDate - using default time:`, now);
    return now;
  };

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormControlLabel>
          <FormControlLabelText className="text-sm font-inter-medium">
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )}
      <Input
        className={isFocused ? "border-primary-700" : "border-black/60"}
        size="xl"
        variant="outline"
      >
        <Pressable
          onPress={() => {
            const pickerDate = getPickerDate();
            console.log(
              `TimeField ${name} opening picker with date:`,
              pickerDate
            );
            // Reset picker state to ensure it doesn't get stuck
            setIsOpen(false);
            setTimeout(() => setIsOpen(true), 100);
          }}
          className="flex-1 flex-row items-center px-3"
          onPressIn={() => setIsFocused(true)}
          onPressOut={() => setIsFocused(false)}
        >
          <InputField
            value={
              field.value && !isNaN(new Date(field.value).getTime())
                ? format(new Date(field.value), "HH:mm")
                : ""
            }
            editable={false}
            placeholder={placeholder || "Select time"}
            className="text-base font-inter-medium flex-1"
            {...props}
          />
          <Clock size={20} className="text-gray-500 ml-2" />
        </Pressable>
      </Input>

      <DateTimePickerModal
        key={`${name}-${
          field.value ? new Date(field.value).getTime() : "default"
        }`}
        isVisible={isOpen}
        mode="time"
        date={getPickerDate()}
        onConfirm={(date: Date) => {
          console.log(`TimeField ${name} onConfirm:`, {
            selectedDate: date,
            selectedTimeString: date.toTimeString(),
            selectedHours: date.getHours(),
            selectedMinutes: date.getMinutes(),
            fieldValueBefore: field.value,
            fieldValueAfter: date,
          });
          field.onChange(date);
          onConfirm?.(date);
          setIsOpen(false);
          setIsFocused(false);
        }}
        onCancel={() => {
          setIsOpen(false);
          setIsFocused(false);
        }}
        confirmTextIOS={confirmText}
        cancelTextIOS={cancelText}
      />

      {helperText && (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      )}
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>{error?.message}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};
