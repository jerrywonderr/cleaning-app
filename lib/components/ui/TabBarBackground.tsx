import { View } from "react-native";

// This provides a solid background for web and Android
export default function TabBarBackground() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#454EB0",
      }}
    />
  );
}

export function useBottomTabOverflow() {
  return 0;
}
