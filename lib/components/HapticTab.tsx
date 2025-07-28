import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { View } from "react-native";

export function HapticTab(props: BottomTabBarButtonProps) {
  const { children, accessibilityState, ...rest } = props;
  const isSelected = accessibilityState?.selected;

  return (
    <PlatformPressable
      {...rest}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 8,
          position: "relative",
        }}
      >
        {isSelected && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 8,
              right: 8,
              bottom: 0,
              backgroundColor: "white",
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
        <View
          style={{
            zIndex: 10,
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          {children}
        </View>
      </View>
    </PlatformPressable>
  );
}
