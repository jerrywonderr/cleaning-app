import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Box } from "../ui/box";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
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

  // Internal validation logic
  const validateTimes = () => {
    if (!isActiveField.value || !startTimeField.value || !endTimeField.value)
      return null;

    const startTime =
      startTimeField.value instanceof Date
        ? startTimeField.value
        : new Date(`2000-01-01T${startTimeField.value}`);
    const endTime =
      endTimeField.value instanceof Date
        ? endTimeField.value
        : new Date(`2000-01-01T${endTimeField.value}`);

    if (endTime <= startTime) {
      return "End time must be after start time";
    }

    return null;
  };

  const validationError = validateTimes();

  return (
    <Box className="border border-gray-200 rounded-lg overflow-hidden">
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
            <Text className="font-inter-medium text-black">{label}</Text>
            {isActiveField.value && displayStartTime && displayEndTime && (
              <Text className="text-sm text-gray-600">
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

            {/* Display validation errors */}
            {(startTimeError?.message ||
              endTimeError?.message ||
              isActiveError?.message ||
              validationError) && (
              <Text className="text-red-500 text-sm text-center">
                {startTimeError?.message ||
                  endTimeError?.message ||
                  isActiveError?.message ||
                  validationError}
              </Text>
            )}
          </VStack>
        </Box>
      )}
    </Box>
  );
};
