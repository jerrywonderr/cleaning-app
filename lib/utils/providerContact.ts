import { Alert, Platform } from "react-native";

// Lazy import Linking only when needed
export const handleCallProvider = (phone: string, name?: string) => {
  if (!phone) {
    Alert.alert("Error", "Provider phone number not available");
    return;
  }

  Alert.alert("Call Provider", `Do you want to call ${name ?? "this provider"}?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Call",
      onPress: () => {
        const phoneUrl = Platform.OS === "ios" ? `telprompt:${phone}` : `tel:${phone}`;

        import("react-native").then(({ Linking }) => {
          Linking.openURL(phoneUrl).catch(() =>
            Alert.alert("Error", "Unable to open phone dialer")
          );
        });
      },
    },
  ]);
};

export const handleMessageProvider = (phone: string, name?: string) => {
  if (!phone) {
    Alert.alert("Error", "Provider phone number not available");
    return;
  }

  Alert.alert("Message Provider", `Do you want to message ${name ?? "this provider"}?`, [
    { text: "Cancel", style: "cancel" },
    {
      text: "Message",
      onPress: () => {
        const smsUrl = `sms:${phone}`;

        import("react-native").then(({ Linking }) => {
          Linking.canOpenURL(smsUrl)
            .then((supported) => {
              if (supported) {
                Linking.openURL(smsUrl);
              } else {
                Alert.alert("Error", "Cannot open messaging app");
              }
            })
            .catch((err) => console.error("Error opening messaging app:", err));
        });
      },
    },
  ]);
};
