import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the login page if not authenticated
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      if (!user?.isServiceProvider) {
        // Redirect to service provider home if authenticated as a service provider
        router.replace("/service-provider");
      } else {
        // Redirect to customer home if authenticated as a customer
        router.replace("/customer");
      }
    }
  }, [isAuthenticated, segments, user, router]);

  return <>{children}</>;
}
