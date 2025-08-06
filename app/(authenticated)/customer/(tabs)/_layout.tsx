import { CustomTabBar } from "@/lib/components/CustomTabBar";
import ScreenHeader from "@/lib/components/ScreenHeader";
import { Icon } from "@/lib/components/ui/icon";
// import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { Tabs } from "expo-router";
import { Calendar, Gift, Home, UserRound } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: "center",
        header: ({ navigation, options }) => {
          const { title } = options;
          const showBackButton = (options as any).showBackButton ?? true;

          return (
            <ScreenHeader
              navigation={navigation}
              title={title}
              showBackButton={showBackButton}
            />
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon as={Home} size="xl" height={36} width={36} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="offers"
        options={() => ({
          title: "Offers",
          showBackButton: false,
          tabBarIcon: ({ color }) => (
            <Icon as={Gift} size="xl" height={36} width={36} color={color} />
          ),
        })}
      />
      {/* <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <Icon
              as={MessageSquareText}
              size="xl"
              height={36}
              width={36}
              color={color}
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="appointments"
        options={() => ({
          title: "Appointments",
          showBackButton: false,
          tabBarIcon: ({ color }) => (
            <Icon
              as={Calendar}
              size="xl"
              height={36}
              width={36}
              color={color}
            />
          ),
        })}
      />
      <Tabs.Screen
        name="account-home"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <Icon
              as={UserRound}
              size="xl"
              height={36}
              width={36}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
