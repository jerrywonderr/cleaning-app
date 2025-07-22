import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
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
import { Pressable } from "../ui/pressable";

interface PasswordFieldProps
  extends Omit<
    React.ComponentProps<typeof InputField>,
    "value" | "onChangeText"
  > {
  name: string;
  label?: string;
  helperText?: string;
  className?: string;
  textClassName?: string;
}

export function PasswordField({
  name,
  label,
  helperText,
  className,
  textClassName,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
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
      <Input className="h-14 border border-black/60 rounded-lg flex-row items-center">
        <InputField
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          className="text-lg font-medium flex-1"
          placeholderTextColor="#676767"
          secureTextEntry={!showPassword}
          {...props}
        />
        <Pressable onPress={() => setShowPassword((v) => !v)} className="px-2">
          {showPassword ? (
            <EyeOff size={24} color="#676767" />
          ) : (
            <Eye size={24} color="#676767" />
          )}
        </Pressable>
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
