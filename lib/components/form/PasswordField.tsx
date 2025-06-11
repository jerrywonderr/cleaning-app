import { cn } from "@/lib/utils/style";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Platform,
  Pressable,
  TextInput,
  TextInputProps,
  View,
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
    <View className="flex flex-col gap-1.5 w-full">
      {label && (
        <Text className="text-sm text-neutral-900 dark:text-neutral-100 text-right">
          {label}
        </Text>
      )}
      <View className="w-full">
        <View
          className={cn(
            "bg-white dark:bg-neutral-900 rounded-lg border border-black",
            error ? "border-red-500" : "border-black",
            className
          )}
        >
          <View className="flex-row items-center">
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="px-4"
            >
              <Text className="text-[13px] font-inter-black text-neutral-900">
                {showPassword ? "הסתר" : "הצג"}
              </Text>
            </Pressable>
            <TextInput
              className={cn(
                "flex-1 h-12 px-4 text-neutral-900 dark:text-neutral-100 text-right font-inter-black text-[13px]",
                textClassName
              )}
              style={{
                ...Platform.select({
                  ios: {
                    lineHeight: 20,
                  },
                  android: {
                    lineHeight: 16,
                    includeFontPadding: false,
                  },
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
        <Text className="text-xs text-red-500 text-right">{error.message}</Text>
      )}
      {helperText && (
        <Text className="text-xs text-neutral-500 dark:text-neutral-400 text-right">
          {helperText}
        </Text>
      )}
    </View>
  );
}
