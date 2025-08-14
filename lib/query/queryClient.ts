import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Stale time for queries (how long data is considered fresh)
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Cache time (how long data stays in cache)
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations 1 time
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});
