import { PrimaryButton } from "@/lib/components/custom-buttons";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Avatar, AvatarImage } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useUserStore } from "@/lib/store/useUserStore";
import { router } from "expo-router";
import { Edit, Mail, Phone, User } from "lucide-react-native";
import { ScrollView } from "react-native";

const ViewProfileScreen = () => {
  const dummyProfileData = {
    address: "Flat 9, Geoffery House, Pardoner Street London",
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
  };

  const profileData = useUserStore((state) => state.profile);

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

  const handleEditProfile = () => {
    router.push("/customer/account/edit-profile");
  };

  const ProfileInfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <HStack className="items-center justify-between py-3 border-b border-gray-100">
      <HStack className="items-center gap-3">
        <Box className="bg-gray-50 p-2 rounded-lg">
          <Icon as={icon} size="md" className="text-gray-600" />
        </Box>
        <VStack>
          <Text className="text-sm text-gray-500 font-medium">{label}</Text>
          <Text className="text-base text-gray-900 font-semibold">{value}</Text>
        </VStack>
      </HStack>
    </HStack>
  );

  return (
    <FixedScreen addTopInset={false}>
      <ScrollView className="flex-1 gap-6 pt-4">
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
            <Text className="text-2xl font-inter-bold text-gray-900">
              {profileData.firstName} {profileData.lastName}
            </Text>
          </VStack>
        </VStack>

        {/* Profile Information */}
        <VStack className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Box className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <Text className="text-lg font-inter-semibold  text-gray-900">
              Personal Information
            </Text>
          </Box>

          <VStack className="px-4">
            <ProfileInfoRow
              icon={User}
              label="Full Name"
              value={`${profileData.firstName} ${profileData.lastName}`}
            />
            <ProfileInfoRow
              icon={Mail}
              label="Email Address"
              value={profileData.email}
            />
            <ProfileInfoRow
              icon={Phone}
              label="Phone Number"
              value={profileData.phone.replace(/^\+/, "0")}
            />
            {/* <ProfileInfoRow
              icon={MapPin}
              label="Address"
              value={dummyProfileData.address}
            /> */}
            {/* <ProfileInfoRow
              icon={Calendar}
              label="Date of Birth"
              value={formatDate(profileData.dob)}
            /> */}
          </VStack>
        </VStack>
      </ScrollView>
      {/* Edit Profile Button */}
      <Box>
        <PrimaryButton onPress={handleEditProfile} icon={Edit}>
          Edit Profile
        </PrimaryButton>
      </Box>
    </FixedScreen>
  );
};

export default ViewProfileScreen;
