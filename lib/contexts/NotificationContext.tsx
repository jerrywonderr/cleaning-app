// context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as Notifications from "expo-notifications";

interface NotificationContextType {
  notifications: Notifications.Notification[];
  addNotification: (notification: Notifications.Notification) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<
    Notifications.Notification[]
  >([]);

  useEffect(() => {
    // Listen for notifications received while app is running
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      }
    );

    return () => subscription.remove();
  }, []);

  const addNotification = (notification: Notifications.Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
