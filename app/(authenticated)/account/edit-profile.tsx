import { PrimaryButton } from "@/lib/components/custom-buttons";
import { TextField } from "@/lib/components/form/TextField";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Avatar, AvatarImage } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { yupResolver } from "@hookform/resolvers/yup";
import { Pencil, Save } from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  phone: yup.string().trim().required("Phone is required"),
  address: yup.string().trim().required("Address is required"),
  dob: yup.string().trim().required("DOB is required"),
});

const ProfileScreen = () => {
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "Kay",
      lastName: "Adegboyega",
      phone: "+234874875048",
      address: "Flat 9, Geoffery House, Pardoner Street London",
      dob: "08/08/72",
      email: "Sirphil987@gmail.com",
    },
  });

  const handleEditImage = () => {
    console.log("Edit profile image pressed");
  };

  const handleSaveProfile = () => {
    console.log("Save profile pressed");
  };

  return (
    <FixedScreen addTopInset={false}>
      <FormProvider {...methods}>
        <ScrollView
          className="flex-1 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <VStack className="items-center gap-4 mb-6">
            <Box className="relative">
              <Avatar size="xl" className="rounded-full overflow-hidden">
                <AvatarImage
                  source={{
                    uri: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
                  }}
                  alt="Profile"
                />
              </Avatar>

              <Pressable
                onPress={handleEditImage}
                className="absolute bottom-0 right-0 bg-brand-500 p-2 rounded-full"
              >
                <Icon as={Pencil} size="sm" className="text-white" />
              </Pressable>
            </Box>

            <VStack className="items-center gap-1">
              <Text className="text-2xl font-bold text-gray-900">
                Edit Profile
              </Text>
              <Text className="text-gray-600">Update your information</Text>
            </VStack>
          </VStack>

          {/* Form Fields */}
          <VStack className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <Box className="py-3 bg-gray-50 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">
                Personal Information
              </Text>
            </Box>

            <VStack className="py-4 gap-4">
              <TextField
                name="firstName"
                label="First name"
                placeholder="Kay"
              />
              <TextField
                name="lastName"
                label="Last name"
                placeholder="Adegboyega"
              />
              <TextField
                name="phone"
                label="Phone"
                placeholder="+234874875048"
              />
              <TextField
                name="address"
                label="Address"
                placeholder="Flat 9, Geoffery House, Pardoner Street London"
              />
              <TextField name="dob" label="DOB" placeholder="08/08/72" />
              <TextField
                name="email"
                label="Email"
                placeholder="Sirphil987@gmail.com"
              />
            </VStack>
          </VStack>
        </ScrollView>

        {/* Save Button */}
        <Box>
          <PrimaryButton onPress={handleSaveProfile} icon={Save}>
            Save Changes
          </PrimaryButton>
        </Box>
      </FormProvider>
    </FixedScreen>
  );
};

export default ProfileScreen;
