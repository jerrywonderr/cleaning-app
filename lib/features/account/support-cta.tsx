import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Pressable } from "@/lib/components/ui/pressable";

import * as Linking from "expo-linking";
import { Mail, MessageSquare, Phone } from "lucide-react-native";
import { ReactNode } from "react";
import { Alert } from "react-native";

const phoneNumber = "07957645683";
const emailAddress = "olawell1@gmail.com";
const whatsappNumber = "07957645683"; // Use international format without '+'

const openDialer = () => {
  Linking.openURL(`tel:${phoneNumber}`);
};

const openEmail = () => {
  const mailto = `mailto:${emailAddress}`;
  Linking.openURL(mailto).catch(() => {
    Alert.alert("Error", "Unable to open email client");
  });
};

const openWhatsApp = () => {
  const url = `https://wa.me/${whatsappNumber}`;
  Linking.openURL(url).catch(() => {
    Alert.alert("Error", "Unable to open WhatsApp");
  });
};

interface SupportCTAProps {
  icon: ReactNode;
  onPress: () => void;
}

function SupportCTA({ icon, onPress }: SupportCTAProps) {
  return (
    <Pressable onPress={onPress} className="active:opacity-70 flex-1">
      <Box className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm ">
        <Box className="items-center justify-between gap-2">{icon}</Box>
      </Box>
    </Pressable>
  );
}

export function WhatsappSupportCTA() {
  return (
    <SupportCTA
      icon={
        <Box className="bg-emerald-50 p-2 rounded-lg">
          <Icon as={MessageSquare} size="xl" className="text-emerald-600" />
        </Box>
      }
      onPress={openWhatsApp}
    />
  );
}

export function EmailSupportCTA() {
  return (
    <SupportCTA
      icon={
        <Box className="bg-brand-500/10 p-2 rounded-lg">
          <Icon as={Mail} size="xl" className="text-brand-500" />
        </Box>
      }
      onPress={openEmail}
    />
  );
}

export function PhoneSupportCTA() {
  return (
    <SupportCTA
      icon={
        <Box className="bg-green-50 p-2 rounded-lg">
          <Icon as={Phone} size="xl" className="text-green-600" />
        </Box>
      }
      onPress={openDialer}
    />
  );
}
