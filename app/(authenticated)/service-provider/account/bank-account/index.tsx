import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { useLoader } from "@/lib/components/ui/loader";
import ManageAccount from "@/lib/features/bank-account/ManageAccount";
import ProvisionAccount from "@/lib/features/bank-account/ProvisionAccount";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { useEffect } from "react";

export default function BankAccountScreen() {
  const { showLoader, hideLoader } = useLoader();
  const userId = useUserStore((state) => state.profile?.id);
  const {
    bankAccount,
    payoutAccount,
    transactionPin,
    isLoadingBankAccount,
    isLoadingPayoutAccount,
    isLoadingTransactionPin,
  } = useBankAccount();

  const isLoading =
    isLoadingBankAccount || isLoadingPayoutAccount || isLoadingTransactionPin;

  useEffect(() => {
    if (isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isLoading, hideLoader, showLoader]);

  return (
    <ScrollableScreen addTopInset={false}>
      {bankAccount ? (
        <ManageAccount
          bankAccount={bankAccount}
          payoutAccount={payoutAccount ?? undefined}
          transactionPin={transactionPin ?? undefined}
        />
      ) : (
        <ProvisionAccount />
      )}
    </ScrollableScreen>
  );
}
