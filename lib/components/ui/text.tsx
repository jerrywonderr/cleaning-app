import { Text as RNText, TextProps } from "react-native";

export function Text({ children, ...props }: TextProps) {
  return <RNText {...props}>{children}</RNText>;
}
