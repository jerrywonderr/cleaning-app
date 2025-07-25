import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Avatar, AvatarImage } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { router } from "expo-router";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  User,
} from "lucide-react-native";
import { Alert } from "react-native";

type RoutePath =
  | "/account/profile"
  | "/account/services"
  | "/account/support"
  | "/account/appointments"
  | "/account/payment";

const menuItems: { icon: any; label: string; route: RoutePath }[] = [
  {
    icon: User,
    label: "Profile",
    route: "/account/profile",
  },
  {
    icon: LayoutDashboard,
    label: "Services",
    route: "/account/services",
  },
  {
    icon: MessageSquare,
    label: "Customer Support",
    route: "/account/support",
  },
  {
    icon: Calendar,
    label: "My Appointments",
    route: "/account/appointments",
  },
  {
    icon: CreditCard,
    label: "Payment method",
    route: "/account/payment",
  },
];

export default function AccountScreen() {
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
    <FixedScreen addTopInset={true}>
      <Box className="flex-1">
        <VStack className="items-center mb-6 gap-3">
          <Avatar
            size="xl"
            className="border-4 border-blue-700 rounded-full shadow-sm active:opacity-60 overflow-hidden"
          >
            <AvatarImage
              source={{
                uri: "https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80",
              }}
              alt="Profile Image"
            />
          </Avatar>
          <Text className="text-xl font-bold text-black">Mr/Mrs Kay</Text>
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
                  <Text className="text-lg text-black">{item.label}</Text>
                </HStack>
                <Icon as={ChevronRight} className="text-gray-400" size="xl" />
              </HStack>
            </Pressable>
          ))}

          <Pressable
            onPress={confirmDeleteAccount}
            className="active:opacity-70"
          >
            <Box className="mt-6 items-center border border-red-300 rounded-lg px-4 py-2">
              <Text className="text-red-600 font-semibold text-base">
                Delete Account
              </Text>
            </Box>
          </Pressable>
        </VStack>
      </Box>
    </FixedScreen>
  );
}
