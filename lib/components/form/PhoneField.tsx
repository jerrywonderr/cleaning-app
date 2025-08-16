import { useController, useFormContext } from "react-hook-form";
import { Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
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

interface PhoneFieldProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  textClassName?: string;
  containerStyle?: ViewStyle;
}

export function PhoneField({
  name,
  label,
  helperText,
  className,
  textClassName,
  containerStyle,
  ...props
}: PhoneFieldProps) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const handleChange = (text: string) => {
    // Allow only digits and max 10 digits
    const digitsOnly = text.replace(/\D/g, "").slice(0, 10);
    field.onChange(digitsOnly);
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
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#00000099",
            borderRadius: 8,
            height: 48,
            paddingHorizontal: 12,
            backgroundColor: "#fff",
          },
          containerStyle,
        ]}
      >
        <Text className="text-base font-inter-medium text-gray-500">+234</Text>
        <TextInput
          value={field.value}
          onChangeText={handleChange}
          onBlur={field.onBlur}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="Enter phone number"
          style={{
            flex: 1,
            marginLeft: 6,
            fontSize: 16,
            fontFamily: "Inter-Medium",
            color: "#111827",
          }}
          {...props}
        />
      </View>

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
