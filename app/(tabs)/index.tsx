import { Box } from "@/lib/components/ui/box";
import { Button, ButtonText } from "@/lib/components/ui/button";
import { Text } from "@/lib/components/ui/text/index";
import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/lib/components/HelloWave";
import ParallaxScrollView from "@/lib/components/ParallaxScrollView";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function HomeScreen() {
  const { logout } = useAuthStore();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <Box style={styles.titleContainer}>
        <Text size="3xl" bold className="text-typography900">
          Welcome!
        </Text>
        <HelloWave />
      </Box>
      <Box style={styles.stepContainer}>
        <Text size="xl" bold className="text-typography800">
          Step 1: Try it
        </Text>
        <Text className="text-typography700">
          Edit <Text bold>app/(tabs)/index.tsx</Text> to see changes. Press{" "}
          <Text bold>
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </Text>{" "}
          to open developer tools.
        </Text>
        <Button
          size="sm"
          variant="solid"
          action="negative"
          onPress={logout}
          className="mt-2"
        >
          <ButtonText>Logout</ButtonText>
        </Button>
      </Box>
      <Box style={styles.stepContainer}>
        <Text size="xl" bold className="text-typography800">
          Step 2: Explore
        </Text>
        <Text className="text-typography700">
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </Text>
      </Box>
      <Box style={styles.stepContainer}>
        <Text size="xl" bold className="text-typography800">
          Step 3: Get a fresh start
        </Text>
        <Text className="text-typography700">
          {`When you're ready, run `}
          <Text bold>npm run reset-project</Text> to get a fresh{" "}
          <Text bold>app</Text> directory. This will move the current{" "}
          <Text bold>app</Text> to <Text bold>app-example</Text>.
        </Text>
      </Box>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
