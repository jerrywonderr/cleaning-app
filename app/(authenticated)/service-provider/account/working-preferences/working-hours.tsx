import { PrimaryButton } from "@/lib/components/custom-buttons";
import { WorkingDayField } from "@/lib/components/form/WorkingDayField";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { useLoader } from "@/lib/components/ui/loader";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useServicePreferences } from "@/lib/hooks/useServicePreferences";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { Clock, Save } from "lucide-react-native";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";

const daysOfWeek = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

const schema = yup.object().shape({
  workingHours: yup
    .object()
    .test(
      "active-days-have-times",
      "Active days must have both start and end times set",
      function (value: any) {
        if (!value) return true;

        for (const dayKey in value) {
          const day = value[dayKey];
          if (day && day.isActive) {
            if (!day.startTime) {
              return this.createError({
                path: `workingHours.${dayKey}.startTime`,
                message: "Start time is required for active days",
              });
            }
            if (!day.endTime) {
              return this.createError({
                path: `workingHours.${dayKey}.endTime`,
                message: "End time is required for active days",
              });
            }
          }
        }
        return true;
      }
    )
    .test(
      "end-time-after-start-time",
      "End time must be after start time",
      function (value: any) {
        if (!value) return true;

        for (const dayKey in value) {
          const day = value[dayKey];
          if (day && day.isActive && day.startTime && day.endTime) {
            const startTime =
              day.startTime instanceof Date
                ? day.startTime
                : new Date(`2000-01-01T${day.startTime}`);
            const endTime =
              day.endTime instanceof Date
                ? day.endTime
                : new Date(`2000-01-01T${day.endTime}`);

            if (endTime <= startTime) {
              return this.createError({
                path: `workingHours.${dayKey}.endTime`,
                message: "End time must be after start time",
              });
            }
          }
        }
        return true;
      }
    ),
});

type WorkingHourDay = {
  isActive: boolean;
  startTime: Date | null;
  endTime: Date | null;
};

type FormData = {
  workingHours: {
    [key: string]: WorkingHourDay;
  };
};

export default function WorkingHoursScreen() {
  const router = useRouter();
  const { servicePreferences, updatePreferences, isUpdatingPreferences } =
    useServicePreferences();
  const { showLoader, hideLoader } = useLoader();

  const methods = useForm<FormData>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      workingHours: {
        monday: { isActive: false, startTime: null, endTime: null },
        tuesday: { isActive: false, startTime: null, endTime: null },
        wednesday: {
          isActive: false,
          startTime: null,
          endTime: null,
        },
        thursday: { isActive: false, startTime: null, endTime: null },
        friday: { isActive: false, startTime: null, endTime: null },
        saturday: { isActive: false, startTime: null, endTime: null },
        sunday: { isActive: false, startTime: null, endTime: null },
      },
    },
  });

  // Load existing working hours data when component mounts or data changes
  useEffect(() => {
    if (servicePreferences?.workingPreferences?.workingSchedule) {
      const existingSchedule = servicePreferences.workingPreferences
        .workingSchedule as Record<string, any>;
      if (existingSchedule && typeof existingSchedule === "object") {
        Object.keys(existingSchedule).forEach((day) => {
          const dayData = existingSchedule[day];
          if (dayData && typeof dayData === "object") {
            methods.setValue(`workingHours.${day}` as any, {
              isActive: dayData.isActive || false,
              startTime: dayData.startTime ? new Date(dayData.startTime) : null,
              endTime: dayData.endTime ? new Date(dayData.endTime) : null,
            });
          }
        });
      }
    }
  }, [servicePreferences, methods]);

  // Show/hide loader based on loading state
  useEffect(() => {
    if (isUpdatingPreferences) {
      showLoader("Saving working hours...");
    } else {
      hideLoader();
    }
  }, [isUpdatingPreferences, showLoader, hideLoader]);

  const handleSubmit = async (data: FormData) => {
    try {
      // Trigger validation before submitting
      const isValid = await methods.trigger();
      if (!isValid) {
        console.log("Form validation failed:", methods.formState.errors);
        return;
      }

      // Convert Date objects to ISO strings before saving
      const utcWorkingHours = Object.keys(data.workingHours).reduce(
        (acc, day) => {
          const dayData = data.workingHours[day];
          if (dayData.isActive && dayData.startTime && dayData.endTime) {
            acc[day] = {
              isActive: dayData.isActive,
              startTime: dayData.startTime.toISOString(),
              endTime: dayData.endTime.toISOString(),
            };
          } else {
            acc[day] = dayData;
          }
          return acc;
        },
        {} as any
      );

      await updatePreferences({
        workingPreferences: {
          ...servicePreferences?.workingPreferences,
          workingSchedule: utcWorkingHours,
        },
      });

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

  const getActiveDaysCount = () => {
    const workingHours = methods.watch("workingHours");
    return Object.values(workingHours).filter((day) => day?.isActive).length;
  };

  // Check if any active day is missing times
  const hasValidationErrors = () => {
    const workingHours = methods.watch("workingHours");
    for (const dayKey in workingHours) {
      const day = workingHours[dayKey];
      if (day?.isActive && (!day.startTime || !day.endTime)) {
        return true;
      }
    }
    return false;
  };

  console.log("Form errors:", methods.formState.errors);
  console.log("Form isValid:", methods.formState.isValid);
  console.log("Form isDirty:", methods.formState.isDirty);
  console.log("Has validation errors:", hasValidationErrors());

  console.log(methods.formState.errors);

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={methods.handleSubmit(handleSubmit)}
          disabled={
            Object.keys(methods.formState.errors).length > 0 ||
            getActiveDaysCount() === 0
          }
          isLoading={isUpdatingPreferences}
          icon={Save}
        >
          Save Working Schedule ({getActiveDaysCount()} active days)
        </PrimaryButton>
      }
    >
      <Box className="flex-1">
        <FormProvider {...methods}>
          <VStack className="gap-6 mb-4">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
                <Icon as={Clock} size="xl" className="text-blue-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                Set Your Working Schedule
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                Choose which days you work and set your available hours for each
                day.
              </Text>
            </Box>

            <VStack className="gap-4">
              <Text className="text-lg font-inter-semibold text-black">
                Daily Schedule
              </Text>
              <Text className="text-sm text-gray-600">
                Select which days you work and set your available hours.
              </Text>

              {daysOfWeek.map((day) => {
                return (
                  <WorkingDayField
                    key={day.id}
                    dayId={day.id}
                    label={day.label}
                    name={`workingHours.${day.id}`}
                  />
                );
              })}
            </VStack>

            <Box className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <VStack className="gap-2">
                <Text className="text-sm font-inter-medium text-blue-800">
                  Working Hours Info
                </Text>
                <Text className="text-xs text-blue-700 leading-4">
                  • These hours apply to your selected working days
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
