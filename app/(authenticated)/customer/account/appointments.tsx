import { PrimaryButton } from "@/lib/components/custom-buttons";
import { Box } from "@/lib/components/ui/box";
import { Text } from "@/lib/components/ui/text";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { WebBrowserResult } from "expo-web-browser";
import { useState } from "react";

export default function AppointmentsScreen() {
  const [result, setResult] = useState<WebBrowserResult | null>(null);

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(
      "https://paystack.shop/pay/lj60y-3np9"
    );
    setResult(result);
  };

  return (
    <Box className="flex-1 items-center justify-center bg-white">
      <PrimaryButton onPress={() => router.push("/customer/book/address")}>
        Book a cleaning appointment
      </PrimaryButton>
      <PrimaryButton onPress={_handlePressButtonAsync}>
        Open Web Browser
      </PrimaryButton>
      {result && <Text>{result.type}</Text>}
    </Box>
  );
}
