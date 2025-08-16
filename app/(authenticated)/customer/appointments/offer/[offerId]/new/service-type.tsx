import { PrimaryButton } from "@/lib/components/custom-buttons";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import serviceCategoryOptions from "@/lib/constants/service-category";
import bookAppointmentSchema from "@/lib/schemas/book-appointment";
import { router, useLocalSearchParams } from "expo-router";
import { useController, useFormContext } from "react-hook-form";
import { InferType } from "yup";

export default function ServiceTypeStep() {
  const { offerId } = useLocalSearchParams<{ offerId: string }>();
  const { control, watch } =
    useFormContext<InferType<typeof bookAppointmentSchema>>();
  const { field } = useController({ control, name: "serviceType" });

  // Watch the current service type value from the form
  const selectedServiceType = watch("serviceType");

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <PrimaryButton
          onPress={() =>
            router.push(`/customer/appointments/offer/${offerId}/new/schedule`)
          }
          disabled={!selectedServiceType}
        >
          Next
        </PrimaryButton>
      }
    >
      <Box className="flex-1 bg-white justify-between">
        <Box>
          <Text className="text-2xl font-bold mb-6">
            What type of cleaning?
          </Text>

          <Text className="text-base mb-2">Choose your preferred service</Text>

          <Box className="gap-4">
            {serviceCategoryOptions.map((option) => {
              const isSelected = selectedServiceType === option.value;

              return (
                <Pressable
                  key={option.value}
                  className={`px-4 py-3 rounded-xl border ${
                    isSelected
                      ? "bg-brand-500 border-brand-500"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => field.onChange(option.value)}
                >
                  <Text
                    className={`text-base ${
                      isSelected ? "text-white font-bold" : "text-gray-800"
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </Box>
        </Box>
      </Box>
    </FootedScrollableScreen>
  );
}
