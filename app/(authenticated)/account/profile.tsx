import { TextField } from "@/lib/components/form/TextField";
import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Avatar, AvatarImage } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { VStack } from "@/lib/components/ui/vstack";
import { yupResolver } from "@hookform/resolvers/yup";
import { Pencil } from "lucide-react-native";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Enter a valid email address").required("Email is required"),
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  phone: yup.string().trim().required("Phone is required"),
  address: yup.string().trim().required("Address is required"),
  dob: yup.string().trim().required("DOB is required"),
});

const ProfileScreen = () => {
  const methods = useForm({ mode: "all", resolver: yupResolver(schema) });

  const handleEditImage = () => {
    console.log("Edit profile image pressed");
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <FormProvider {...methods}>
        <VStack className="flex-1 gap-4 items-center mt-4">
          <Box className="relative">
            <Avatar size="xl" className="rounded-full overflow-hidden active:opacity-60">
              <AvatarImage
                source={{
                  uri: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
                }}
                alt="Profile"
              />
            </Avatar>

            <Pressable
              onPress={handleEditImage}
              className="absolute bottom-0 right-0 bg-blue-800 p-2 rounded-full"
            >
              <Icon as={Pencil} size="sm" className="text-white" />
            </Pressable>
          </Box>

          <VStack className="w-full gap-4 mt-2">
            <TextField name="firstName" label="First name" placeholder="Kay" />
            <TextField name="lastName" label="Last name" placeholder="Adegboyega" />
            <TextField name="phone" label="Phone" placeholder="+234874875048" />
            <TextField name="address" label="Address" placeholder="Flat 9, Geoffery House, Pardoner Street London" />
            <TextField name="dob" label="DOB" placeholder="08/08/72" />
            <TextField name="email" label="Email" placeholder="Sirphil987@gmail.com" />
          </VStack>
        </VStack>
      </FormProvider>
    </ScrollableScreen>
  );
};

export default ProfileScreen;
