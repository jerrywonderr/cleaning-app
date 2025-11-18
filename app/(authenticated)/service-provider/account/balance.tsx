import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useBankAccount } from "@/lib/hooks/useBankAccount";
import { useUserStore } from "@/lib/store/useUserStore";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl } from "react-native";

interface BalanceData {
  available: { amount: number; currency: string }[];
  pending: { amount: number; currency: string }[];
  instant_available?: { amount: number; currency: string }[];
  object?: string;
  livemode?: boolean;
}

interface BalanceTransaction {
  id: string;
  amount: number;
  currency: string;
  description?: string;
  status: string;
  type: string;
  created: number;
  available_on: number;
  net: number;
  fee: number;
}

export default function BalanceScreen() {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.profile?.id);
  const {
    stripeConnectAccount,
    getProviderStripeBalance,
    getProviderBalanceTransactions,
  } = useBankAccount();

  // Check if account is fully set up
  const isAccountFullySetup =
    stripeConnectAccount &&
    (stripeConnectAccount.stripeAccountStatus === "active" ||
      stripeConnectAccount.stripeAccountStatus === "completed");

  // Balance query
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ["providerBalance", userId],
    queryFn: async (): Promise<BalanceData | null> => {
      if (!userId || !isAccountFullySetup) {
        return null;
      }

      const result = (await getProviderStripeBalance()) as any;
      if (result.success) {
        return result.balance;
      }
      throw new Error(result.message || "Failed to load balance");
    },
    enabled: Boolean(userId && isAccountFullySetup),
    staleTime: 30000, // 30 seconds
  });

  // Transactions state for FlashList infinite scroll
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial transactions query
  const { isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["providerTransactions", userId, "initial"],
    queryFn: async (): Promise<{
      transactions: BalanceTransaction[];
      hasMore: boolean;
      nextCursor: string | null;
    } | null> => {
      if (!userId || !isAccountFullySetup) return null;

      const result = (await getProviderBalanceTransactions({})) as any;
      if (result.success) {
        setTransactions(result.transactions);
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
        return {
          transactions: result.transactions,
          hasMore: result.hasMore,
          nextCursor: result.nextCursor,
        };
      }
      throw new Error(result.message || "Failed to load transactions");
    },
    enabled: Boolean(userId && isAccountFullySetup),
    staleTime: 30000, // 30 seconds
  });

  // Load more transactions for infinite scroll
  const loadMoreTransactions = async () => {
    if (!nextCursor || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const result = (await getProviderBalanceTransactions({
        startingAfter: nextCursor,
      })) as any;

      if (result.success && result.transactions.length > 0) {
        setTransactions((prev) => [...prev, ...result.transactions]);
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error("Error loading more transactions:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handlePullToRefresh = () => {
    // Reset pagination state and transactions
    setTransactions([]);
    setNextCursor(null);
    setHasMore(true);
    setIsLoadingMore(false);

    // Reset and refetch the transactions query
    queryClient.invalidateQueries({
      queryKey: ["providerTransactions"],
      exact: false,
    });

    // Also refresh balance
    queryClient.invalidateQueries({
      queryKey: ["providerBalance", userId],
    });
  };

  // Render individual transaction item
  const renderTransaction = ({ item }: { item: BalanceTransaction }) => (
    <Box className="bg-white rounded-lg p-4 border border-gray-200 mx-4 mb-3">
      <VStack className="gap-3">
        {/* Header with type and status */}
        <HStack className="justify-between items-center">
          <HStack className="items-center gap-2">
            <Icon
              as={getTransactionIcon(item.type)}
              size="sm"
              className={getTransactionColor(item.type)}
            />
            <Text className="font-inter-medium text-black capitalize">
              {item.type}
            </Text>
            <Text
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                item.status
              )}`}
            >
              {getStatusText(item.status)}
            </Text>
          </HStack>
          <Text
            className={`font-inter-bold text-xl ${getTransactionColor(
              item.type
            )}`}
          >
            {item.type === "charge" ? "+" : "-"}
            {formatAmount(Math.abs(item.amount), item.currency)}
          </Text>
        </HStack>

        {/* Transaction details */}
        <VStack className="gap-2">
          <HStack className="justify-between">
            <Text className="text-xs text-gray-500">Created:</Text>
            <Text className="text-xs text-gray-700">
              {formatDateTime(item.created)}
            </Text>
          </HStack>

          <HStack className="justify-between">
            <Text className="text-xs text-gray-500">Available On:</Text>
            <Text className="text-xs text-gray-700">
              {formatDate(item.available_on)}
            </Text>
          </HStack>

          <HStack className="justify-between">
            <Text className="text-xs text-gray-500">Transaction ID:</Text>
            <Text className="text-xs text-gray-700 font-mono">
              {item.id.slice(-8)}
            </Text>
          </HStack>

          {/* Financial breakdown */}
          <Box className="bg-gray-50 rounded p-2 mt-1">
            <VStack className="gap-1">
              <HStack className="justify-between">
                <Text className="text-xs text-gray-600">Gross Amount:</Text>
                <Text className="text-xs text-gray-800">
                  {formatAmount(item.amount, item.currency)}
                </Text>
              </HStack>

              {item.fee > 0 && (
                <HStack className="justify-between">
                  <Text className="text-xs text-gray-600">Fee:</Text>
                  <Text className="text-xs text-red-600">
                    -{formatAmount(item.fee, item.currency)}
                  </Text>
                </HStack>
              )}

              <HStack className="justify-between border-t border-gray-200 pt-1">
                <Text className="text-xs font-medium text-gray-700">Net:</Text>
                <Text className="text-xs font-medium text-green-600">
                  {formatAmount(item.net, item.currency)}
                </Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "charge":
        return TrendingUp;
      case "payout":
        return TrendingDown;
      default:
        return DollarSign;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "charge":
        return "text-green-600";
      case "payout":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1 mt-8">
        <VStack className="gap-6">
          <Box className="items-center gap-4">
            {/* <Box className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center">
              <Icon as={Wallet} size="xl" className="text-blue-600" />
            </Box>
            <Text className="text-xl font-inter-bold text-black text-center">
              Account Balance
            </Text> */}
            <Text className="text-sm text-gray-600 text-center leading-5">
              View your available balance and transaction history.
            </Text>
          </Box>

          {/* Balance Summary */}
          <Box className="bg-white rounded-lg border border-gray-200 p-4">
            <Text className="text-lg font-inter-semibold text-black mb-4">
              Balance Summary
            </Text>

            {isLoadingBalance ? (
              <Box className="items-center py-8">
                <Text className="text-gray-500 text-center">
                  Loading balance...
                </Text>
              </Box>
            ) : !balance ? (
              <Box className="items-center py-8">
                <Text className="text-gray-500 text-center mb-4">
                  Balance information not available
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                  Check that your Stripe Connect account is fully set up
                </Text>
              </Box>
            ) : (
              <VStack className="gap-4">
                {balance.available &&
                  balance.available.map((item, index) => (
                    <HStack
                      key={index}
                      className="justify-between items-center"
                    >
                      <VStack>
                        <Text className="font-inter-medium text-black">
                          Available Balance
                        </Text>
                        <Text className="text-sm text-gray-600">
                          Ready for payout
                        </Text>
                      </VStack>
                      <Text className="text-2xl font-inter-bold text-green-600">
                        {formatAmount(item.amount, item.currency)}
                      </Text>
                    </HStack>
                  ))}

                {balance.pending && balance.pending.length > 0 && (
                  <HStack className="justify-between items-center">
                    <VStack>
                      <Text className="font-inter-medium text-black">
                        Pending Balance
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Awaiting settlement
                      </Text>
                    </VStack>
                    <Text className="text-lg font-inter-semibold text-yellow-600">
                      {formatAmount(
                        balance.pending[0].amount,
                        balance.pending[0].currency
                      )}
                    </Text>
                  </HStack>
                )}
              </VStack>
            )}

            <Text className="text-xs text-gray-500 text-center mt-4">
              Pull down on transactions to refresh
            </Text>
          </Box>

          {/* Transaction History */}
          <Box className="bg-white rounded-lg border border-gray-200 p-4">
            <Text className="text-lg font-inter-semibold text-black mb-4">
              Transaction History
            </Text>

            <FlashList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              estimatedItemSize={150}
              onEndReached={loadMoreTransactions}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={isLoadingTransactions}
                  onRefresh={handlePullToRefresh}
                />
              }
              ListEmptyComponent={
                isLoadingTransactions ? (
                  <Box className="items-center py-8">
                    <Text className="text-gray-500">
                      Loading transactions...
                    </Text>
                  </Box>
                ) : (
                  <Box className="bg-gray-50 rounded-lg p-8 items-center">
                    <Icon
                      as={DollarSign}
                      size="xl"
                      className="text-gray-400 mb-4"
                    />
                    <Text className="text-gray-500 text-center">
                      No transactions found
                    </Text>
                  </Box>
                )
              }
              ListFooterComponent={
                isLoadingMore ? (
                  <Box className="items-center py-4">
                    <Text className="text-sm text-gray-500">
                      Loading more transactions...
                    </Text>
                  </Box>
                ) : null
              }
              showsVerticalScrollIndicator={false}
            />
          </Box>
        </VStack>
      </Box>
    </ScrollableScreen>
  );
}
