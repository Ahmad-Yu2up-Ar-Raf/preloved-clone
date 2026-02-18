// app/product/_layout.tsx
// ✅ Simple passthrough layout untuk group /product
// Tugas utama: mendaftarkan [id] sebagai nested navigator

import { Stack } from 'expo-router';

export default function ProductGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/*
       * ✅ [id] di sini merujuk ke FOLDER [id]/
       * Bukan file [id].tsx — karena kita pakai nested folder structure
       * untuk support /product/[id]/index dan /product/[id]/reviews
       */}
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
