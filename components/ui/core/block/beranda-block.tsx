import { View, Text } from 'react-native';
import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getProductsInfiniteQueryOptions } from '@/lib/server/products/products-queris-server';
import { Wrapper } from '@/components/provider/wrapper';
import { ProductCard } from '../../fragments/custom/card/product-card';
export default function HalamanUtama() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery(getProductsInfiniteQueryOptions());

  const Products = data?.pages.flatMap((page) => page.data) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return (
    <Wrapper>
      <View>
        {Products.map((product) => (
          <ProductCard key={product.id} Product={product} />
        ))}
      </View>
    </Wrapper>
  );
}
