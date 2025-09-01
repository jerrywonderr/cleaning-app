import { cn } from "@/lib/utils/style";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Box } from "../ui/box";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { HStack } from "../ui/hstack";
import { AlertCircleIcon, Icon } from "../ui/icon";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { TimeField } from "./TimeField";

interface WorkingDayFieldProps {
  dayId: string;
  label: string;
  name: string;
}

export const WorkingDayField = ({
  dayId,
  label,
  name,
}: WorkingDayFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { control } = useFormContext();

  // Use controller to get field state and validation
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name: `${name}`,
    control,
  });

  // Use controller to get field state and validation
  const {
    field: startTimeField,
    fieldState: { error: startTimeError },
  } = useController({
    name: `${name}.startTime`,
    control,
  });

  const {
    field: endTimeField,
    fieldState: { error: endTimeError },
  } = useController({
    name: `${name}.endTime`,
    control,
  });

  // Use controller for the isActive field
  const {
    field: isActiveField,
    fieldState: { error: isActiveError },
  } = useController({
    name: `${name}.isActive`,
    control,
  });

  const fieldHasError = !!(
    startTimeError?.message ||
    endTimeError?.message ||
    isActiveError?.message ||
    fieldError?.message
  );

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const toggleDayActive = () => {
    const newValue = !isActiveField.value;
    isActiveField.onChange(newValue);

    if (newValue) {
      // Auto-expand when day becomes active
      if (!isExpanded) {
        setIsExpanded(true);
      }
    } else {
      // Auto-collapse and clear time values when day becomes inactive
      setIsExpanded(false);
      startTimeField.onChange(null);
      endTimeField.onChange(null);
    }
  };

  const formatTime = (time: string | Date | undefined) => {
    if (!time) return "";
    if (time instanceof Date) {
      return time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    return time;
  };

  const displayStartTime = formatTime(startTimeField.value);
  const displayEndTime = formatTime(endTimeField.value);

  return (
    <FormControl isInvalid={fieldHasError} className="border border-gray-200">
      <Pressable onPress={isActiveField.value ? toggleExpansion : undefined}>
        <HStack className="justify-between items-center p-4 bg-gray-50">
          <HStack className="gap-3 items-center">
            <Pressable onPress={toggleDayActive}>
              <Box
                className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  isActiveField.value
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-200"
                }`}
              >
                {isActiveField.value && (
                  <Box className="w-2 h-2 bg-white rounded" />
                )}
              </Box>
            </Pressable>

            <FormControlLabel>
              <FormControlLabelText className="font-inter-medium">
                {label}
              </FormControlLabelText>
            </FormControlLabel>
            {isActiveField.value && displayStartTime && displayEndTime && (
              <Text
                className={cn(
                  "text-sm text-gray-600",
                  fieldHasError && "text-red-600"
                )}
              >
                {displayStartTime} - {displayEndTime}
              </Text>
            )}
          </HStack>
          {isActiveField.value && (
            <Icon
              as={isExpanded ? ChevronUp : ChevronDown}
              className="text-gray-500"
            />
          )}
        </HStack>
      </Pressable>

      {isExpanded && (
        <Box className="p-4 bg-white border-t border-gray-200">
          <VStack className="gap-4">
            <HStack className="gap-4">
              <Box className="flex-1">
                <TimeField
                  name={`${name}.startTime`}
                  label="Start Time"
                  placeholder="Select start time"
                  showError={false}
                />
              </Box>
              <Box className="flex-1">
                <TimeField
                  name={`${name}.endTime`}
                  label="End Time"
                  placeholder="Select end time"
                  showError={false}
                />
              </Box>
            </HStack>

            <FormControlError className="items-center justify-center">
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {startTimeError?.message ||
                  endTimeError?.message ||
                  isActiveError?.message ||
                  fieldError?.message}
              </FormControlErrorText>
            </FormControlError>
          </VStack>
        </Box>
      )}
    </FormControl>
  );
};
