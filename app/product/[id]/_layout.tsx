// app/product/[id]/_layout.tsx
// ✅ Layout untuk semua screen di dalam /product/[id]/
// Di sinilah header (Back + Wishlist) hidup — bukan di product/_layout.tsx

import React from 'react';

import { router, Stack } from 'expo-router';

import { TouchableOpacity, View } from 'react-native';

import Animated from 'react-native-reanimated';

const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProductDetailLayout() {
  return (
    <Stack>
      {/* ✅ Screen untuk halaman detail product */}
      <Stack.Screen name="index" />

      {/* ✅ Screen untuk halaman reviews — siap pakai di masa depan */}
    </Stack>
  );
}
