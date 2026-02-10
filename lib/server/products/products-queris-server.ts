// lib/server/products/products-queris-server.ts - UPDATED WITH LIMIT

import { ProductSchema } from '@/type/products';

const MAX_PRODUCTS = 30; // ✅ Limit to 30 products

export const getProductsInfiniteQueryOptions = () => ({
  queryKey: ['products', 'infinite'],

  queryFn: async ({ pageParam = 0 }) => {
    const res = await fetch('https://fakestoreapi.com/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const allProducts = (await res.json()) as ProductSchema[];

    const pageSize = 10;
    const start = Number(pageParam) || 0;

    // ✅ Limit to MAX_PRODUCTS (30)
    const limitedProducts = allProducts.slice(0, MAX_PRODUCTS);
    const pageItems = limitedProducts.slice(start, start + pageSize);

    // ✅ Check if there's more data within the limit
    const hasMore = start + pageSize < limitedProducts.length;
    const nextCursor = hasMore ? start + pageSize : null;

    console.log('📦 Fetch page:', {
      start,
      pageSize,
      fetched: pageItems.length,
      total: limitedProducts.length,
      hasNextPage: hasMore,
      nextCursor,
    });

    return {
      data: pageItems,
      totalCount: limitedProducts.length,
      hasNextPage: hasMore,
      nextCursor,
    };
  },

  initialPageParam: 0,

  getNextPageParam: (lastPage: { hasNextPage: boolean; nextCursor: number | null }) => {
    // ✅ Return undefined to stop fetching when no more pages
    return lastPage.hasNextPage ? (lastPage.nextCursor ?? undefined) : undefined;
  },

  staleTime: 60 * 1000, // 1 minute
  gcTime: 10 * 60 * 1000, // 10 minutes
});
