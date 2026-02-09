// components/provider/provider.tsx - FIXED VERSION

import React from 'react';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';

// ✅ Import type for better TypeScript support
import type { QueryClientConfig } from '@tanstack/react-query';

type ComponentProps = {
  children?: React.ReactNode;
};

// ✅ Create QueryClient outside component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ✅ Data considered fresh for 1 minute
      staleTime: 60 * 1000, // 1 minute

      // ✅ Cache data for 5 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime in v4)

      // ✅ Retry failed requests 3 times
      retry: 3,

      // ✅ Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // ✅ Refetch on window focus (good for mobile)
      refetchOnWindowFocus: true,

      // ✅ Refetch on reconnect
      refetchOnReconnect: true,

      // ✅ Refetch on mount if data is stale
      refetchOnMount: true,

      // ✅ Network mode
      networkMode: 'online',
    },
    mutations: {
      // ✅ Retry mutations once
      retry: 1,

      // ✅ Network mode for mutations
      networkMode: 'online',
    },
  },
});

export default function Provider({ children }: ComponentProps) {
  const { colorScheme } = useColorScheme();

  // ✅ Focus manager for React Native
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const onAppStateChange = (status: AppStateStatus) => {
    // ✅ Refetch queries when app comes to foreground
    if (Platform.OS !== 'web') {
      if (status === 'active') {
        queryClient.refetchQueries();
      }
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        {children}
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// ✅ Export queryClient for direct access (e.g., invalidating queries)
export { queryClient };
