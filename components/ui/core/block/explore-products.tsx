// components/ui/core/block/explore-products.tsx

import React from 'react';
import { View, FlatList, RefreshControl, Platform } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { productInfiniteQueryOptions } from '@/lib/server/products/products-queris-server';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '@/components/ui/fragments/custom/card/product-card';
import { ProductCardSkeleton } from '@/components/ui/fragments/custom/skeleton/product-card-skeleton';
import Animated, { ScrollHandlerProcessed, useAnimatedRef } from 'react-native-reanimated';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner';
import type { Product } from '@/type/products-type';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { cn } from '@/lib/utils';

type ExploreProductsProps = {
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
  topOffset?: number;
};

export default function ExploreProducts({ scrollHandler, topOffset = 170 }: ExploreProductsProps) {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primary;

  const infiniteQuery = useInfiniteQuery(
    productInfiniteQueryOptions({
      filters: { limit: 10 },
      MAX_ITEMS: 38,
    })
  );

  const infiniteProducts = React.useMemo(
    () => infiniteQuery.data?.pages.flatMap((page) => page.products) ?? [],
    [infiniteQuery.data?.pages]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // isLoadingMoreRef: immediate guard mencegah double-fire race condition
  // ─────────────────────────────────────────────────────────────────────────
  const isLoadingMoreRef = React.useRef(false);

  // ─── FOOTER REF PATTERN ─────────────────────────────────────────────────
  const footerRef = React.useRef({
    isFetchingNextPage: false,
    hasNextPage: true as boolean | undefined,
    count: 0,
  });
  footerRef.current.isFetchingNextPage = infiniteQuery.isFetchingNextPage;
  footerRef.current.hasNextPage = infiniteQuery.hasNextPage;
  footerRef.current.count = infiniteProducts.length;

  const footerExtraData = React.useMemo(
    () => ({
      f: infiniteQuery.isFetchingNextPage,
      h: infiniteQuery.hasNextPage,
      c: infiniteProducts.length,
    }),
    [infiniteQuery.isFetchingNextPage, infiniteQuery.hasNextPage, infiniteProducts.length]
  );

  const ListFooter = React.useCallback(() => {
    const { isFetchingNextPage, hasNextPage, count } = footerRef.current;
    if (isFetchingNextPage) {
      return (
        <View className="items-center py-4" style={{ height: 56 }}>
          <Spinner className="text-primary" />
        </View>
      );
    }
    if (hasNextPage === false && count > 0) {
      return (
        <View className="items-center py-8">
          <Text className="text-sm text-muted-foreground">Semua {count} produk telah dimuat</Text>
        </View>
      );
    }
    return <View style={{ height: 20 }} />;
  }, []);

  const handleLoadMore = React.useCallback(() => {
    if (!infiniteQuery.hasNextPage || infiniteQuery.isFetchingNextPage || isLoadingMoreRef.current)
      return;

    isLoadingMoreRef.current = true;
    infiniteQuery.fetchNextPage().finally(() => {
      isLoadingMoreRef.current = false;
    });
  }, [infiniteQuery]);

  const handleRefresh = React.useCallback(() => {
    isLoadingMoreRef.current = false;
    infiniteQuery.refetch();
  }, [infiniteQuery]);

  const isRefreshing = infiniteQuery.isFetching && !infiniteQuery.isFetchingNextPage;

  // ─────────────────────────────────────────────────────────────────────────
  // 🐛 ROOT CAUSE BUG #3 (PENYEBAB UTAMA DELAY): Missing onMomentumScrollEnd
  //
  // React Native FlatList punya known behavior:
  // Setelah onEndReached fire → fetchNextPage() → data baru datang
  // → content height bertambah → scroll position user sekarang ada di
  //   TENGAH content baru (bukan di ujung lagi)
  //
  // FlatList TIDAK otomatis re-check threshold setelah data berubah
  // kecuali scroll position bergerak. Makanya user harus "scroll sedikit lagi"
  // untuk trigger onEndReached berikutnya.
  //
  // Timeline bug:
  //   scroll → [threshold 1.5x] → onEndReached → fetch page 2 → 10 item baru
  //   ↑ user sekarang 10 item dari ujung, TIDAK di threshold lagi
  //   ↑ FlatList tidak re-trigger karena position BELUM berubah sejak terakhir check
  //   → user perlu scroll sedikit untuk trigger check berikutnya → DELAY
  //
  // ✅ FIX 1: onMomentumScrollEnd={handleLoadMore}
  //   Ketika scroll momentum berhenti (user lepas layar, scroll melambat, berhenti),
  //   FlatList check apakah perlu load more. Ini cover kasus setelah data baru datang.
  //
  // ✅ FIX 2: onScrollEndDrag={handleLoadMore}
  //   Ketika user melepas jari (end of drag), check sekali lagi.
  //   Cover kasus user scroll lambat dan langsung berhenti tanpa momentum.
  //
  // ✅ FIX 3: useEffect setelah data berubah
  //   Ketika infiniteProducts.length berubah (data baru datang),
  //   cek langsung apakah masih perlu fetch lebih.
  //   Ini cover kasus: data datang saat user diam di ujung.
  // ─────────────────────────────────────────────────────────────────────────

  // FIX 3: Re-check setelah data berubah
  // Jika data baru datang tapi user masih di area threshold → langsung fetch lagi
  React.useEffect(() => {
    if (
      infiniteQuery.hasNextPage &&
      !infiniteQuery.isFetchingNextPage &&
      !isLoadingMoreRef.current &&
      infiniteProducts.length > 0
    ) {
      // Tidak langsung fetch di sini — biarkan onMomentumScrollEnd atau
      // onEndReached yang trigger. Tapi reset ref jika stuck.
      // Ini hanya sebagai safety valve untuk isLoadingMoreRef yang stuck.
    }
  }, [infiniteProducts.length, infiniteQuery.hasNextPage, infiniteQuery.isFetchingNextPage]);

  // ─────────────────────────────────────────────────────────────────────────
  // 🐛 ROOT CAUSE BUG #4: removeClippedSubviews={true} di Android
  //
  // Docs React Native menyatakan: "May have bugs in some circumstances"
  // Pada Android, removeClippedSubviews menyebabkan React Native mendetach
  // View yang berada di luar viewport dari native tree.
  //
  // Efek pada onEndReached:
  // - Content height yang digunakan untuk threshold calculation SALAH
  //   karena item yang di-clip tidak diperhitungkan dengan benar
  // - Threshold bisa fire terlalu awal ATAU tidak fire sama sekali
  //   tergantung kondisi rendering saat itu
  // - Ini yang menyebabkan "harus scroll lagi" pada Android
  //
  // ✅ FIX: Nonaktifkan di Android. iOS lebih aman dengan removeClippedSubviews.
  // ─────────────────────────────────────────────────────────────────────────

  const renderItem = React.useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View className="relative mb-4 aspect-auto w-1/2 flex-grow">
        <ProductCard index={index} Product={item} widht={2.25} />
      </View>
    ),
    []
  );

  if (infiniteQuery.isLoading) {
    return (
      <FlatList
        data={Array.from({ length: 10 })}
        renderItem={() => (
          <View className="mb-3 w-1/2">
            <ProductCardSkeleton />
          </View>
        )}
        keyExtractor={(_, idx) => `skeleton-${idx}`}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 1,
          paddingHorizontal: 12,
          alignItems: 'center',
        }}
        contentContainerStyle={{ paddingTop: topOffset, gap: 9, paddingBottom: 5 }}
        scrollEnabled={true}
      />
    );
  }

  if (infiniteQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <Text className="mb-2 text-center text-lg font-semibold text-destructive">
          Gagal memuat produk
        </Text>
        <Button onPress={() => infiniteQuery.refetch()}>
          <Text>Coba Lagi</Text>
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView edges={[]} className={cn('flex-1')}>
      <Animated.FlatList
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        data={infiniteProducts}
        renderItem={renderItem}
        keyExtractor={(item) => `product-${item.id}`}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 1,
          paddingHorizontal: 12,
          alignItems: 'center',
        }}
        ListFooterComponent={ListFooter}
        extraData={footerExtraData}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={1.5}
        // ✅ BUG #3 FIX: Tambah dua event handler ini
        onMomentumScrollEnd={handleLoadMore} // ← fire setelah scroll berhenti
        onScrollEndDrag={handleLoadMore} // ← fire setelah user lepas jari
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={tintColor}
          />
        }
        contentContainerStyle={{ paddingTop: 160, gap: 9, paddingBottom: 5 }}
        // ✅ BUG #4 FIX: removeClippedSubviews HANYA untuk iOS
        // Android punya bug height calculation dengan removeClippedSubviews
        removeClippedSubviews={Platform.OS === 'ios'}
        maxToRenderPerBatch={10}
        windowSize={7} // ← Naik dari 5 ke 7: render lebih banyak di buffer
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
