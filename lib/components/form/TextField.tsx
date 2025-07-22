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
    <FormControl>
      {label && (
        <FormControlLabel>
          <FormControlLabelText className="text-lg font-semibold">
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )}
      <Input className="h-14 border border-black/60 rounded-lg">
        <InputField
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          className="text-lg font-medium"
          {...props}
        />
      </Input>
      {helperText && (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      )}
      <FormControlError>
        <FormControlErrorIcon />
        <FormControlErrorText>{error?.message}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
