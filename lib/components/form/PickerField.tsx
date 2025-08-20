import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Modal,
  Platform,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
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
import { Text } from "../ui/text";

interface PickerItem {
  label: string;
  value: string | number;
}

interface PickerFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  containerStyle?: ViewStyle;
  items: PickerItem[];
  placeholder?: string;
  enabled?: boolean;
  mode?: "dialog" | "dropdown";
  prompt?: string;
}

export function PickerField({
  name,
  label,
  helperText,
  className,
  containerStyle,
  items,
  placeholder,
  enabled = true,
  mode = "dialog",
  prompt,
  ...props
}: PickerFieldProps) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const currentValue = field.value;
    const index = items.findIndex((item) => item.value === currentValue);
    return index >= 0 ? index : 0;
  });

  const handleValueChange = (itemValue: string | number) => {
    setSelectedIndex(selectedIndex);
    field.onChange(itemValue);
  };

  const openPicker = () => {
    if (enabled) {
      setIsVisible(true);
    }
  };

  const closePicker = () => {
    setIsVisible(false);
  };

  const confirmSelection = () => {
    closePicker();
  };

  // Ensure we have a valid value
  const currentValue = field.value;
  const selectedItem = items.find((item) => item.value === currentValue);
  const displayValue = selectedItem?.label || placeholder || "Select option";

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormControlLabel>
          <FormControlLabelText className="text-sm font-inter-medium">
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )}

      {/* Touchable field that opens the picker */}
      <TouchableOpacity
        onPress={openPicker}
        disabled={!enabled}
        activeOpacity={0.7}
        style={{ opacity: enabled ? 1 : 0.5 }}
      >
        <View
          className="h-12 border border-black/60 rounded-lg bg-white justify-center px-3"
          style={containerStyle}
        >
          <Text className="text-base text-gray-900">{displayValue}</Text>
        </View>
      </TouchableOpacity>

      {/* Picker Modal */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl">
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <TouchableOpacity onPress={closePicker}>
                <Text className="text-gray-500 text-lg">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">
                {label || "Select Option"}
              </Text>
              <TouchableOpacity onPress={confirmSelection}>
                <Text className="text-blue-500 text-lg font-semibold">
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {/* Picker */}
            <View className="py-4">
              <Picker
                selectedValue={currentValue}
                onValueChange={handleValueChange}
                onBlur={field.onBlur}
                enabled={enabled}
                mode={
                  mode
                    ? Platform.select({ ios: "dialog", android: "dropdown" })
                    : mode
                }
                prompt={prompt}
                style={{
                  height: 200,
                  width: "100%",
                  color: "#000000",
                  backgroundColor: "transparent",
                }}
                itemStyle={{ color: "#000000" }}
                {...props}
              >
                {placeholder && (
                  <Picker.Item
                    label={placeholder}
                    value=""
                    enabled={false}
                    color="#6B7280"
                  />
                )}
                {items.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.label}
                    value={item.value}
                    color="#000000"
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>

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
}
