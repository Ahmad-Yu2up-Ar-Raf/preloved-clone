// app/(tabs)/products.tsx

import { View } from 'react-native';
import React, { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { ChevronLeft } from 'lucide-react-native';
import SearchBar from '@/components/ui/fragments/custom/input/search-bar';
import { router, Stack } from 'expo-router';
import FiltersCarousel from '@/components/ui/fragments/custom/carousel/filter-carousel';
import ExploreProducts from '@/components/ui/core/block/explore-products';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const FILTER_CAROUSEL_HEIGHT = 44;

export default function Products() {
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(0);

  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const translateY = useSharedValue(0);

  const actionBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(translateY.value, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }),
      },
    ],
    opacity: withTiming(translateY.value < -20 ? 0 : 1, { duration: 200 }),
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (lastContentOffset.value > event.contentOffset.y && isScrolling.value) {
        translateY.value = 0;
      } else if (lastContentOffset.value < event.contentOffset.y && isScrolling.value) {
        translateY.value = -(FILTER_CAROUSEL_HEIGHT + 8);
      }
      lastContentOffset.value = event.contentOffset.y;
    },
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onEndDrag: () => {
      isScrolling.value = false;
    },
  });

  const handleHeaderLayout = useCallback((e: any) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0) setHeaderHeight(height);
  }, []);

  const flatListTopOffset = headerHeight + FILTER_CAROUSEL_HEIGHT + 8;

  // ─────────────────────────────────────────────────────────────────────────
  // 🐛 ROOT CAUSE BUG HEADER (DEFINITIF):
  //
  // products.tsx ada di app/(tabs)/products.tsx → ini adalah TAB SCREEN.
  //
  // Di _layout.tsx root, Stack sudah mendefinisikan:
  //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  //
  // Ketika kita tulis <Stack.Screen options={{ headerTransparent: true }}/>
  // di dalam products.tsx (tab screen), Stack.Screen ini mencoba update
  // options pada root Stack's "(tabs)" screen — yang sudah hardcoded
  // headerShown: false di _layout.tsx.
  //
  // React Navigation tidak akan menampilkan header untuk (tabs) screen
  // karena headerShown: false sudah ditetapkan di level root.
  //
  // Stack.Screen dari dalam tab screen TIDAK bisa mengoverride ini.
  // Setiap usaha konfigurasi header via Stack.Screen di tab screen
  // akan diabaikan oleh React Navigation.
  //
  // ✅ FIX DEFINITIF — satu-satunya cara yang benar:
  //   1. Disable semua navigation header (sudah di _layout.tsx)
  //   2. Buat header MANUAL sebagai position: absolute View
  //      di dalam screen content → SIBLINGS dengan carousel
  //   3. Header + Carousel dalam parent View YANG SAMA
  //      → z-index comparison bekerja dengan benar
  //   4. Urutan JSX (bawah = atas z-order) + explicit zIndex:
  //      - ExploreProducts (normal flow, z paling rendah)
  //      - Animated.View carousel (zIndex: 10, elevation: 10)
  //      - Header View (zIndex: 50, elevation: 50) ← PALING AKHIR di JSX
  //
  // Ini adalah satu-satunya arsitektur yang menjamin header SELALU
  // di atas carousel di iOS dan Android.
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* headerShown: false untuk pastikan tidak ada navigation header */}
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background">
        {/* ① CONTENT — paling bawah, render setelah header diukur */}
        {headerHeight > 0 && (
          <ExploreProducts scrollHandler={scrollHandler} topOffset={flatListTopOffset} />
        )}

        {/* ② CAROUSEL — tengah, absolute, zIndex: 10 */}
        {/* Posisi di bawah header karena zIndex lebih kecil */}
        {headerHeight > 0 && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: headerHeight,
                left: 0,
                right: 0,
                zIndex: 10,
              },
              actionBarStyle,
            ]}
            className="bg-background py-1 pb-2">
            <FiltersCarousel />
          </Animated.View>
        )}

        {/* ③ HEADER — PALING AKHIR di JSX = z-order tertinggi secara default */}
        {/* zIndex: 50 + elevation: 50 sebagai explicit override */}
        {/* Dirender terakhir karena ini yang harus paling atas */}
        <View
          onLayout={handleHeaderLayout}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            paddingTop: insets.top,
            zIndex: 50, // iOS: di atas carousel (10)
          }}
          className="bg-background pb-2">
          <View className="flex-row items-center justify-between pr-5">
            <Goback />
            <SearchBar className="w-[86%]" />
          </View>
        </View>
      </View>
    </>
  );
}

function Goback() {
  return (
    <Button
      onPressIn={() => router.push('/(tabs)/explore')}
      size="icon"
      variant="ghost"
      className="ios:size-9 flex-1 rounded-full web:mx-4">
      <Icon as={ChevronLeft} size={30} className="mix-blend-difference" />
    </Button>
  );
}
