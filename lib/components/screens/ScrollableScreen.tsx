import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "../ui/box";

export default function ScrollableScreen({
  children,
  addTopInset = true,
  keyboardVerticalOffset = Platform.OS === "ios" ? 48 : 0,
}: {
  children: React.ReactNode;
  addTopInset?: boolean;
  keyboardVerticalOffset?: number;
}) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      // keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <Box
        className="px-4"
        style={{
          flex: 1,
          paddingTop: addTopInset ? top : 0,
          paddingBottom: bottom,
        }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
}
