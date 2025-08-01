import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { Calendar, Gift, HelpCircle, Home, UserRound } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { Icon } from "./ui/icon";

const tabIcons = {
  index: Home,
  offers: Gift,
  appointments: Calendar,
  support: HelpCircle,
  "account-home": UserRound,
};

// const tabLabels = {
//   index: "Home",
//   offers: "Offers",
//   account: "Account",
// };

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "white",
        paddingBottom: 20,
        paddingTop: 10,
        paddingHorizontal: 16,
        height: 80,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
      }}
    >
      {state.routes.map((route, index) => {
        // const { options } = descriptors[route.key];
        // const label =
        //   tabLabels[route.name as keyof typeof tabLabels] || route.name;
        const IconComponent = tabIcons[route.name as keyof typeof tabIcons];

        const isFocused = state.index === index;

        const onPress = () => {
          // Add haptic feedback
          if (process.env.EXPO_OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {isFocused && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 8,
                  right: 8,
                  bottom: 0,
                  backgroundColor: "#454EB0",
                  borderRadius: 25,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              />
            )}
            <View style={{ zIndex: 10, alignItems: "center" }}>
              <Icon
                as={IconComponent}
                size={isFocused ? ("3xl" as any) : "xl"}
                color={isFocused ? "white" : "#6B7280"}
              />
              {/* <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: isFocused ? "white" : "#6B7280",
                  marginTop: 4,
                }}
              >
                {label}
              </Text> */}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
