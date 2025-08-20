import { PrimaryButton } from "@/lib/components/custom-buttons";
import { TimeField } from "@/lib/components/form/TimeField";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Clock, Save } from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
});

type FormData = {
  startTime: string;
  endTime: string;
};

export default function WorkingHoursScreen() {
  const router = useRouter();

  const methods = useForm<FormData>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      startTime: "09:00",
      endTime: "17:00",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      // TODO: Save working hours to database
      console.log("Working hours:", data);

      Alert.alert("Success", "Working hours updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update working hours");
    }
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={methods.handleSubmit(handleSubmit)}
          disabled={!methods.formState.isValid}
          icon={Save}
        >
          Save Working Hours
        </PrimaryButton>
      }
    >
      <Box className="flex-1">
        <FormProvider {...methods}>
          <VStack className="gap-6">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
                <Icon as={Clock} size="xl" className="text-blue-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                Set Your Working Hours
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                Choose the hours you&apos;re available to work each day.
              </Text>
            </Box>

            <VStack className="gap-4">
              <Text className="text-lg font-inter-semibold text-black">
                Daily Schedule
              </Text>

              <TimeField
                name="startTime"
                label="Start Time"
                placeholder="Select start time"
              />

              <TimeField
                name="endTime"
                label="End Time"
                placeholder="Select end time"
              />
            </VStack>

            <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <VStack className="gap-2">
                <Text className="text-sm font-inter-medium text-blue-800">
                  Working Hours Info
                </Text>
                <Text className="text-xs text-blue-700 leading-4">
                  • These hours apply to all your working days
                </Text>
                <Text className="text-xs text-blue-700 leading-4">
                  • Customers will see your availability during these times
                </Text>
                <Text className="text-xs text-blue-700 leading-4">
                  • You can adjust these hours anytime
                </Text>
              </VStack>
            </Box>

            <Text className="text-xs text-gray-500 text-center">
              Your working hours will be visible to customers
            </Text>
          </VStack>
        </FormProvider>
      </Box>
    </FootedScrollableScreen>
  );
}
