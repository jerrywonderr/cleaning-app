import { useEffect } from "react";
import { Animated, View } from "react-native";

export const WaveDots = () => {
  const dots = Array.from({ length: 3 }).map(() => new Animated.Value(0));

  useEffect(() => {
    const animate = () => {
      const animations = dots.map((dot, i) =>
        Animated.sequence([
          Animated.delay(i * 200), // Stagger the start
          Animated.sequence([
            // Scale up and fade in
            Animated.parallel([
              Animated.timing(dot, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            // Scale down and fade out
            Animated.parallel([
              Animated.timing(dot, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ])
      );

      Animated.loop(Animated.parallel(animations)).start();
    };

    animate();
    return () => dots.forEach((dot) => dot.setValue(0));
  }, []);

  return (
    <View className="flex-row gap-2">
      {dots.map((dot, index) => (
        <Animated.View
          key={index}
          className="w-2 h-2 rounded-full bg-primary"
          style={{
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
