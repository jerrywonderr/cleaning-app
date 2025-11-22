import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { FirebaseAuthService } from "../firebase/auth";
import { useUserStore } from "../store/useUserStore";

/**
 * Authentication Guard Component
 *
 * This component protects routes and handles authentication-based navigation.
 * It works in conjunction with the Zustand store to provide instant
 * authentication checks without loading states.
 *
 * How it works:
 * 1. Reads authentication state from Zustand store (instant access)
 * 2. Monitors route segments to determine current location
 * 3. Checks email verification status
 * 4. Automatically redirects users based on their authentication status
 * 5. Routes service providers and customers to their respective dashboards
 *
 * Key Benefits:
 * - No loading states (data is in local store)
 * - Instant authentication checks
 * - Automatic role-based routing
 * - Email verification enforcement
 * - Seamless user experience
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const [isCheckingVerification, setIsCheckingVerification] = useState(true);

  // Get authentication state from Zustand store
  // These values are instantly available from local storage
  const { isAuthenticated, isServiceProvider } = useUserStore();

  useEffect(() => {
    const checkAuthAndVerification = async () => {
      // Determine if user is currently in an authentication route
      const inAuthGroup = segments[0] === "(auth)";
      const onVerifyEmailPage = segments[1] === "verify-email";

      if (!isAuthenticated && !inAuthGroup) {
        // User is not authenticated and trying to access protected route
        // Redirect to login page
        router.replace("/login");
      } else if (isAuthenticated) {
        // TEMPORARILY DISABLED: Email verification check
        await FirebaseAuthService.reloadUser();
        const isEmailVerified = FirebaseAuthService.isEmailVerified();
        // const isEmailVerified = true; // TEMP: Skip verification check

        if (!isEmailVerified && !onVerifyEmailPage) {
          // User is authenticated but email not verified
          // Redirect to email verification page
          router.replace("/verify-email");
        } else if (isEmailVerified && inAuthGroup && !onVerifyEmailPage) {
          // User is authenticated, email verified, but still on auth page
          // Redirect to appropriate dashboard based on user role
          if (isServiceProvider) {
            // Service providers go to their dashboard
            router.replace("/service-provider");
          } else {
            // Regular customers go to their dashboard
            router.replace("/customer");
          }
        } else if (isEmailVerified && onVerifyEmailPage) {
          // User verified their email, redirect to dashboard
          if (isServiceProvider) {
            router.replace("/service-provider");
          } else {
            router.replace("/customer");
          }
        }
      }

      setIsCheckingVerification(false);
    };

    checkAuthAndVerification();
  }, [isAuthenticated, isServiceProvider, segments, router]);

  // Render children immediately - no loading state needed
  // since authentication data is available from local store
  return <>{children}</>;
}
