import ScreenHeader from "@/lib/components/ScreenHeader";
import FixedScreen from "@/lib/components/screens/FixedScreen";
import { Avatar, AvatarImage } from "@/lib/components/ui/avatar";
import { Box } from "@/lib/components/ui/box";
import { Button, ButtonIcon } from "@/lib/components/ui/button";
import { HStack } from "@/lib/components/ui/hstack";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { SettingsItem } from "@/lib/features/account/settings-item";
import {
  EmailSupportCTA,
  PhoneSupportCTA,
  WhatsappSupportCTA,
} from "@/lib/features/account/support-cta";
import { useSignOut } from "@/lib/hooks/useAuth";
import { useUserStore } from "@/lib/store/useUserStore";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router, useNavigation } from "expo-router";
import {
  CircleX,
  CreditCard,
  FileText,
  LogOutIcon,
  Shield,
  User,
} from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { Alert } from "react-native";

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
          <SettingsItem
            label="Profile"
            icon={User}
            onPress={() => router.push("/customer/account/view-profile")}
          />
          <SettingsItem
            label="Payment History"
            icon={CreditCard}
            onPress={() => router.push("/customer/account/payment-history")}
          />
          <SettingsItem
            label="Privacy Policy"
            icon={Shield}
            onPress={() => router.push("/customer/account/privacy-policy")}
          />
          <SettingsItem
            label="Terms of Service"
            icon={FileText}
            onPress={() => router.push("/customer/account/terms-of-service")}
          />
          <SettingsItem
            label="Delete Account"
            icon={CircleX}
            onPress={confirmDeleteAccount}
          />
        </VStack>

        <VStack className="gap-3 my-8 bg-brand-500/10 rounded-lg p-4">
          <VStack>
            <Text className="text-lg font-inter-semibold text-gray-900">
              We are here to help
            </Text>
            <Text className="text-gray-600 text-sm">
              Choose your preferred way to get in touch with our support team.
            </Text>
          </VStack>
          <HStack className="py-2 px-2 gap-4">
            <WhatsappSupportCTA />
            <EmailSupportCTA />
            <PhoneSupportCTA />
          </HStack>
        </VStack>
      </Box>
    </FixedScreen>
  );
}
