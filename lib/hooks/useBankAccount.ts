import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFunctions, httpsCallable } from "firebase/functions";
import { FirebaseFirestoreService } from "../firebase/firestore";
import { useUserStore } from "../store/useUserStore";
import {
  CreateBankAccountData,
  CreatePayoutAccountData,
  CreateTransactionPinData,
  DeletePayoutAccountData,
  SetDefaultPayoutAccountData,
  StripeAccountSetupData,
  StripeAccountSetupResponse,
  StripeAccountStatusResponse,
  UpdateTransactionPinData,
} from "../types/bank-account";

export const useBankAccount = () => {
  const queryClient = useQueryClient();
  const profile = useUserStore((state) => state.profile);
  const functions = getFunctions();

  // Stripe Connect Account queries
  const {
    data: stripeConnectAccount,
    isLoading: isLoadingStripeAccount,
    error: stripeAccountError,
  } = useQuery({
    queryKey: ["stripeConnectAccount", profile?.id],
    queryFn: () =>
      FirebaseFirestoreService.getStripeConnectAccount(profile?.id!),
    enabled: !!profile?.id,
  });

  // Bank Account queries (legacy - keeping for backward compatibility)
  const {
    data: bankAccount,
    isLoading: isLoadingBankAccount,
    error: bankAccountError,
  } = useQuery({
    queryKey: ["bankAccount", profile?.id],
    queryFn: () => FirebaseFirestoreService.getBankAccount(profile?.id!),
    enabled: !!profile?.id,
  });

  // Payout Accounts queries - now supports multiple accounts
  const {
    data: payoutAccounts,
    isLoading: isLoadingPayoutAccounts,
    error: payoutAccountsError,
  } = useQuery({
    queryKey: ["payoutAccounts", profile?.id],
    queryFn: () => FirebaseFirestoreService.getPayoutAccounts(profile?.id!),
    enabled: !!profile?.id,
  });

  // Transaction Pin queries
  const {
    data: transactionPin,
    isLoading: isLoadingTransactionPin,
    error: transactionPinError,
  } = useQuery({
    queryKey: ["transactionPin", profile?.id],
    queryFn: () => FirebaseFirestoreService.getTransactionPin(profile?.id!),
    enabled: !!profile?.id,
  });

  // Stripe Connect Account mutations
  const {
    mutateAsync: setupStripeConnectAccount,
    isPending: isSettingUpStripeAccount,
  } = useMutation({
    mutationFn: async (data: StripeAccountSetupData) => {
      const setupStripeConnect = httpsCallable(
        functions,
        "setupStripeConnectAccount"
      );
      const result = await setupStripeConnect({
        userId: profile?.id,
        accountData: data,
      });
      return result.data as StripeAccountSetupResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stripeConnectAccount", profile?.id],
      });
    },
  });

  const { mutateAsync: getOnboardingUrl, isPending: isLoadingOnboardingUrl } =
    useMutation({
      mutationFn: async () => {
        const getOnboarding = httpsCallable(functions, "getOnboardingUrl");
        const result = await getOnboarding({
          userId: profile?.id,
        });
        return result.data as StripeAccountStatusResponse;
      },
    });

  const { mutateAsync: checkStripeAccountStatus, isPending: isCheckingStatus } =
    useMutation({
      mutationFn: async () => {
        const checkStatus = httpsCallable(
          functions,
          "checkStripeAccountStatus"
        );
        const result = await checkStatus({
          userId: profile?.id,
        });
        return result.data as StripeAccountStatusResponse;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["stripeConnectAccount", profile?.id],
        });
      },
    });

  // Customer Payment History
  const {
    mutateAsync: getCustomerPaymentHistory,
    isPending: isLoadingPaymentHistory,
  } = useMutation({
    mutationFn: async (params?: { limit?: number; startAfterId?: string }) => {
      const getHistory = httpsCallable(functions, "getCustomerPaymentHistory");
      const result = await getHistory(params || {});
      return result.data;
    },
  });

  // Provider Stripe Balance
  const {
    mutateAsync: getProviderStripeBalance,
    isPending: isLoadingProviderBalance,
  } = useMutation({
    mutationFn: async () => {
      const getBalance = httpsCallable(functions, "getProviderStripeBalance");
      // Don't pass any data - authentication comes from Firebase context
      const result = await getBalance();
      return result.data;
    },
  });

  // Provider Balance Transactions
  const {
    mutateAsync: getProviderBalanceTransactions,
    isPending: isLoadingBalanceTransactions,
  } = useMutation({
    mutationFn: async (params?: {
      limit?: number;
      startingAfter?: string;
      endingBefore?: string;
    }) => {
      const getTransactions = httpsCallable(
        functions,
        "getProviderBalanceTransactions"
      );
      // Pass data only if there are parameters
      const result = await getTransactions(
        params && Object.keys(params).length > 0 ? params : undefined
      );
      return result.data;
    },
  });

  // Bank Account mutations (legacy)
  const { mutateAsync: createBankAccount, isPending: isCreatingBankAccount } =
    useMutation({
      mutationFn: (data: CreateBankAccountData) =>
        FirebaseFirestoreService.createBankAccount(data.userId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["bankAccount", profile?.id],
        });
      },
    });

  // Payout Account mutations
  const {
    mutateAsync: createPayoutAccount,
    isPending: isCreatingPayoutAccount,
  } = useMutation({
    mutationFn: (data: CreatePayoutAccountData) =>
      FirebaseFirestoreService.createPayoutAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payoutAccounts", profile?.id],
      });
    },
  });

  const {
    mutateAsync: deletePayoutAccount,
    isPending: isDeletingPayoutAccount,
  } = useMutation({
    mutationFn: (data: DeletePayoutAccountData) =>
      FirebaseFirestoreService.deletePayoutAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payoutAccounts", profile?.id],
      });
    },
  });

  const {
    mutateAsync: setDefaultPayoutAccount,
    isPending: isSettingDefaultPayoutAccount,
  } = useMutation({
    mutationFn: (data: SetDefaultPayoutAccountData) =>
      FirebaseFirestoreService.setDefaultPayoutAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payoutAccounts", profile?.id],
      });
    },
  });

  // Transaction Pin mutations
  const {
    mutateAsync: createTransactionPin,
    isPending: isCreatingTransactionPin,
  } = useMutation({
    mutationFn: (data: CreateTransactionPinData) =>
      FirebaseFirestoreService.createTransactionPin(profile?.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactionPin", profile?.id],
      });
    },
  });

  const {
    mutateAsync: updateTransactionPin,
    isPending: isUpdatingTransactionPin,
  } = useMutation({
    mutationFn: (data: UpdateTransactionPinData) =>
      FirebaseFirestoreService.updateTransactionPin(profile?.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactionPin", profile?.id],
      });
    },
  });

  return {
    // Stripe Connect Account
    stripeConnectAccount,
    isLoadingStripeAccount,
    stripeAccountError,
    setupStripeConnectAccount,
    isSettingUpStripeAccount,
    getOnboardingUrl,
    isLoadingOnboardingUrl,
    checkStripeAccountStatus,
    isCheckingStatus,
    getCustomerPaymentHistory,
    isLoadingPaymentHistory,
    getProviderStripeBalance,
    isLoadingProviderBalance,
    getProviderBalanceTransactions,
    isLoadingBalanceTransactions,

    // Bank Account (legacy)
    bankAccount,
    isLoadingBankAccount,
    bankAccountError,
    createBankAccount,
    isCreatingBankAccount,

    // Payout Accounts (multiple)
    payoutAccounts,
    isLoadingPayoutAccounts,
    payoutAccountsError,
    createPayoutAccount,
    isCreatingPayoutAccount,
    deletePayoutAccount,
    isDeletingPayoutAccount,
    setDefaultPayoutAccount,
    isSettingDefaultPayoutAccount,

    // Transaction Pin
    transactionPin,
    isLoadingTransactionPin,
    transactionPinError,
    createTransactionPin,
    isCreatingTransactionPin,
    updateTransactionPin,
    isUpdatingTransactionPin,
  };
};
