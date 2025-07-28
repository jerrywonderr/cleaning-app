import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "../ui/box";

export default function ScrollableScreen({
  children,
  addTopInset = true,
  addBottomInset = true,
  keyboardVerticalOffset = Platform.OS === "ios" ? 48 : 0,
}: {
  children: React.ReactNode;
  addTopInset?: boolean;
  addBottomInset?: boolean;
  keyboardVerticalOffset?: number;
}) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
      // keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <Box
        className="px-4"
        style={{
          flex: 1,
          paddingTop: addTopInset ? top : 0,
          paddingBottom: addBottomInset ? bottom : 0,
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
