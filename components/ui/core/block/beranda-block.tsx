// components/ui/core/block/beranda-block.tsx

import React from 'react';
import { View, FlatList, RefreshControl, Platform } from 'react-native';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  productQueryOptions,
  productInfiniteQueryOptions,
} from '@/lib/server/products/products-queris-server';
import { sellerQueryOptions } from '@/lib/server/sellers/sellers-queris-server';
import ProductCarousel from '@/components/ui/fragments/custom/carousel/product-carousel';
import SellerCarousel from '@/components/ui/fragments/custom/carousel/seller-carousel';
import { ProductCard } from '@/components/ui/fragments/custom/card/product-card';
import { ProductCardSkeleton } from '@/components/ui/fragments/custom/skeleton/product-card-skeleton';
import { HeaderAction } from '@/components/ui/fragments/custom/typography/header';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Spinner } from '../../fragments/shadcn-ui/spinner';
import type { Product } from '@/type/products-type';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { router } from 'expo-router';
import OnboardingCarousel from '../../fragments/custom/carousel/onboarding-carousel';

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primary;

  const forYouQuery = useQuery(productQueryOptions({ limit: 6, offset: 0 }));
  const yourLikesQuery = useQuery(productQueryOptions({ limit: 6, offset: 30 }));
  const recentQuery = useQuery(productQueryOptions({ limit: 6, offset: 20 }));
  const sellersQuery = useQuery(sellerQueryOptions({ limit: 4 }));

  const infiniteQuery = useInfiniteQuery(
    productInfiniteQueryOptions({
      filters: { limit: 10 },
      MAX_ITEMS: 20,
    })
  );

  const infiniteProducts = React.useMemo(
    () => infiniteQuery.data?.pages.flatMap((page) => page.products) ?? [],
    [infiniteQuery.data?.pages]
  );

  // ─── isLoadingMoreRef: immediate guard, sama seperti explore-products ───
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

  // ─────────────────────────────────────────────────────────────────────────
  // 🐛 ROOT CAUSE BERANDA BUG #1: handleLoadMore missing isLoadingMoreRef
  //
  // Tanpa isLoadingMoreRef, ketika onEndReached + onMomentumScrollEnd keduanya
  // fire hampir bersamaan (keduanya diperlukan), fetchNextPage() bisa dipanggil
  // dua kali sebelum React state update isFetchingNextPage: true.
  //
  // ✅ FIX: Triple guard — sama persis dengan explore-products.tsx
  // ─────────────────────────────────────────────────────────────────────────
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
    forYouQuery.refetch();
    yourLikesQuery.refetch();
    recentQuery.refetch();
    sellersQuery.refetch();
    infiniteQuery.refetch();
  }, [forYouQuery, yourLikesQuery, recentQuery, sellersQuery, infiniteQuery]);

  const isRefreshing =
    (forYouQuery.isFetching && !forYouQuery.isLoading) ||
    (yourLikesQuery.isFetching && !yourLikesQuery.isLoading) ||
    (recentQuery.isFetching && !recentQuery.isLoading) ||
    (infiniteQuery.isFetching && !infiniteQuery.isFetchingNextPage);

  // ─────────────────────────────────────────────────────────────────────────
  // 🐛 ROOT CAUSE BERANDA BUG #2: ListHeader deps pakai full query object
  //
  // useCallback([forYouQuery, yourLikesQuery, recentQuery, sellersQuery])
  //
  // TanStack Query mengembalikan OBJECT BARU setiap kali komponen re-render
  // (object identity berubah meski data tidak berubah).
  //
  // Efek: deps berubah SETIAP RENDER → useCallback recreate ListHeader
  // SETIAP RENDER → function reference baru → FlatList lihat type berbeda
  // → UNMOUNT + REMOUNT header setiap render.
  //
  // Dengan 4 query aktif (forYou, yourLikes, recent, sellers), header
  // di-remount berkali-kali bahkan saat user hanya scroll.
  // Ini menyebabkan:
  //   a) Semua carousel dalam ListHeader di-destroy + re-create setiap render
  //   b) Semua gambar di carousel reload dari scratch setiap render
  //   c) Scroll position dalam carousel reset ke 0 setiap render
  //   d) FlatList layout calculation ulang setiap header mount baru
  //   e) MASSIVE lag → scrolling berat, navigasi lambat
  //
  // ✅ FIX: Pakai ref pattern yang sama dengan ListFooter
  //   Step 1: Extract hanya primitive/stable values yang dibutuhkan
  //   Step 2: Simpan di headerRef yang diupdate synchronously setiap render
  //   Step 3: ListHeader pakai useCallback([]) → EMPTY DEPS → stable selamanya
  //   Step 4: FlatList TIDAK pernah remount header
  // ─────────────────────────────────────────────────────────────────────────
  const headerRef = React.useRef({
    forYouProducts: [] as any[],
    forYouLoading: true,
    yourLikesProducts: [] as any[],
    yourLikesLoading: true,
    recentProducts: [] as any[],
    recentLoading: true,
    sellers: [] as any[],
    sellersLoading: true,
  });
  // Update ref synchronously — TIDAK trigger re-render
  headerRef.current.forYouProducts = forYouQuery.data?.products ?? [];
  headerRef.current.forYouLoading = forYouQuery.isLoading;
  headerRef.current.yourLikesProducts = yourLikesQuery.data?.products ?? [];
  headerRef.current.yourLikesLoading = yourLikesQuery.isLoading;
  headerRef.current.recentProducts = recentQuery.data?.products ?? [];
  headerRef.current.recentLoading = recentQuery.isLoading;
  headerRef.current.sellers = sellersQuery.data?.sellers ?? [];
  headerRef.current.sellersLoading = sellersQuery.isLoading;

  // extraData untuk header — berubah saat data query berubah
  // → FlatList re-render → ListHeader dipanggil → baca ref terbaru
  const headerExtraData = React.useMemo(
    () => ({
      fy: forYouQuery.dataUpdatedAt,
      yl: yourLikesQuery.dataUpdatedAt,
      r: recentQuery.dataUpdatedAt,
      s: sellersQuery.dataUpdatedAt,
    }),
    [
      forYouQuery.dataUpdatedAt,
      yourLikesQuery.dataUpdatedAt,
      recentQuery.dataUpdatedAt,
      sellersQuery.dataUpdatedAt,
    ]
  );

  // EMPTY DEPS → stable reference selamanya → FlatList TIDAK pernah remount
  const ListHeader = React.useCallback(() => {
    const h = headerRef.current;
    return (
      <View className="gap-8">
        <OnboardingCarousel
          deskription="Pelajari cara pakai Preloved!"
          title="Welcome Kak"
          isLoading={h.forYouLoading}
        />
        <ProductCarousel
          title="For You"
          products={h.forYouProducts}
          isLoading={h.forYouLoading}
          onSeeAllPress={() => router.push('/(tabs)/explore')}
        />
        <ProductCarousel
          title="Your Likes"
          products={h.yourLikesProducts}
          isLoading={h.yourLikesLoading}
          onSeeAllPress={() => router.push('/(tabs)/explore')}
        />
        <ProductCarousel
          title="Baru Dilihat"
          products={h.recentProducts}
          isLoading={h.recentLoading}
          onSeeAllPress={() => router.push('/(tabs)/explore')}
        />
        <SellerCarousel
          title="Rekomendasi seller"
          sellers={h.sellers}
          isLoading={h.sellersLoading}
          onSellerPress={(seller) => console.log('Seller:', seller.id)}
          onSeeAllPress={() => router.push('/(tabs)/explore?tab=sellers')}
        />
        <View className="px-5">
          <HeaderAction title="Hot Items" onPress={() => router.push('/(tabs)/explore')} />
        </View>
      </View>
    );
  }, []); // ← EMPTY DEPS

  // EMPTY DEPS → stable reference selamanya
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
  }, []); // ← EMPTY DEPS

  const renderItem = React.useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <View className="relative mb-4 aspect-auto w-1/2 flex-grow">
        <ProductCard index={index} Product={item} widht={2.25} />
      </View>
    ),
    []
  );

  // Combined extraData: signal FlatList untuk re-render saat header atau footer berubah
  const combinedExtraData = React.useMemo(
    () => ({ ...headerExtraData, ...footerExtraData }),
    [headerExtraData, footerExtraData]
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
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingTop: 30, gap: 9, paddingBottom: 5 }}
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
    <FlatList
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
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      extraData={combinedExtraData}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={1.5}
      // ✅ Sama dengan explore-products: cover kasus re-check setelah data datang
      onMomentumScrollEnd={handleLoadMore}
      onScrollEndDrag={handleLoadMore}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={tintColor} />
      }
      contentContainerStyle={{ paddingTop: 30, gap: 9, paddingBottom: 5 }}
      // ✅ Android removeClippedSubviews bug → hanya aktifkan di iOS
      removeClippedSubviews={Platform.OS === 'ios'}
      maxToRenderPerBatch={10}
      windowSize={7}
      initialNumToRender={6}
      showsVerticalScrollIndicator={false}
    />
  );
}
