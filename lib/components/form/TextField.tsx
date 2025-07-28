import { useController, useFormContext } from "react-hook-form";
import { TextInputProps, ViewStyle } from "react-native";
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

interface TextFieldProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  textClassName?: string;
  containerStyle?: ViewStyle;
}

export function TextField({
  name,
  label,
  helperText,
  className,
  textClassName,
  containerStyle,
  ...props
}: TextFieldProps) {
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
      <Input className="h-12 border border-black/60 rounded-lg">
        <InputField
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          className="text-base font-inter-medium"
          {...props}
        />
      </Input>
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
