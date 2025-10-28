import "@/global.css";
import { GluestackUIProvider } from "@/lib/components/ui/gluestack-ui-provider";
import { NotificationService } from "@/lib/firebase/notificationService";
import { queryClient } from "@/lib/query/queryClient";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { AuthGuard } from "../lib/components/AuthGuard";
import { useAuthSync } from "../lib/hooks/useAuth";

import { LoaderProvider } from "@/lib/components/ui/loader";
import { NotificationProvider } from "@/lib/contexts/NotificationContext";

/**
 * Main App Content Component
 *
 * This component wraps the app with authentication synchronization.
 * The useAuthSync hook runs here to ensure Firebase authentication
 * state is always in sync with the Zustand store.
 *
 * Authentication Flow:
 * 1. App starts → useAuthSync checks Firebase auth state
 * 2. If user is authenticated → profile fetched and stored in Zustand
 * 3. If user is not authenticated → Zustand store is cleared
 * 4. AuthGuard uses Zustand store for instant authentication checks
 * 5. No loading states or API calls needed for basic auth checks
 */
function AppContent() {
  // const colorScheme = useColorScheme();

  useEffect(() => {
    const notificationService = new NotificationService();
    notificationService.initialize();

    // Cleanup on unmount
    return () => {
      notificationService.removeToken();
    };
  }, []);

  // Synchronize Firebase authentication state with Zustand store
  // This hook runs on every app start and when auth state changes
  useAuthSync();

  return (
    <GluestackUIProvider mode="light">
      <NotificationProvider>
        <AuthGuard>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(authenticated)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </AuthGuard>
      </NotificationProvider>
    </GluestackUIProvider>
  );
}

/**
 * Root Layout Component
 *
 * This is the entry point of the app that:
 * 1. Loads custom fonts
 * 2. Sets up React Query for data management
 * 3. Renders the main app content with authentication
 *
 * The authentication system is initialized here and runs
 * throughout the entire app lifecycle.
 */
export default function RootLayout() {
  const [loaded] = useFonts({
    "Inter-Thin": Inter_100Thin,
    "Inter-ExtraLight": Inter_200ExtraLight,
    "Inter-Light": Inter_300Light,
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-ExtraBold": Inter_800ExtraBold,
    "Inter-Black": Inter_900Black,
  });

  if (!loaded) {
    // Wait for fonts to load before rendering the app
    // This only happens in development
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <LoaderProvider>
          <BottomSheetModalProvider>
            <AppContent />
          </BottomSheetModalProvider>
        </LoaderProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
