import "@/global.css";
import { GluestackUIProvider } from "@/lib/components/ui/gluestack-ui-provider";
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
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { AuthGuard } from "../lib/components/AuthGuard";
import { useAuthSync } from "../lib/hooks/useAuth";

import { useColorScheme } from "@/lib/hooks/useColorScheme";

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
  const colorScheme = useColorScheme();

  // Synchronize Firebase authentication state with Zustand store
  // This hook runs on every app start and when auth state changes
  useAuthSync();

  return (
    <GluestackUIProvider mode={colorScheme === "dark" ? "dark" : "light"}>
      <AuthGuard>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
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
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
