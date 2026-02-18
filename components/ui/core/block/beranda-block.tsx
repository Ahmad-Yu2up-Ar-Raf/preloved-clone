// app/(tabs)/home/index.tsx - COMPLETE FIXED with Platzi API

import React from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  productCategoryQueryOptions,
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
import { Spinner } from '@/components/ui/fragments/shadcn-ui/spinner';
import type { Product } from '@/type/products-type';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { router } from 'expo-router';
 
import OnboardingCarousel from '../../fragments/custom/carousel/onboarding-carousel';

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primary;

  // ✅ Query 1: Clothes category (categoryId: 1)
  const clothesQuery = useQuery(productCategoryQueryOptions(5, { limit:6 }));

  // ✅ Query 2: Electronics category (categoryId: 2)
  const electronicsQuery = useQuery(productCategoryQueryOptions(4, { limit: 2 }));

  // ✅ Query 3: Furniture category (categoryId: 3)
  const furnitureQuery = useQuery(productCategoryQueryOptions(3, { limit: 5 }));

  // ✅ Query 4: Sellers with top products (PLATZI!)
  const sellersQuery = useQuery(sellerQueryOptions({ limit: 4 }));

  // ✅ Query 5: Infinite scroll - FIXED!
  const infiniteQuery = useInfiniteQuery(
    productInfiniteQueryOptions({
      limit: 10,
    })
  );

  // ✅ Flatten pages - memoized
  const infiniteProducts = React.useMemo(
    () => infiniteQuery.data?.pages.flatMap((page) => page.products) ?? [],
    [infiniteQuery.data?.pages]
  );

  // ✅ FIXED: NO DEBOUNCE, instant guard
  const handleLoadMore = React.useCallback(() => {
    if (!infiniteQuery.hasNextPage || infiniteQuery.isFetchingNextPage) {
      return; // Early exit
    }
    infiniteQuery.fetchNextPage(); // Direct call
  }, [infiniteQuery]);

  // Refetch all
  const handleRefresh = React.useCallback(() => {
    clothesQuery.refetch();
    electronicsQuery.refetch();
    furnitureQuery.refetch();
    sellersQuery.refetch();
    infiniteQuery.refetch();
  }, [clothesQuery, electronicsQuery, furnitureQuery, sellersQuery, infiniteQuery]);

  const isRefreshing =
    (clothesQuery.isFetching && !clothesQuery.isLoading) ||
    (electronicsQuery.isFetching && !electronicsQuery.isLoading) ||
    (furnitureQuery.isFetching && !furnitureQuery.isLoading) ||
    (sellersQuery.isFetching && !sellersQuery.isLoading) ||
    (infiniteQuery.isFetching && !infiniteQuery.isFetchingNextPage);

  // ✅ ListHeader: 3 Product Carousels + 1 Seller Carousel
  const ListHeader = React.useCallback(() => {
    return (
      <View className="gap-8">
        {/* Carousel 1: Clothes */}
        <OnboardingCarousel
          deskription="Pelajari cara pakai Preloved!"
          title="Welcome Kak"
          isLoading={clothesQuery.isLoading}
        />
        <ProductCarousel
          title="For You"
          products={clothesQuery.data?.products ?? []}
          isLoading={clothesQuery.isLoading}
          onProductPress={(product) => {
            console.log('Product:', product.id);
          }}
          onSeeAllPress={() => {
            router.push('/(tabs)/explore?category=1');
          }}
        />

        {/* Carousel 2: Electronics */}
        <ProductCarousel
          title="Your Likes"
          products={electronicsQuery.data?.products ?? []}
          isLoading={electronicsQuery.isLoading}
          onProductPress={(product) => {
            console.log('Product:', product.id);
          }}
          onSeeAllPress={() => {
            router.push('/(tabs)/explore?category=2');
          }}
        />

        {/* Carousel 3: Furniture */}
        <ProductCarousel
          title="Baru Dilihat"
          products={furnitureQuery.data?.products ?? []}
          isLoading={furnitureQuery.isLoading}
          onProductPress={(product) => {
            console.log('Product:', product.id);
          }}
          onSeeAllPress={() => {
            router.push('/(tabs)/explore?category=3');
          }}
        />

        {/* ✅ Carousel 4: Sellers with top products */}
        <SellerCarousel
          title="Rekomendasi seller"
          sellers={sellersQuery.data?.sellers ?? []}
          isLoading={sellersQuery.isLoading}
          onSellerPress={(seller) => {
            console.log('Seller:', seller.id);
          }}
          onSeeAllPress={() => {
            router.push('/(tabs)/explore?tab=sellers');
          }}
        />

        {/* Section 5 Header */}
        <View className="px-5">
          <HeaderAction title="Hot Items" onPress={() => router.push('/(tabs)/explore')} />
        </View>
      </View>
    );
  }, [clothesQuery, electronicsQuery, furnitureQuery, sellersQuery]);

  // ✅ ListFooter
  const ListFooter = React.useCallback(() => {
    if (infiniteQuery.isFetchingNextPage) {
      return (
        <View className="items-center py-2" style={{ height: 40 }}>
          <Spinner className="text-primary" />
          <Text className="sr-only mt-3 text-sm text-muted-foreground">Loading more...</Text>
        </View>
      );
    }

    if (!infiniteQuery.hasNextPage && infiniteProducts.length > 0) {
      return (
        <View className="sr-only items-center py-8">
          <Text className="text-sm text-muted-foreground">
            All {infiniteProducts.length} products loaded
          </Text>
        </View>
      );
    }

    return <View style={{ height: 20 }} />;
  }, [infiniteQuery.isFetchingNextPage, infiniteQuery.hasNextPage, infiniteProducts.length]);

  // ✅ Render item
  const renderItem = React.useCallback(({ item, index }: { item: Product; index: number }) => {
    return (
      <View className="relative mb-4 aspect-auto w-1/2 flex-grow">
        <ProductCard index={index} Product={item} widht={2.25} />
      </View>
    );
  }, []);

  // Initial loading
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
        ListHeaderComponent={<ListHeader />}
        contentContainerStyle={{
          paddingTop: 30,
          gap: 9,
          paddingBottom: 5, // ✅ Reduced padding
        }}
        scrollEnabled={true}
      />
    );
  }

  // Error state
  if (infiniteQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <Text className="mb-2 text-center text-lg font-semibold text-destructive">
          Failed to load products
        </Text>
        <Text className="mb-6 text-center text-sm text-muted-foreground">
          {infiniteQuery.error?.message}
        </Text>
        <Button onPress={() => infiniteQuery.refetch()}>
          <Text>Try Again</Text>
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
      ListHeaderComponent={<ListHeader />}
      ListFooterComponent={<ListFooter />}
      // ✅ CRITICAL FIXES
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.8} // ✅ Triggers EARLY!
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={tintColor} />
      }
      contentContainerStyle={{
        paddingTop: 30,
        gap: 9,
        paddingBottom: 5, // ✅ Reduced padding
      }}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      showsVerticalScrollIndicator={false}
    />
  );
}
