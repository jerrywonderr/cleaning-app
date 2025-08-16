import { format } from "date-fns";
import { Calendar } from "lucide-react-native";
import { useState } from "react";
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

interface DateFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DateField = ({
  name,
  label,
  helperText,
  placeholder,
  confirmText,
  cancelText,
  onConfirm,
  minimumDate,
  maximumDate = new Date(),
  ...props
}: DateFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

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
              <Text className="text-base font-inter-medium text-gray-900">
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
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>{error?.message}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};
