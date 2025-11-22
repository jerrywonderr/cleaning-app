import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FirebaseAuthService, SignInData, SignUpData } from "../firebase/auth";
import {
  CreateUserProfileData,
  FirebaseFirestoreService,
} from "../firebase/firestore";
import { deleteUserAccount as deleteUserAccountFn } from "../services/cloudFunctionsService";
import { useUserStore } from "../store/useUserStore";

/**
 * Query Keys for React Query
 *
 * These keys are used to identify and manage cached data:
 * - AUTH_QUERY_KEY: For current user authentication state
 * - USER_PROFILE_QUERY_KEY: For user profile data from Firestore
 */
export const AUTH_QUERY_KEY = ["auth", "currentUser"];
export const USER_PROFILE_QUERY_KEY = ["user", "profile"];

/**
 * Hook to get current user from Firebase Auth
 *
 * This hook queries Firebase directly for the current user.
 * It's used by components that need raw Firebase user data.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => FirebaseAuthService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for user registration
 *
 * This hook handles the complete signup flow:
 * 1. Creates Firebase Auth user
 * 2. Creates user profile in Firestore
 * 3. Stores profile in Zustand for instant access
 * 4. Invalidates related queries to refresh data
 */
export function useSignUp() {
  const queryClient = useQueryClient();
  const { setProfile } = useUserStore();

  return useMutation({
    mutationFn: async (data: SignUpData) => {
      // Step 1: Create Firebase Auth user
      const authUser = await FirebaseAuthService.signUp(data);

      // Step 2: Send email verification
      await FirebaseAuthService.sendEmailVerification();

      // Step 3: Create user profile in Firestore
      const profileData: CreateUserProfileData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        // dob: data.dob,
        isServiceProvider: data.isServiceProvider,
      };

      const userProfile = await FirebaseFirestoreService.createUserProfile(
        authUser.id,
        profileData
      );

      // Step 4: Store profile in Zustand for instant access
      setProfile(userProfile);

      return authUser;
    },
    onSuccess: () => {
      // Step 5: Invalidate and refetch related data
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      // Error handling is done by the component using this hook
      console.error("Sign up error:", error);
    },
  });
}

/**
 * Hook for user authentication
 *
 * This hook handles the complete signin flow:
 * 1. Authenticates with Firebase Auth
 * 2. Fetches user profile from Firestore
 * 3. Stores profile in Zustand for instant access
 * 4. Invalidates related queries to refresh data
 */
export function useSignIn() {
  const queryClient = useQueryClient();
  const { setProfile } = useUserStore();

  return useMutation({
    mutationFn: async (data: SignInData) => {
      // Step 1: Authenticate with Firebase Auth
      const authUser = await FirebaseAuthService.signIn(data);

      // Step 2: Fetch user profile from Firestore
      const userProfile = await FirebaseFirestoreService.getUserProfile(
        authUser.id
      );

      // Step 3: Store profile in Zustand for instant access
      if (userProfile) {
        setProfile(userProfile);
      }

      // Return combined auth user and profile data
      return {
        ...authUser,
        ...userProfile,
      };
    },
    onSuccess: () => {
      // Step 4: Invalidate and refetch related data
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      // Error handling is done by the component using this hook
      console.error("Sign in error:", error);
    },
  });
}

/**
 * Hook for user logout
 *
 * This hook handles the complete signout flow:
 * 1. Signs out from Firebase Auth
 * 2. Clears user profile from Zustand store
 * 3. Invalidates related queries to clear cached data
 */
export function useSignOut() {
  const queryClient = useQueryClient();
  const { clearProfile } = useUserStore();

  return useMutation({
    mutationFn: () => FirebaseAuthService.signOut(),
    onSuccess: () => {
      // Clear the profile from Zustand store
      clearProfile();

      // Invalidate and refetch related data
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error("Sign out error:", error);
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { clearProfile } = useUserStore();

  return useMutation({
    mutationFn: async () => {
      const currentUser = FirebaseAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be signed in to delete your account.");
      }
      await deleteUserAccountFn();
    },
    onSuccess: () => {
      clearProfile();
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
    onError: (error: any) => {
      console.error("Delete account error:", error);
    },
  });
}

/**
 * Hook for password reset
 *
 * Sends password reset email to the user's email address.
 * Error handling is done by the component using this hook.
 */
export function usePasswordReset() {
  return useMutation({
    mutationFn: (email: string) => FirebaseAuthService.sendPasswordReset(email),
    onError: (error: any) => {
      console.error("Password reset error:", error);
    },
  });
}

export function useSendEmailVerification() {
  return useMutation({
    mutationFn: () => FirebaseAuthService.sendEmailVerification(),
    onError: (error: any) => {
      console.error("Email verification error:", error);
    },
  });
}

/**
 * Hook to get authentication state from Firebase
 *
 * This hook listens to Firebase authentication state changes
 * and provides real-time updates about user authentication status.
 *
 * It's used by useAuthSync to keep the Zustand store in sync
 * with Firebase authentication state.
 */
export function useAuthState() {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: any;
    isLoading: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = FirebaseAuthService.onAuthStateChanged(
      (firebaseUser) => {
        setAuthState({
          isAuthenticated: !!firebaseUser,
          user: firebaseUser,
          isLoading: false,
        });
      }
    );

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return authState;
}

/**
 * Simple hook for components that just need to know if user is authenticated
 *
 * This hook provides a simplified interface to authentication state.
 * It's used by components that don't need detailed user information.
 */
export function useIsAuthenticated() {
  const { isAuthenticated, isLoading, user } = useAuthState();
  return {
    isAuthenticated,
    isLoading,
    user,
  };
}

/**
 * Hook to get user profile data from Firestore
 *
 * This hook fetches user profile data from Firestore.
 * It's used by components that need detailed user profile information
 * and don't want to rely on the Zustand store.
 */
export function useUserProfile(userId?: string) {
  const { data: currentUser } = useCurrentUser();
  const id = userId || currentUser?.uid;

  return useQuery({
    queryKey: [...USER_PROFILE_QUERY_KEY, id],
    queryFn: () => {
      if (!id) return null;
      return FirebaseFirestoreService.getUserProfile(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to get user type (service provider vs customer)
 *
 * This hook provides user role information from the Zustand store.
 * Since the store is automatically synced with Firebase auth state,
 * this hook provides instant access to user role without API calls.
 *
 * Key Benefits:
 * - No loading states (data is in local store)
 * - Instant access to user role for routing decisions
 * - Automatic sync with Firebase authentication state
 */
export function useUserType() {
  const { profile, isServiceProvider, isAuthenticated } = useUserStore();

  return {
    isServiceProvider,
    isLoading: false, // No loading state needed since data is in store
    profile,
    isAuthenticated,
  };
}

/**
 * Hook to sync Firebase auth state with Zustand store
 *
 * This hook is the bridge between Firebase authentication and the Zustand store.
 * It runs in the main app layout and ensures that:
 *
 * 1. When the app starts, it checks Firebase auth state
 * 2. If user is authenticated, it fetches and stores their profile
 * 3. If user is not authenticated, it clears the stored profile
 * 4. When auth state changes, it automatically syncs the store
 *
 * This hook is essential for maintaining consistency between
 * Firebase authentication state and local user data.
 */
export function useAuthSync() {
  const { setProfile, clearProfile } = useUserStore();
  const { user, isLoading } = useAuthState();

  useEffect(() => {
    // Don't sync while Firebase is still determining auth state
    if (isLoading) return;

    if (user) {
      // User is authenticated, fetch and store their profile
      const fetchAndStoreProfile = async () => {
        try {
          const userProfile = await FirebaseFirestoreService.getUserProfile(
            user.uid
          );
          if (userProfile) {
            setProfile(userProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile during sync:", error);
        }
      };

      fetchAndStoreProfile();
    } else {
      // User is not authenticated, clear the profile
      clearProfile();
    }
  }, [user, isLoading, setProfile, clearProfile]);

  return { isLoading };
}
