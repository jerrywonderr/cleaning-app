import ScreenHeader from "@/lib/components/ScreenHeader";
import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        header: ({ navigation }) => <ScreenHeader navigation={navigation} />,
      }}
    >

    </Stack>
  );
}
