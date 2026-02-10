// components/ui/core/block/beranda-block.tsx - ENHANCED WITH CUSTOM SPINNER

import { View, FlatList, RefreshControl, Animated } from 'react-native';
import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getProductsInfiniteQueryOptions } from '@/lib/server/products/products-queris-server';
import { ProductCard } from '../../fragments/custom/card/product-card';
import { Link } from 'expo-router';
import { Text } from '../../fragments/shadcn-ui/text';
import { Icon } from '../../fragments/shadcn-ui/icon';
import { ChevronRight, Loader2 } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { buttonTextVariants, buttonVariants, Button } from '../../fragments/shadcn-ui/button';
import type { ProductSchema } from '@/type/products';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import { Spinner } from '../../fragments/shadcn-ui/spinner';

// ✅ Custom Loading Spinner Component
function LoadingSpinner({ text }: { text?: string }) {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ paddingVertical: 20, alignItems: 'center' }}>
      <Spinner className="text-primary" />

      {text && <Text className="mt-3 text-sm text-muted-foreground">{text}</Text>}
    </View>
  );
}

export default function HalamanUtama() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useInfiniteQuery(getProductsInfiniteQueryOptions());

  const products = React.useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primary;
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const isAllLoaded = products.length >= totalCount;

  // ✅ Debounced load more (prevent multiple triggers)
  const loadMoreTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoadMore = React.useCallback(() => {
    // ✅ Clear previous timeout
    if (loadMoreTimeoutRef.current) {
      clearTimeout(loadMoreTimeoutRef.current);
    }

    // ✅ Debounce 300ms
    loadMoreTimeoutRef.current = setTimeout(() => {
      if (hasNextPage && !isFetchingNextPage) {
        console.log('🔄 Fetching next page...');
        fetchNextPage();
      }
    }, 300);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ✅ Cleanup timeout
  React.useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, []);

  const renderItem = React.useCallback(
    ({ item, index }: { item: ProductSchema; index: number }) => {
      return (
        <View className="mb-3 w-1/2">
          <ProductCard Product={item} />
        </View>
      );
    },
    []
  );

  // ✅ Enhanced footer with end state
  const renderFooter = React.useCallback(() => {
    if (isFetchingNextPage) {
      return <LoadingSpinner text="Loading more products..." />;
    }

    return null;
  }, [isFetchingNextPage, isAllLoaded, products.length, totalCount]);

  const renderEmpty = React.useCallback(() => {
    if (isLoading) return null;

    return (
      <View style={{ paddingVertical: 60, paddingHorizontal: 20, alignItems: 'center' }}>
        <Text className="mb-2 text-center text-lg font-semibold">No products found</Text>
        <Text className="mb-6 text-center text-sm text-muted-foreground">
          Try refreshing or check back later
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Refresh</Text>
        </Button>
      </View>
    );
  }, [isLoading, refetch]);

  const renderHeader = React.useCallback(() => {
    return (
      <View className="flex-row px-3 items-center gap-2">
        <Text
          variant={'h2'}
          className="w-fit border-0 border-none font-Termina_Bold text-lg tracking-tighter">
          Hot Items
        </Text>
        <Button variant={'secondary'} className="mb-2 h-fit w-fit rounded-full p-0.5" size={'icon'}>
          <Icon
            as={ChevronRight}
            className={cn(
              // buttonVariants({ variant: 'secondary', size: 'icon' }),
              'rounded-full font-Termina_Bold'
            )}
            size={16}
          />
        </Button>
      </View>
    );
  }, [products.length, totalCount, isAllLoaded]);

  // ✅ Initial loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <LoadingSpinner text="Loading products..." />
      </View>
    );
  }

  // ✅ Error state
  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Icon as={Loader2} size={48} className="mb-4 text-destructive" />
        <Text className="mb-2 text-center text-lg font-semibold text-destructive">
          Oops! Something went wrong
        </Text>
        <Text className="mb-6 text-center text-sm text-muted-foreground">
          {error?.message || 'Failed to load products'}
        </Text>
        <Button onPress={() => refetch()}>
          <Text>Try Again</Text>
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item, index) => `product-${item.id}-${index}`}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: 'space-between',
      }}
      // ✅ Infinite scroll

      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={
        <RefreshControl
          refreshing={isFetching && !isFetchingNextPage}
          onRefresh={refetch}
          tintColor={tintColor}
        />
      }
      contentContainerStyle={{
        paddingTop: 40,
        gap: 7,
        paddingHorizontal: 7,
        paddingBottom: 120, // ✅ Space for native tabs
      }}
      // ✅ Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
      showsVerticalScrollIndicator={false}
      // ✅ Additional props
      bounces={true}
      overScrollMode="auto"
    />
  );
}
