import React from 'react';

import { Stack } from 'expo-router';

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/ui/fragments/custom/typography/header';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';

export default function HomeLayout() {
  const insets = useSafeAreaInsets();
  const SCREEN_OPTIONS = {
    header: () => (
      <View
        className="safe-area-inset-top left-0 right-0 top-0 h-fit flex-row items-center justify-center bg-secondary px-3.5 pb-2 web:mx-2 dark:bg-muted-foreground/5"
        style={{ paddingTop: insets.top }}>
        <Header title="Profile" />
      </View>
    ),
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={SCREEN_OPTIONS} />
      {/* Tambahkan screen lain di sini jika ada nested routes */}
    </Stack>
  );
}
