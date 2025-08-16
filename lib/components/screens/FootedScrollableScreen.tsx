import { cn } from "@/lib/utils/style";
import { ClassValue } from "clsx";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box } from "../ui/box";

export default function FootedScrollableScreen({
  children,
  addTopInset = true,
  addBottomInset = true,
  keyboardVerticalOffset = Platform.OS === "ios" ? 48 : 0,
  contentContainerClassName,
  footer,
}: {
  children: React.ReactNode;
  addTopInset?: boolean;
  addBottomInset?: boolean;
  keyboardVerticalOffset?: number;
  contentContainerClassName?: ClassValue;
  footer: React.ReactNode;
}) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
      // keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <Box
        style={{
          flex: 1,
          paddingTop: addTopInset ? top : 0,
          paddingBottom: addBottomInset ? bottom : 0,
        }}
      >
        <Box className={cn("px-4 flex-1", contentContainerClassName)}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Box>
        <Box className="border-t border-gray-300 pt-6 px-4">{footer}</Box>
      </Box>
    </KeyboardAvoidingView>
  );
}
