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
  } = useNotifications();
  const { showLoader, hideLoader } = useLoader();
  const [refreshing, setRefreshing] = React.useState(false);
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type: string) => {
    return Bell;
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity onPress={() => handleNotificationPress(item)}>
      <Box
        className={`p-4 border-b border-gray-200 ${
          !item.read ? "bg-blue-50" : "bg-white"
        }`}
      >
        <HStack className="items-start space-x-3">
          <Box
            className={`mt-1 rounded-full p-2 ${
              !item.read ? "bg-primary-500" : "bg-gray-300"
            }`}
          >
            <Icon
              as={getNotificationIcon(item.type)}
              size="sm"
              className="text-white"
            />
          </Box>
          <VStack className="flex-1">
            <Text className={`text-base ${!item.read ? "font-semibold" : ""}`}>
              {item.pushNotification?.title || item.type.replace(/_/g, " ")}
            </Text>
            <Text className="text-gray-600 mt-1">
              {item.pushNotification?.body || item.message}
            </Text>
            <Text className="text-xs text-gray-400 mt-2">
              {item.timestamp?.toDate
                ? formatDistanceToNow(item.timestamp.toDate(), {
                    addSuffix: true,
                  })
                : "Just now"}
            </Text>
          </VStack>
          {!item.read && (
            <Box className="mt-1 w-2 h-2 rounded-full bg-primary-500" />
          )}
        </HStack>
      </Box>
    </TouchableOpacity>
  );

  return (
    <Box className="flex-1 bg-white">
      {unreadCount > 0 && (
        <TouchableOpacity onPress={markAllAsRead}>
          <Box className="p-3 bg-gray-50 border-b border-gray-200">
            <HStack className="items-center justify-center space-x-2">
              <Icon as={Check} size="sm" className="text-primary-500" />
              <Text className="text-primary-500 font-medium">
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
