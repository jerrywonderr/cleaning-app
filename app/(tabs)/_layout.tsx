import { CustomTabBar } from "@/lib/components/CustomTabBar";
import ScreenHeader from "@/lib/components/ScreenHeader";
import { Icon } from "@/lib/components/ui/icon";
// import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { Tabs } from "expo-router";
import {
  Home,
  MessageSquareText,
  UserRound,
  Wrench,
} from "lucide-react-native";
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
        header: ({ navigation, options }) => (
          <ScreenHeader navigation={navigation} title={options.title} />
        ),
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
        options={{
          title: "Offers",
          tabBarIcon: ({ color }) => (
            <Icon as={Wrench} size="xl" height={36} width={36} color={color} />
          ),
        }}
      />
      <Tabs.Screen
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
      />
      <Tabs.Screen
        name="account"
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
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
