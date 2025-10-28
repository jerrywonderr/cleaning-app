import ScrollableScreen from "@/lib/components/screens/ScrollableScreen";
import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { db } from "@/lib/firebase/config";
import { useUserStore } from "@/lib/store/useUserStore";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { Calendar, CreditCard, DollarSign } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl } from "react-native";

interface PaymentRecord {
  id: string;
  customerId: string;
  serviceRequestId: string;
  amount: number;
  currency: string;
  paymentIntentId: string;
  status: string;
  createdAt: any;
}

export default function PaymentHistoryScreen() {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.profile?.id);

  // Payment history state for FlashList infinite scroll
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial payments query
  const { isLoading: isLoadingPayments } = useQuery({
    queryKey: ["customerPayments", userId, "initial"],
    queryFn: async (): Promise<{
      payments: PaymentRecord[];
      hasMore: boolean;
      nextCursor: string | null;
    } | null> => {
      if (!userId) return null;

      console.log(
        "Fetching initial customer payment history for user:",
        userId
      );

      try {
        const limitSize = 25;
        const firestoreQuery = query(
          collection(db, "paymentHistory"),
          where("customerId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(limitSize)
        );

        const snap = await getDocs(firestoreQuery);
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as PaymentRecord[];

        console.log("Customer payment history fetched items:", items.length);

        const nextCursor =
          snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].id : null;
        const hasMore = snap.size === limitSize;

        setPayments(items);
        setNextCursor(nextCursor);
        setHasMore(hasMore);

        return {
          payments: items,
          hasMore,
          nextCursor,
        };
      } catch (error) {
        console.error("Error fetching customer payment history:", error);
        throw new Error("Failed to load payment history");
      }
    },
    enabled: Boolean(userId),
    staleTime: 30000, // 30 seconds
  });

  // Load more payments for infinite scroll
  const loadMorePayments = async () => {
    if (!nextCursor || !hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const limitSize = 25;
      const cursorDoc = await getDoc(doc(db, "paymentHistory", nextCursor));
      if (cursorDoc.exists()) {
        const firestoreQuery = query(
          collection(db, "paymentHistory"),
          where("customerId", "==", userId),
          orderBy("createdAt", "desc"),
          startAfter(cursorDoc),
          limit(limitSize)
        );

        const snap = await getDocs(firestoreQuery);
        const items = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as PaymentRecord[];

        if (items.length > 0) {
          setPayments((prev) => [...prev, ...items]);
          setNextCursor(
            snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].id : null
          );
          setHasMore(snap.size === limitSize);
        }
      }
    } catch (error) {
      console.error("Error loading more payments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handlePullToRefresh = () => {
    // Reset pagination state and payments
    setPayments([]);
    setNextCursor(null);
    setHasMore(true);
    setIsLoadingMore(false);

    // Reset and refetch the payments query
    queryClient.invalidateQueries({
      queryKey: ["customerPayments"],
      exact: false,
    });
  };

  // Render individual payment item
  const renderPayment = ({ item }: { item: PaymentRecord }) => (
    <Box className="bg-white rounded-lg p-4 border border-gray-200 mx-4 mb-3">
      <VStack className="gap-3">
        <HStack className="justify-between items-start">
          <VStack className="flex-1">
            <Text className="font-inter-semibold text-black">
              Service Request #{item.serviceRequestId.slice(-6)}
            </Text>
            <Text className="text-sm text-gray-600">
              Payment ID: {item.paymentIntentId.slice(-8)}
            </Text>
          </VStack>
          <VStack className="items-end">
            <Text className="font-inter-bold text-lg text-green-600">
              {formatAmount(item.amount, item.currency)}
            </Text>
            <Text
              className={`text-sm font-medium ${getStatusColor(item.status)}`}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </VStack>
        </HStack>

        <HStack className="justify-between">
          <HStack className="gap-2 items-center">
            <Icon as={Calendar} size="sm" className="text-gray-400" />
            <Text className="text-sm text-gray-600">
              {formatDate(item.createdAt?.toDate?.() || item.createdAt)}
            </Text>
          </HStack>
          <HStack className="gap-2 items-center">
            <Icon as={DollarSign} size="sm" className="text-gray-400" />
            <Text className="text-sm text-gray-600">
              {item.currency.toUpperCase()}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <ScrollableScreen addTopInset={false}>
      <Box className="flex-1">
        <VStack className="gap-6">
          <Box className="items-center gap-4">
            <Box className="w-20 h-20 bg-green-100 rounded-full items-center justify-center">
              <Icon as={CreditCard} size="xl" className="text-green-600" />
            </Box>
            <Text className="text-xl font-inter-bold text-black text-center">
              Payment History
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              View all your completed payments and transactions.
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              Pull down to refresh your payment history
            </Text>
          </Box>

          <Box className="gap-4">
            <FlashList
              data={payments}
              renderItem={renderPayment}
              keyExtractor={(item) => item.id}
              estimatedItemSize={120}
              onEndReached={loadMorePayments}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={isLoadingPayments}
                  onRefresh={handlePullToRefresh}
                />
              }
              ListEmptyComponent={
                isLoadingPayments ? (
                  <Box className="items-center py-8">
                    <Text className="text-gray-500">Loading payments...</Text>
                  </Box>
                ) : (
                  <Box className="bg-gray-50 rounded-lg p-8 items-center">
                    <Icon
                      as={CreditCard}
                      size="xl"
                      className="text-gray-400 mb-4"
                    />
                    <Text className="text-gray-500 text-center">
                      No payment history found
                    </Text>
                  </Box>
                )
              }
              ListFooterComponent={
                isLoadingMore ? (
                  <Box className="items-center py-4">
                    <Text className="text-sm text-gray-500">
                      Loading more payments...
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
