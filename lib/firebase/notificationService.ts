// services/notificationService.ts
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
  arrayRemove,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Platform } from "react-native";
import { auth } from "../firebase/auth";
import { db } from "../firebase/config";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  async initialize(): Promise<void> {
    try {
      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn("Notification permission denied");
        return;
      }

      // Get and save push token
      const token = await this.getPushToken();
      if (token) {
        await this.saveTokenToBackend(token);
      }

      // Setup notification listeners
      this.setupNotificationListeners();

      console.log("Push notifications initialized successfully");
    } catch (error) {
      console.error("Failed to initialize push notifications:", error);
    }
  }

  private async requestPermissions(): Promise<boolean> {
    try {
      if (Device.isDevice) {
        // Set up Android notification channel first
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "Default notifications",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn("Failed to get push token for push notification!");
          return false;
        }

        return true;
      } else {
        console.warn("Must use physical device for Push Notifications");
        return false;
      }
    } catch (error) {
      console.error("Permission request failed:", error);
      return false;
    }
  }

  private async getPushToken(): Promise<string | null> {
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error("Project ID not found");
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      console.log("Expo push token:", token.data);
      return token.data;
    } catch (error) {
      console.error("Failed to get push token:", error);
      return null;
    }
  }

  private async saveTokenToBackend(token: string): Promise<void> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.warn("No user logged in, cannot save token");
        return;
      }

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
        updatedAt: serverTimestamp(),
      });
      console.log("Token saved to Firestore successfully");
    } catch (error) {
      console.error("Failed to save token to Firestore:", error);
    }
  }

  private setupNotificationListeners(): void {
    // Handle notifications received while app is running
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
      this.handleNotificationReceived(notification);
    });

    // Handle notification taps
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification tapped:", response);
      this.handleNotificationTap(response);
    });
  }

  private handleNotificationReceived(
    notification: Notifications.Notification
  ): void {
    // You can show an in-app alert or update UI here
    const { title, body, data } = notification.request.content;

    // Example: Show an alert
    // Alert.alert(title || 'New Notification', body || 'You have a new notification');

    // Or update your app's state/context
    // notificationContext.addNotification(notification);
  }

  private handleNotificationTap(
    response: Notifications.NotificationResponse
  ): void {
    const { data } = response.notification.request.content;

    // Navigate based on notification data
    if (data?.serviceRequestId) {
      // Navigate to service request details
      // navigation.navigate('ServiceRequestDetails', { id: data.serviceRequestId });
    } else if (data?.type === "payment_success") {
      // Navigate to payment success screen
      // navigation.navigate('PaymentSuccess');
    }
  }

  async removeToken(): Promise<void> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.warn("No user logged in, cannot remove token");
        return;
      }

      const token = await this.getPushToken();
      if (token) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          fcmTokens: arrayRemove(token),
          updatedAt: serverTimestamp(),
        });
        console.log("Token removed from Firestore");
      }
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  }

  // Method to schedule local notifications (optional)
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Show immediately
    });
  }
}
