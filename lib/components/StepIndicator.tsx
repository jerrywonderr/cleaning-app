import { cn } from "../utils/style";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <HStack className="justify-between items-center gap-2">
      {Array.from({ length: steps }).map((_, index) => (
        <Box
          key={index}
          className={cn(
            "flex-1 h-1 rounded-full",
            index < currentStep ? "bg-brand-500" : "bg-gray-300"
          )}
        />
      ))}
    </HStack>
  );
}
