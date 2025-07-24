import { HapticTab } from "@/lib/components/HapticTab";
import { Icon } from "@/lib/components/ui/icon";
import TabBarBackground from "@/lib/components/ui/TabBarBackground";
import { Colors } from "@/lib/constants/Colors";
import { useColorScheme } from "@/lib/hooks/useColorScheme";
import { Tabs } from "expo-router";
import {
  Home,
  MessageSquareText,
  UserRound,
  Wrench
} from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        headerShadowVisible: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        headerTitleAlign: "center",
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",            
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon as={Home} size="xl" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => (
            <Icon as={Wrench} size="xl" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color }) => (
            <Icon as={MessageSquareText} size="xl" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <Icon as={UserRound} size="xl" color={color} />
          ),
          headerShown: false,
        }}
      />
      
    </Tabs>
  );
}
