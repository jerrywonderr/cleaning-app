import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../firebase/config";
import { FirebaseFirestoreService } from "../firebase/firestore";
import { useUserStore } from "../store/useUserStore";
import {
  StripeAccountSetupData,
  StripeAccountSetupResponse,
  StripeAccountStatusResponse,
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

  // Customer Payment History - Direct Firestore Query
  const paymentHistoryQuery = useInfiniteQuery({
    queryKey: ["paymentHistory", profile?.id],
    queryFn: async ({ pageParam }) => {
      if (!profile?.id) throw new Error("User ID required");

      const paymentsRef = collection(db, "paymentHistory");
      let q = query(
        paymentsRef,
        where("customerId", "==", profile.id),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      if (pageParam) {
        q = query(q, startAfter(pageParam));
      }

      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const lastDoc = snap.docs[snap.docs.length - 1] || null;
      const hasMore = snap.docs.length === 25;

      return { items, lastDoc, hasMore };
    },
    initialPageParam: null as QueryDocumentSnapshot | null,
    getNextPageParam: (lastPage: {
      items: any[];
      lastDoc: QueryDocumentSnapshot | null;
      hasMore: boolean;
    }) => (lastPage.hasMore && lastPage.lastDoc ? lastPage.lastDoc : null),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
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
    paymentHistory:
      paymentHistoryQuery.data?.pages.flatMap((page: any) => page.items) || [],
    isLoadingPaymentHistory: paymentHistoryQuery.isLoading,
    hasMorePaymentHistory: paymentHistoryQuery.hasNextPage,
    loadMorePaymentHistory: paymentHistoryQuery.fetchNextPage,
    isLoadingMorePaymentHistory: paymentHistoryQuery.isFetchingNextPage,
    refreshPaymentHistory: paymentHistoryQuery.refetch,
    isRefreshingPaymentHistory:
      paymentHistoryQuery.isRefetching &&
      !paymentHistoryQuery.isFetchingNextPage,
    getProviderStripeBalance,
    isLoadingProviderBalance,
    getProviderBalanceTransactions,
    isLoadingBalanceTransactions,
  };
};
