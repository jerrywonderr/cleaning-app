import { PrimaryButton } from "@/lib/components/custom-buttons";
import { DateTimeField } from "@/lib/components/form";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { router } from "expo-router";
import { useState } from "react";

export default function ScheduleStep() {
  const [dateTime, setDateTime] = useState(new Date());


  return (
    <Box className="flex-1 bg-white justify-between">
      <Box>
        <Text className="text-2xl font-bold mb-6">When should we come?</Text>
        <Text className="text-base mb-2">Pick a convenient date and time</Text>

        <DateTimeField
          value={dateTime}
          onChange={setDateTime}
          minimumDate={new Date()}
        />
      </Box>

      <Box className="mb-6">
        <PrimaryButton onPress={() => router.push("/customer/book/confirm")}>
          Next
        </PrimaryButton>
      </Box>
    </Box>
  );
}
