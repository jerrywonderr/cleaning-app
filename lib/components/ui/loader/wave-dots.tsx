import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export const WaveDots = () => {
  const dots = Array.from({ length: 3 }).map(() => new Animated.Value(0));
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Create a continuous left-to-right wave animation
    const createWaveAnimation = () => {
      // Wave flows from left to right
      const leftToRight = Animated.sequence([
        Animated.timing(dots[0], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dots[1], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dots[2], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Reset all dots to start the flow again
        Animated.parallel([
          Animated.timing(dots[0], {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(dots[1], {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(dots[2], {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(200), // Small pause before next cycle
      ]);

      return Animated.loop(leftToRight);
    };

    // Start the wave animation
    animationRef.current = createWaveAnimation();
    animationRef.current.start();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      dots.forEach((dot) => dot.setValue(0));
    };
  }, []);

  return (
    <View className="flex-row gap-2">
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: "#4F46E5", // Use explicit color instead of bg-primary
            opacity: dot,
            transform: [
              {
                scale: dot.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
};
