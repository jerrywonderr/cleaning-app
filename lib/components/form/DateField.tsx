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
          onPress={() => setIsOpen(true)}
          className="flex-1 flex-row items-center px-3"
          onPressIn={() => setIsFocused(true)}
          onPressOut={() => setIsFocused(false)}
        >
          <InputField
            value={
              field.value ? format(new Date(field.value), "dd/MM/yyyy") : ""
            }
            editable={false}
            placeholder={placeholder || "Select date"}
            className="text-base font-inter-medium flex-1"
            {...props}
          />
          <Calendar size={20} className="text-gray-500 ml-2" />
        </Pressable>
      </Input>

      <DateTimePickerModal
        isVisible={isOpen}
        mode="date"
        onConfirm={(date: Date) => {
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
        minimumDate={minimumDate}
        maximumDate={maximumDate}
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