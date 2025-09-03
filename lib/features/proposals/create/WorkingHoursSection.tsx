import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { ServiceProviderResult } from "@/lib/types";
import { format } from "date-fns";

interface WorkingHoursSectionProps {
  provider: ServiceProviderResult;
}

export const WorkingHoursSection: React.FC<WorkingHoursSectionProps> = ({
  provider,
}) => {
  const formatTime = (timeString: string) => {
    try {
      // Parse ISO string and format to HH:mm
      const date = new Date(timeString);
      return format(date, "HH:mm");
    } catch (error) {
      // Fallback to original string if parsing fails
      console.warn("Failed to parse time string:", timeString, error);
      return timeString;
    }
  };

  return (
    <VStack className="gap-3">
      <Text className="text-base font-inter-semibold text-gray-900">
        Working Hours
      </Text>
      <Box className="bg-gray-50 rounded-lg p-4">
        <VStack className="gap-2">
          {Object.entries(
            provider.workingPreferences?.workingSchedule || {}
          ).map(([day, schedule]) => (
            <HStack key={day} className="justify-between items-center">
              <Text className="text-gray-700 capitalize font-inter-medium text-sm">
                {day}
              </Text>
              <Text className="text-gray-600 text-sm">
                {schedule.isActive
                  ? `${formatTime(schedule.startTime!)} - ${formatTime(
                      schedule.endTime!
                    )}`
                  : "Not available"}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};
