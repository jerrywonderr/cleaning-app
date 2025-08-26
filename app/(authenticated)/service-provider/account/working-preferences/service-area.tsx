import { PrimaryButton } from "@/lib/components/custom-buttons";
import { AddressField } from "@/lib/components/form";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { MapPin, Navigation, Save } from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";

const radiusOptions = [
  { label: "5 miles", value: 5 },
  { label: "10 miles", value: 10 },
  { label: "15 miles", value: 15 },
  { label: "20 miles", value: 20 },
  { label: "25 miles", value: 25 },
  { label: "30 miles", value: 30 },
  { label: "50 miles", value: 50 },
];

const schema = yup.object().shape({
  address: yup
    .object()
    .shape({
      fullAddress: yup.string().required("Address is required"),
      latitude: yup.number().required("Valid address is required"),
      longitude: yup.number().required("Valid address is required"),
      country: yup.string().required("Valid address is required"),
    })
    .required("Address is required"),
  radius: yup.number().required("Service radius is required"),
});

type FormData = {
  address: {
    fullAddress: string;
    latitude: number;
    longitude: number;
    country: string;
  };
  radius: number;
};

export default function ServiceAreaScreen() {
  const router = useRouter();

  const methods = useForm<FormData>({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      address: null as any,
      radius: 25,
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      // TODO: Save service area to database
      console.log("Service area:", data);

      Alert.alert("Success", "Service area updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update service area");
    }
  };

  const getFullAddress = () => {
    const address = methods.watch("address");
    if (address?.fullAddress) {
      return address.fullAddress;
    }
    return "Select your service area address";
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
          Save Service Area
        </PrimaryButton>
      }
    >
      <Box className="flex-1">
        <FormProvider {...methods}>
          <VStack className="gap-6 mb-4">
            <Box className="items-center gap-4">
              <Box className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center">
                <Icon as={MapPin} size="xl" className="text-purple-600" />
              </Box>
              <Text className="text-xl font-inter-bold text-black text-center">
                Set Your Service Area
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-5">
                Define where you&apos;re willing to travel for cleaning jobs.
              </Text>
            </Box>

            <VStack className="gap-4">
              <Text className="text-lg font-inter-semibold text-black">
                Service Location
              </Text>

              <AddressField
                name="address"
                label="Service Area Address"
                placeholder="Enter your service area address"
                helperText="This will be the center point of your service area"
              />

              <Box className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <VStack className="gap-2">
                  <Text className="text-sm font-inter-medium text-gray-800">
                    Full Address
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {getFullAddress()}
                  </Text>
                </VStack>
              </Box>
            </VStack>

            <VStack className="gap-4">
              <Text className="text-lg font-inter-semibold text-black">
                Service Radius
              </Text>

              <Text className="text-sm text-gray-600">
                How far are you willing to travel from your location?
              </Text>

              <VStack className="gap-3">
                {radiusOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => methods.setValue("radius", option.value)}
                  >
                    <HStack
                      className={`justify-between items-center p-4 rounded-lg border ${
                        methods.watch("radius") === option.value
                          ? "bg-purple-50 border-purple-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <HStack className="gap-3 items-center">
                        <Icon as={Navigation} className="text-purple-600" />
                        <Text
                          className={`font-inter-medium ${
                            methods.watch("radius") === option.value
                              ? "text-purple-800"
                              : "text-black"
                          }`}
                        >
                          {option.label}
                        </Text>
                      </HStack>
                      {methods.watch("radius") === option.value && (
                        <Box className="w-3 h-3 bg-purple-600 rounded-full" />
                      )}
                    </HStack>
                  </Pressable>
                ))}
              </VStack>
            </VStack>

            <Box className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <VStack className="gap-2">
                <Text className="text-sm font-inter-medium text-purple-800">
                  Service Area Info
                </Text>
                <Text className="text-xs text-purple-700 leading-4">
                  • Customers within your radius will see your services
                </Text>
                <Text className="text-xs text-purple-700 leading-4">
                  • You&apos;ll only receive job requests in your area
                </Text>
                <Text className="text-xs text-purple-700 leading-4">
                  • You can adjust your radius anytime
                </Text>
              </VStack>
            </Box>

            <Text className="text-xs text-gray-500 text-center">
              Your service area will be visible to customers
            </Text>
          </VStack>
        </FormProvider>
      </Box>
    </FootedScrollableScreen>
  );
}
