import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";

interface ScheduleGridProps {
  schedule: any;
}

export const ScheduleGrid = ({ schedule }: ScheduleGridProps) => {
  if (!schedule) return null;

  const dayOrder = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <VStack className="gap-1">
      <HStack className="justify-between">
        {dayOrder.map((day, index) => {
          const dayData = schedule[day];
          const isActive = dayData?.isActive;
          return (
            <VStack key={day} className="items-center gap-1 flex-1">
              <Text className="text-xs text-gray-500 font-inter-medium">
                {dayLabels[index]}
              </Text>
              <VStack
                className={`w-6 h-6 rounded-full items-center justify-center ${
                  isActive ? "bg-brand-500" : "bg-gray-200"
                }`}
              >
                {isActive ? (
                  <Text className="text-white text-xs">✓</Text>
                ) : (
                  <Text className="text-gray-400 text-xs">○</Text>
                )}
              </VStack>
            </VStack>
          );
        })}
      </HStack>
    </VStack>
  );
};
