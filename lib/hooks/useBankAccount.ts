import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FirebaseFirestoreService } from "../firebase/firestore";
import { useUserStore } from "../store/useUserStore";
import {
  CreateBankAccountData,
  CreatePayoutAccountData,
  CreateTransactionPinData,
  UpdateTransactionPinData,
} from "../types/bank-account";

export const useBankAccount = () => {
  const queryClient = useQueryClient();
  const profile = useUserStore((state) => state.profile);

  const {
    data: bankAccount,
    isLoading: isLoadingBankAccount,
    error: bankAccountError,
  } = useQuery({
    queryKey: ["bankAccount", profile?.id],
    queryFn: () => FirebaseFirestoreService.getBankAccount(profile?.id!),
    enabled: !!profile?.id,
  });

  const {
    data: payoutAccount,
    isLoading: isLoadingPayoutAccount,
    error: payoutAccountError,
  } = useQuery({
    queryKey: ["payoutAccount", profile?.id],
    queryFn: () => FirebaseFirestoreService.getPayoutAccount(profile?.id!),
    enabled: !!profile?.id,
  });

  const {
    data: transactionPin,
    isLoading: isLoadingTransactionPin,
    error: transactionPinError,
  } = useQuery({
    queryKey: ["transactionPin", profile?.id],
    queryFn: () => FirebaseFirestoreService.getTransactionPin(profile?.id!),
    enabled: !!profile?.id,
  });

  const createBankAccountMutation = useMutation({
    mutationFn: (data: CreateBankAccountData) =>
      FirebaseFirestoreService.createBankAccount(data.userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccount", profile?.id] });
    },
  });

  const createPayoutAccountMutation = useMutation({
    mutationFn: (data: CreatePayoutAccountData) =>
      FirebaseFirestoreService.createPayoutAccount(data.userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payoutAccount", profile?.id],
      });
    },
  });

  const updatePayoutAccountMutation = useMutation({
    mutationFn: (data: Partial<CreatePayoutAccountData>) =>
      FirebaseFirestoreService.updatePayoutAccount(profile?.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payoutAccount", profile?.id],
      });
    },
  });

  const createTransactionPinMutation = useMutation({
    mutationFn: (data: CreateTransactionPinData) =>
      FirebaseFirestoreService.createTransactionPin(data.userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactionPin", profile?.id],
      });
    },
  });

  const updateTransactionPinMutation = useMutation({
    mutationFn: (data: UpdateTransactionPinData) =>
      FirebaseFirestoreService.updateTransactionPin(profile?.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactionPin", profile?.id],
      });
    },
  });

  return {
    // Data
    bankAccount,
    payoutAccount,
    transactionPin,

    // Loading states
    isLoadingBankAccount,
    isLoadingPayoutAccount,
    isLoadingTransactionPin,

    // Errors
    bankAccountError,
    payoutAccountError,
    transactionPinError,

    // Mutations
    createBankAccount: createBankAccountMutation.mutateAsync,
    createPayoutAccount: createPayoutAccountMutation.mutateAsync,
    updatePayoutAccount: updatePayoutAccountMutation.mutateAsync,
    createTransactionPin: createTransactionPinMutation.mutateAsync,
    updateTransactionPin: updateTransactionPinMutation.mutateAsync,

    // Mutation states
    isCreatingBankAccount: createBankAccountMutation.isPending,
    isCreatingPayoutAccount: createPayoutAccountMutation.isPending,
    isUpdatingPayoutAccount: updatePayoutAccountMutation.isPending,
    isCreatingTransactionPin: createTransactionPinMutation.isPending,
    isUpdatingTransactionPin: updateTransactionPinMutation.isPending,
  };
};
