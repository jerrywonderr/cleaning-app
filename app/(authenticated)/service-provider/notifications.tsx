import { Box } from "@/lib/components/ui/box";
import { HStack } from "@/lib/components/ui/hstack";
import { Icon } from "@/lib/components/ui/icon";
import { useLoader } from "@/lib/components/ui/loader/use-loader";
import { Text } from "@/lib/components/ui/text";
import { VStack } from "@/lib/components/ui/vstack";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { Notification } from "@/lib/types/notification";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check } from "lucide-react-native";
import React from "react";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";

export default function NotificationsScreen() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    loadMore,
    hasMore,
    isLoadingMore,
    isRefreshing,
    refresh,
  } = useNotifications();
  const { showLoader, hideLoader } = useLoader();
  const hasLoadedRef = React.useRef(false);

  React.useEffect(() => {
    if (!hasLoadedRef.current) {
      showLoader("Loading notifications...");
      const timer = setTimeout(() => {
        hideLoader();
        hasLoadedRef.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showLoader, hideLoader]);

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    return Bell;
  };

  const capitalizeText = (text: string) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Box
        className={`px-4 py-5 border-b border-gray-200 ${
          !item.read ? "bg-brand-50" : "bg-white"
        }`}
      >
        <HStack className="items-start gap-4">
          <Box
            className={`rounded-full p-3 ${
              !item.read ? "bg-brand-500" : "bg-gray-300"
            }`}
          >
            <Icon
              as={getNotificationIcon(item.type)}
              size="xl"
              className="text-white"
            />
          </Box>
          <VStack className="flex-1 gap-1">
            <Text
              className={`text-base leading-5 ${
                !item.read
                  ? "font-inter-semibold text-brand-700"
                  : "font-inter-medium text-gray-900"
              }`}
            >
              {capitalizeText(
                item.pushNotification?.title || item.type.replace(/_/g, " ")
              )}
            </Text>
            <Text className="text-gray-600 text-sm leading-5 mt-0.5">
              {item.pushNotification?.body || item.message}
            </Text>
            <Text className="text-xs text-gray-400 mt-1.5">
              {item.timestamp?.toDate
                ? formatDistanceToNow(item.timestamp.toDate(), {
                    addSuffix: true,
                  })
                : "Just now"}
            </Text>
          </VStack>
          {!item.read && (
            <Box className="mt-1 w-2.5 h-2.5 rounded-full bg-brand-500" />
          )}
        </HStack>
      </Box>
    </TouchableOpacity>
  );

  return (
    <Box className="flex-1 bg-white">
      {unreadCount > 0 && (
        <TouchableOpacity onPress={markAllAsRead}>
          <Box className="py-4 px-4 bg-brand-50 border-b border-brand-100">
            <HStack className="items-center justify-center gap-2">
              <Icon as={Check} size="md" className="text-brand-600" />
              <Text className="text-brand-600 font-inter-semibold">
                Mark all as read ({unreadCount})
              </Text>
            </HStack>
          </Box>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#6366f1"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <Box className="p-4 items-center">
              <Text className="text-gray-400">Loading more...</Text>
            </Box>
          ) : null
        }
        ListEmptyComponent={
          <Box className="flex-1 items-center justify-center p-8 mt-20">
            <Icon as={Bell} size="xl" className="text-gray-300 mb-4" />
            <Text className="text-gray-500 text-center text-lg font-medium">
              No Notifications
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              You&apos;re all caught up! Notifications will appear here.
            </Text>
          </Box>
        }
      />
    </Box>
  );
}
