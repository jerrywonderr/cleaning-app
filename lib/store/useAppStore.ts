import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface LocalAppState {
  balanceVisibile: boolean;
  toggleBalanceVisibility: () => void;
}

export const useAppStore = create<LocalAppState>()(
  persist(
    (set, get) => ({
      balanceVisibile: true,
      toggleBalanceVisibility: () => {
        const { balanceVisibile } = get();
        set({ balanceVisibile: !balanceVisibile });
      },
    }),
    {
      // Persistence configuration
      name: "app-local-store", // Key used in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for persistence

      partialize: (state) => ({
        balanceVisibile: state.balanceVisibile,
      }),
    }
  )
);
