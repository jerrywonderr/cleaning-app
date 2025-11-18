import * as WebBrowser from "expo-web-browser";

export const openInAppBrowser = async (url: string) => {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (error) {
    console.error("Failed to open link", error);
  }
};
