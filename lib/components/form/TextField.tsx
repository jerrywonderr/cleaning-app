import { Text } from "@/lib/components/ui/text";
import { cn } from "@/lib/utils/style";
import { useController, useFormContext } from "react-hook-form";
import {
  Platform,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

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
    <View className="flex flex-col gap-1.5 w-full" style={containerStyle}>
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
          <TextInput
            className={cn(
              "h-12 px-4 text-neutral-900 dark:text-neutral-100 text-right font-inter-black text-[13px]",
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
            {...props}
          />
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
