import { PrimaryButton } from "@/lib/components/custom-buttons";
import { DateField } from "@/lib/components/form";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import FootedScrollableScreen from "@/lib/components/screens/FootedScrollableScreen";
import { Avatar, AvatarImage } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { FirebaseFirestoreService } from "@/lib/firebase/firestore";
import { useUserStore } from "@/lib/store/useUserStore";
import { formatDate } from "@/lib/utils/date-helper";
import {
  Calendar,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  User,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, TextInput } from "react-native";

const ProfileScreen = () => {
  const profileData = useUserStore((state) => state.profile);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [values, setValues] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    dob: string;
    email: string;
    avatar: string;
    [key: string]: string;
  }>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    dob: "",
    email: "",
    avatar: "",
  });

  // Initialize values from store when component mounts or profile data changes
  useEffect(() => {
    if (profileData) {
      setValues({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phone: profileData.phone || "",
        address: "Flat 9, Geoffery House, Pardoner Street London", // Using dummy address since it's not in UserProfile
        dob: profileData.dob || "",
        email: profileData.email || "",
        avatar:
          profileData.profileImage ||
          "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
      });
    }
  }, [profileData]);

  if (!profileData) {
    return (
      <FixedScreen addTopInset={false}>
        <VStack className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">
            No profile data available.
          </Text>
        </VStack>
      </FixedScreen>
    );
  }

  const handleSaveProfile = async () => {
    setEditingField(null);

    if (!profileData) return;

    try {
      // Prepare the update data
      const updateData = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        dob: values.dob,
        email: values.email,
      };

      // Save to database first
      await FirebaseFirestoreService.updateUserProfile(
        profileData.id,
        updateData
      );

      // Then update the local store
      useUserStore.getState().updateProfile(updateData);

      // Show success feedback
      Alert.alert("Success!", "Your profile has been updated successfully.", [
        {
          text: "OK",
          style: "default",
        },
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);

      // Show error feedback
      Alert.alert("Error", "Failed to update profile. Please try again.", [
        {
          text: "OK",
          style: "default",
        },
      ]);
    }
  };

  const EditableRow = ({
    label,
    fieldName,
    isDate = false,
  }: {
    label: string;
    fieldName: string;
    isDate?: boolean;
  }) => {
    const isEditing = editingField === fieldName;
    const [localValue, setLocalValue] = useState(values[fieldName]);

    // Sync local value when switching to edit mode
    useEffect(() => {
      if (isEditing) setLocalValue(values[fieldName]);
    }, [isEditing, fieldName]);

    const handleSave = () => {
      setValues((prev) => ({ ...prev, [fieldName]: localValue }));
      setEditingField(null);
    };

    return (
      <HStack className="items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
        <HStack className="items-center gap-3 flex-1">
          <Box className="bg-gray-50 p-2 rounded-lg">
            <Icon
              as={getIconForField(fieldName)}
              size="md"
              className="text-gray-600"
            />
          </Box>
          <VStack className="flex-1">
            <Text className="text-sm text-gray-500 font-medium">{label}</Text>
            {isEditing ? (
              isDate ? (
                <DateField
                  name={fieldName}
                  label=""
                  // value={localValue}
                  // onChange={setLocalValue}
                  maximumDate={new Date()}
                />
              ) : (
                <TextInput
                  value={localValue}
                  onChangeText={setLocalValue}
                  autoFocus
                  className="text-base font-semibold text-gray-900"
                />
              )
            ) : (
              <Text className="text-base text-gray-900 font-semibold">
                {isDate ? formatDate(values[fieldName]) : values[fieldName]}
              </Text>
            )}
          </VStack>
        </HStack>

        {isEditing ? (
          <HStack className="gap-2">
            <Pressable
              onPress={handleSave}
              className="p-2 bg-green-100 rounded-lg"
            >
              <Icon as={Save} size="sm" className="text-green-600" />
            </Pressable>
            <Pressable
              onPress={() => setEditingField(null)}
              className="p-2 bg-red-100 rounded-lg"
            >
              <Icon as={X} size="sm" className="text-red-600" />
            </Pressable>
          </HStack>
        ) : (
          <Pressable
            onPress={() => setEditingField(fieldName)}
            className="p-2 bg-gray-100 rounded-lg"
          >
            <Icon as={Pencil} size="sm" className="text-gray-600" />
          </Pressable>
        )}
      </HStack>
    );
  };

  // Helper function to get the appropriate icon for each field
  const getIconForField = (fieldName: string) => {
    switch (fieldName) {
      case "firstName":
      case "lastName":
        return User;
      case "email":
        return Mail;
      case "phone":
        return Phone;
      case "address":
        return MapPin;
      case "dob":
        return Calendar;
      default:
        return User;
    }
  };

  return (
    <FootedScrollableScreen
      addTopInset={false}
      footer={
        <Box className="px-4 pb-6">
          <PrimaryButton onPress={handleSaveProfile} icon={Save}>
            Save All Changes
          </PrimaryButton>
        </Box>
      }
    >
      <Box className="flex-1 gap-6 pt-4">
        {/* Profile Header */}
        <VStack className="items-center gap-4 mb-6">
          <Box className="relative">
            <Avatar
              size="xl"
              className="border-4 rounded-full shadow-sm active:opacity-60 overflow-hidden"
            >
              <AvatarImage
                source={require("@/assets/app-images/profile.png")}
                alt="Profile Image"
              />
            </Avatar>
          </Box>

          <VStack className="items-center gap-1">
            <Text className="text-2xl font-bold text-gray-900">
              Edit Profile
            </Text>
            <Text className="text-sm text-gray-500">
              Tap the pencil icon to edit any field
            </Text>
          </VStack>
        </VStack>

        {/* Profile Information */}
        <VStack className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Box className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <Text className="text-lg font-semibold text-gray-900">
              Personal Information
            </Text>
          </Box>

          <VStack className="px-4">
            <EditableRow label="First Name" fieldName="firstName" />
            <EditableRow label="Last Name" fieldName="lastName" />
            {/* <EditableRow label="Email Address" fieldName="email" /> */}
            {/* <EditableRow label="Phone Number" fieldName="phone" /> */}
            {/* <EditableRow label="Address" fieldName="address" /> */}
            {/* <EditableRow label="Date of Birth" fieldName="dob" isDate /> */}
          </VStack>
        </VStack>
      </Box>
    </FootedScrollableScreen>
  );
};

export default ProfileScreen;

{
  /* <Box className="relative">
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
            </Box> */
}
