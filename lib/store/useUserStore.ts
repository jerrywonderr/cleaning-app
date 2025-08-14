import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { UserProfile } from "../firebase/firestore";

/**
 * User State Interface
 *
 * This store manages user authentication state and profile data locally.
 * It works in conjunction with Firebase Auth to provide fast, persistent
 * access to user information without requiring API calls.
 */
interface UserState {
  // User profile data from Firestore
  profile: UserProfile | null;

  // Authentication state (derived from profile existence)
  isAuthenticated: boolean;

  // User role for routing and UI decisions
  isServiceProvider: boolean;

  // Actions to manipulate the state
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

/**
 * Zustand Store with Persistence
 *
 * This store automatically persists user data to AsyncStorage,
 * allowing the app to maintain authentication state across app restarts.
 *
 * Key Benefits:
 * - Instant authentication checks (no loading states)
 * - Persistent sessions across app restarts
 * - Fast access to user data in components
 * - Automatic sync with Firebase auth state
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state - user starts as unauthenticated
      profile: null,
      isAuthenticated: false,
      isServiceProvider: false,

      /**
       * Set User Profile
       *
       * Called when:
       * - User logs in (profile fetched from Firestore)
       * - User signs up (profile created in Firestore)
       * - App starts and user is already authenticated
       *
       * This action updates all related state properties atomically
       * to ensure consistency between profile, authentication status,
       * and user role.
       */
      setProfile: (profile: UserProfile | null) => {
        set({
          profile,
          isAuthenticated: !!profile, // true if profile exists, false if null
          isServiceProvider: profile?.isServiceProvider || false,
        });
      },

      /**
       * Update User Profile
       *
       * Called when user information changes (e.g., phone number update).
       * Only updates the specified fields while preserving existing data.
       * Automatically updates the updatedAt timestamp.
       */
      updateProfile: (updates: Partial<UserProfile>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          const updatedProfile = {
            ...currentProfile,
            ...updates,
            updatedAt: new Date(),
          };
          set({
            profile: updatedProfile,
            isServiceProvider: updatedProfile.isServiceProvider || false,
          });
        }
      },

      /**
       * Clear User Profile
       *
       * Called when:
       * - User logs out
       * - Firebase auth state changes to unauthenticated
       * - App needs to reset user state
       *
       * Resets all authentication-related state to initial values.
       */
      clearProfile: () => {
        set({
          profile: null,
          isAuthenticated: false,
          isServiceProvider: false,
        });
      },
    }),
    {
      // Persistence configuration
      name: "user-store", // Key used in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence

      // Persist all authentication state for seamless app experience
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        isServiceProvider: state.isServiceProvider,
      }),
    }
  )
);
