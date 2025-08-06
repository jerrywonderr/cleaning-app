import ScreenHeader from "@/lib/components/ScreenHeader";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Avatar, AvatarImage } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useAuthStore } from "@/lib/store/useAuthStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Href, router, useNavigation } from "expo-router";
import {
  Calendar,
  ChevronRight,
  CircleX,
  CreditCard,
  LogOutIcon,
  MessageSquare,
  User
} from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { Alert } from "react-native";

const menuItems: { icon: any; label: string; route: Href }[] = [
  {
    icon: User,
    label: "Profile",
    route: "/customer/account/view-profile",
  },
  {
    icon: MessageSquare,
    label: "Customer Support",
    route: "/customer/account/support",
  },
  {
    icon: Calendar,
    label: "My Appointments",
    route: "/customer/account/appointments",
  },
  {
    icon: CreditCard,
    label: "Payment method",
    route: "/customer/account/payment",
  },
];

export default function AccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { logout } = useAuthStore();

  const confirmLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  }, [logout]);

  useEffect(() => {
    navigation.setOptions({
      header: ({ navigation, options }: { navigation: any; options: any }) => (
        <ScreenHeader
          navigation={navigation}
          title={options.title}
          showBackButton={false}
          rightContent={
            <Button
              onPress={confirmLogout}
              variant="outline"
              action="negative"
              size="sm"
              className="border-red-500 rounded-lg px-2 py-1"
            >
              <ButtonIcon as={LogOutIcon} size="sm" />
            </Button>
          }
        />
      ),
    });
  }, [navigation, confirmLogout]);

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Trigger delete logic
            console.log("Account deleted");
          },
        },
      ]
    );
  };

  return (
    <FixedScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="items-center my-6 gap-3">
          <Avatar
            size="xl"
            className="border-4 border-brand-500 rounded-full shadow-sm active:opacity-60 overflow-hidden"
          >
            <AvatarImage
              source={{
                uri: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
              }}
              alt="Profile Image"
            />
          </Avatar>
          <Text className="text-xl font-inter-bold text-black">Mr/Mrs Kay</Text>
        </VStack>

        <VStack className="gap-4">
          {menuItems.map((item, index) => (
            <Pressable key={item.label} onPress={() => router.push(item.route)}>
              <HStack
                className={`justify-between items-center py-3 px-2 ${
                  index !== menuItems.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <HStack className="gap-4 items-center">
                  <Icon as={item.icon} className="text-black" size="xl" />
                  <Text className="text-black font-inter-medium">
                    {item.label}
                  </Text>
                </HStack>
                <Icon as={ChevronRight} className="text-gray-400" size="xl" />
              </HStack>
            </Pressable>
          ))}

          <Button
            onPress={confirmDeleteAccount}
            variant="solid"
            action="negative"
            size="lg"
            className="mt-8 bg-red-600 rounded-lg h-16"
          >
            <ButtonIcon as={CircleX} className="h-6 w-6" />
            <ButtonText>Delete Account</ButtonText>
          </Button>
        </VStack>
      </Box>
    </FixedScreen>
  );
}
