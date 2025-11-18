import ScreenHeader from "@/lib/components/ScreenHeader";
import { Stack } from "expo-router";

export default function BankAccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold", fontSize: 18 },
        header: ({ navigation, options }) => (
          <ScreenHeader navigation={navigation} title={options.title} />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Bank Account",
        }}
      />
      <Stack.Screen
        name="provision-account"
        options={{
          title: "Provision Account",
        }}
      />
      <Stack.Screen
        name="create-payout-account"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="payout-account"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="create-transaction-pin"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="transaction-pin"
        options={{
          title: "Transaction PIN",
        }}
      />
      <Stack.Screen
        name="update-transaction-pin"
        options={{
          title: "Update Transaction PIN",
        }}
      />
    </Stack>
  );
}
