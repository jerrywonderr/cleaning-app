import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useLoader } from "../components/ui/loader/use-loader";
import { db } from "../firebase/config";
import { Notification } from "../types/notification";
import { useAuthState } from "./useAuth";

const NOTIFICATIONS_PER_PAGE = 20;

export const useNotifications = () => {
  const { user } = useAuthState();
  const { showLoader, hideLoader } = useLoader();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLastDoc(null);
      setHasMore(true);
      return;
    }

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("customerId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(NOTIFICATIONS_PER_PAGE)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      let unread = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Notification, "id">;
        notifs.push({ id: doc.id, ...data });
        if (!data.read) unread++;
      });

      setNotifications(notifs);
      setUnreadCount(unread);

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === NOTIFICATIONS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const loadMore = useCallback(async () => {
    if (!user || !hasMore || isLoadingMore || !lastDoc) return;

    setIsLoadingMore(true);

    try {
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("customerId", "==", user.uid),
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(NOTIFICATIONS_PER_PAGE)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }

      const newNotifs: Notification[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Notification, "id">;
        newNotifs.push({ id: doc.id, ...data });
      });

      setNotifications((prev) => [...prev, ...newNotifs]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === NOTIFICATIONS_PER_PAGE);
    } catch (error) {
      console.error("Error loading more notifications:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [user, hasMore, isLoadingMore, lastDoc]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const notifRef = doc(db, "notifications", notificationId);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;

    try {
      showLoader("Marking all as read...");
      const batch = writeBatch(db);
      notifications
        .filter((n) => !n.read)
        .forEach((n) => {
          const notifRef = doc(db, "notifications", n.id);
          batch.update(notifRef, { read: true });
        });

      await batch.commit();
      hideLoader();
    } catch (error) {
      console.error("Error marking all as read:", error);
      hideLoader();
    }
  };

  const refresh = useCallback(async () => {
    if (!user) return;

    setIsRefreshing(true);
    try {
      // Reset pagination and fetch first page
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("customerId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(NOTIFICATIONS_PER_PAGE)
      );

      const snapshot = await getDocs(q);
      const notifs: Notification[] = [];
      let unread = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Notification, "id">;
        notifs.push({ id: doc.id, ...data });
        if (!data.read) unread++;
      });

      setNotifications(notifs);
      setUnreadCount(unread);

      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === NOTIFICATIONS_PER_PAGE);
      } else {
        setLastDoc(null);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loadMore,
    hasMore,
    isLoadingMore,
    isRefreshing,
    refresh,
  };
};
