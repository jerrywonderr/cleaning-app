import { cn } from "@/lib/utils/style";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Platform,
  TextInput,
  TextInputProps,
  View
} from "react-native";

import { Text } from "../ui/text";

interface PasswordFieldProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
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
    <View className="flex flex-col w-full">
      {label && (
        <Text className="text-sm text-neutral-900 dark:text-neutral-100 text-left">
          {label}
        </Text>
      )}
      <View className="w-full">
        <View
          className={cn(
            "bg-white dark:bg-neutral-900 rounded-xl border",
            error ? "border-red-500" : "border-black",
            className
          )}
        >
          <View className="flex-row items-center px-2">
            <TextInput
              className={cn(
                "flex-1 h-12 px-4 text-neutral-900 dark:text-neutral-100 font-inter-black text-[13px]",
                textClassName
              )}
              style={{
                ...Platform.select({
                  ios: { lineHeight: 20 },
                  android: { lineHeight: 16, includeFontPadding: false },
                }),
              }}
              placeholderTextColor="#676767"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              secureTextEntry={!showPassword}
              {...props}
            />

            
          </View>
        </View>
      </View>
      {error && (
        <Text className="text-xs text-red-500 text-left mt-0.5">
          {error.message}
        </Text>
      )}
      {helperText && (
        <Text className="text-xs text-neutral-500 dark:text-neutral-400 text-left mt-">
          {helperText}
        </Text>
      )}
    </View>
  );
}
