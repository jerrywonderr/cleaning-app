import { Text } from "@/components/ui/Text";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";
import { WaveDots } from "./wave-dots";

type LoaderProps = {
  visible: boolean;
  description?: string;
};

export const Loader = ({ visible, description }: LoaderProps) => {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: description ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, description]);

  if (!visible) return null;

  return (
    <Animated.View
      className="absolute inset-0 z-50 flex items-center justify-center h-full w-full"
      style={{ opacity: containerOpacity }}
    >
      <BlurView
        intensity={50}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent",
        }}
      />
      <View
        className="rounded-lg px-6 py-4 items-center"
        style={{
          backgroundColor:
            Platform.OS === "android"
              ? "rgba(255,255,255,0.9)"
              : "rgba(255,255,255,0.8)",
        }}
      >
        {description && (
          <Animated.View style={{ opacity: textOpacity }} className="mb-3">
            <Text className="text-black text-center font-inter-medium">
              {description}
            </Text>
          </Animated.View>
        )}
        <WaveDots />
      </View>
    </Animated.View>
  );
};
