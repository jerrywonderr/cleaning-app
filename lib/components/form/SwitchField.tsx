import { useController, useFormContext } from "react-hook-form";
import { SwitchProps, ViewStyle } from "react-native";
import CustomSwitch from "../CustomSwitch";
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
import { HStack } from "../ui/hstack";
import { AlertCircleIcon } from "../ui/icon";

interface SwitchFieldProps extends SwitchProps {
  name: string;
  label?: string;
  labelComponent?: React.ReactNode;
  helperText?: string;
  className?: string;
  textClassName?: string;
  containerStyle?: ViewStyle;
}

export function SwitchField({
  name,
  label,
  labelComponent,
  helperText,
  className,
  textClassName,
  containerStyle,
  ...props
}: SwitchFieldProps) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <FormControl isInvalid={!!error}>
      {/* {label && (
        <FormControlLabel>
          <FormControlLabelText className="text-sm font-inter-medium">
            {label}
          </FormControlLabelText>
        </FormControlLabel>
      )} */}
      {/* <View
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
      </View> */}

      <HStack className="justify-between items-center">
        {labelComponent
          ? labelComponent
          : label && (
              <FormControlLabel>
                <FormControlLabelText className="text-sm font-inter-medium">
                  {label}
                </FormControlLabelText>
              </FormControlLabel>
            )}
        <CustomSwitch
          value={field.value}
          onValueChange={(value: any) => field.onChange(value)}
          {...props}
        />
      </HStack>

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
