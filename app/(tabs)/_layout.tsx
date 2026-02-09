// app/(tabs)/_layout.tsx - FIXED: Proper Keyboard Avoidance

import { Platform, ColorValue, ImageSourcePropType, Keyboard } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { THEME } from '@/lib/theme';
import { Label, NativeTabs, VectorIcon, Icon as TabIcon } from 'expo-router/unstable-native-tabs';

import { useRouter, usePathname, Stack } from 'expo-router';
import React, { useMemo, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';

type VectorIconFamily = {
  getImageSource: (name: string, size: number, color: ColorValue) => Promise<ImageSourcePropType>;
};

interface NativeTabsConfig extends React.PropsWithChildren {
  backgroundColor: string;
  badgeBackgroundColor: string;
  labelStyle: {
    fontWeight: '700';
    fontSize: number;
    color: string;
  };
  iconColor: string;
  tintColor: string;
  labelVisibilityMode: 'labeled';
  indicatorColor: string;
  disableTransparentOnScrollEdge: boolean;
}

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primary;
  const backgroundColor = THEME[currentTheme].card;
  const inactiveTintColor = THEME[currentTheme].mutedForeground;

  const labelSelectedStyle = useMemo(() => ({ color: tintColor }), [tintColor]);

  const nativeLabelStyle = useMemo(
    () => ({
      fontWeight: '700' as const,
      fontSize: 12,
      color: inactiveTintColor,
    }),
    [inactiveTintColor]
  );

  const tabBarConfig = useMemo(
    () => ({
      paddingTop: 8,
      height: 70,

      backgroundColor,
      ...Platform.select({
        android: { elevation: 8 },
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
      }),
    }),
    [backgroundColor]
  );

  // ✅ Hide tabs on activity route

  return (
    <>
      <Stack.Screen key={'header'} options={{ headerShown: false }} />

      <NativeTabs
        {...({
          backgroundColor,
          badgeBackgroundColor: tintColor,
          labelStyle: nativeLabelStyle,
          iconColor: inactiveTintColor,

          tintColor,
          labelVisibilityMode: 'labeled',
          indicatorColor: THEME[currentTheme].muted,
          disableTransparentOnScrollEdge: true,
          tabBarStyle: tabBarConfig,
        } as NativeTabsConfig & { tabBarStyle: typeof tabBarConfig })}>
        <NativeTabs.Trigger name="(home)">
          <TabIcon
            src={<VectorIcon family={MaterialCommunityIcons as VectorIconFamily} name="home" />}
            selectedColor={tintColor}
          />
          <Label selectedStyle={labelSelectedStyle}>Beranda</Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="(profile)">
          <TabIcon
            src={<VectorIcon family={MaterialCommunityIcons as VectorIconFamily} name="account" />}
            selectedColor={tintColor}
          />
          <Label selectedStyle={labelSelectedStyle}>Saya</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </>
  );
}
