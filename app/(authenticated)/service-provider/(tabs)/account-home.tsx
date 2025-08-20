import { DangerButton } from "@/lib/components/custom-buttons";
import ScreenHeader from "@/lib/components/ScreenHeader";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Avatar, AvatarImage } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonIcon } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useSignOut } from "@/lib/hooks/useAuth";
import { useUserStore } from "@/lib/store/useUserStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Href, router, useNavigation } from "expo-router";
import {
  ChevronRight,
  CircleX,
  CreditCard,
  FileText,
  LogOutIcon,
  MessageSquare,
  Settings,
  Shield,
  User,
  Wallet,
} from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { Alert } from "react-native";

const menuItems: { icon: any; label: string; route: Href }[] = [
  {
    icon: User,
    label: "Profile",
    route: "/service-provider/account/view-profile",
  },
  {
    icon: Settings,
    label: "Services Settings",
    route: "/service-provider/account/services-settings",
  },
  {
    icon: Wallet,
    label: "Bank Account",
    route: "/service-provider/account/bank-account" as Href,
  },
  {
    icon: MessageSquare,
    label: "Customer Support",
    route: "/service-provider/account/support",
  },
  {
    icon: CreditCard,
    label: "Payment method",
    route: "/service-provider/account/payment",
  },
  {
    icon: Shield,
    label: "Privacy Policy",
    route: "/service-provider/account/privacy-policy",
  },
  {
    icon: FileText,
    label: "Terms of Service",
    route: "/service-provider/account/terms-of-service",
  },
];

export default function AccountScreen() {
  const firstName = useUserStore((state) => state.profile?.firstName);
  const lastName = useUserStore((state) => state.profile?.lastName);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const signOutMutation = useSignOut();

  const confirmLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOutMutation.mutateAsync();
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  }, [signOutMutation]);

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
          <Text className="text-xl font-inter-bold text-black">
            {firstName} {lastName}
          </Text>
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

          <Box className="mt-8">
            <DangerButton onPress={confirmDeleteAccount} icon={CircleX}>
              Delete Account
            </DangerButton>
          </Box>
        </VStack>
      </Box>
    </FixedScreen>
  );
}
