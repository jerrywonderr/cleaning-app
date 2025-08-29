import { PrimaryButton } from "@/lib/components/custom-buttons";
import { Box } from "@/lib/components/ui/box";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useRouter } from "expo-router";
import { Plus, Wallet } from "lucide-react-native";

export default function ProvisionAccount() {
  const router = useRouter();
  const handleProvisionAccount = () => {
    // Navigate to account provisioning screen
    router.push("/service-provider/account/bank-account/provision-account");
  };

  return (
    <Box className="flex-1">
      <VStack className="gap-6 items-center justify-center flex-1">
        <Box className="items-center gap-4">
          <Box className="w-20 h-20 bg-brand-100 rounded-full items-center justify-center">
            <Icon as={Wallet} size="xl" className="text-brand-600" />
          </Box>
          <Text className="text-xl font-inter-bold text-black text-center">
            No Bank Account Found
          </Text>
          <Text className="text-sm text-gray-600 text-center leading-5">
            You need to provision a bank account first to manage your funds and
            access banking features.
          </Text>
        </Box>

        <PrimaryButton onPress={handleProvisionAccount} icon={Plus}>
          Provision Bank Account
        </PrimaryButton>
      </VStack>
    </Box>
  );
}
