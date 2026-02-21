// lib/server/products/products-queris-server.ts
import { fetchProductById } from './products-server';
import { mapPlatziProductToProduct } from '@/lib/utils/product-mappers';
import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import {
  fetchProductsFromPlatzi,
  fetchProductsByCategory,
  fetchCategories,
} from './products-server';
import {
  mapProductsResponse,
  mapProductsArray as mapCategoriesArray,
} from '@/lib/utils/product-mappers';
import type { PlatziCategory, ProductFilters } from '@/type/products-type';

const TOTAL_PRODUCTS = 200;

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  // ✅ MAX_ITEMS sekarang bagian dari key — lihat penjelasan di bawah
  infinite: (filters: ProductFilters, maxItems: number) =>
    [...productKeys.all, 'infinite', filters, { maxItems }] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  category: (id: number, filters?: Omit<ProductFilters, 'categoryId'>) =>
    [...productKeys.all, 'category', id, filters ?? {}] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
};

export function productQueryOptions(filters: ProductFilters = {}) {
  return queryOptions({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const products = await fetchProductsFromPlatzi({
        limit: filters.limit ?? 10,
        offset: filters.offset ?? 0,
        title: filters.title,
        price_min: filters.price_min,
        price_max: filters.price_max,
        categoryId: filters.categoryId,
      });
      return {
        products: mapCategoriesArray(products),
        total: TOTAL_PRODUCTS,
      };
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

export function productInfiniteQueryOptions({
  filters = {},
  MAX_ITEMS = 20,
}: {
  filters?: Omit<ProductFilters, 'offset'>;
  MAX_ITEMS?: number;
}) {
  const pageSize = filters.limit ?? 10;

  return infiniteQueryOptions({
    // ─────────────────────────────────────────────────────────────────────────
    // 🐛 ROOT CAUSE BUG #4 (PALING KRITIS): MAX_ITEMS tidak ada di query key!
    //
    // Sebelumnya: queryKey: productKeys.infinite(filters)
    //   → ['products', 'infinite', { limit: 10 }]
    //
    // beranda-block.tsx    → MAX_ITEMS: 20, filters: { limit: 10 }
    // explore-products.tsx → MAX_ITEMS: 45, filters: { limit: 10 }
    //
    // Kedua komponen ini punya query key IDENTIK: ['products', 'infinite', { limit: 10 }]
    // → TanStack Query SHARE CACHE yang sama untuk keduanya!
    //
    // TIMELINE MASALAH:
    //   1. beranda-block init duluan → MAX_ITEMS: 20 di-capture di getNextPageParam closure
    //   2. Cache dibuat dengan identifier ['products', 'infinite', { limit: 10 }]
    //   3. 20 items loaded → getNextPageParam return undefined → hasNextPage: false
    //   4. explore-products init → BACA CACHE YANG SAMA (sudah ada 20 items)
    //   5. explore-products lihat hasNextPage: false → tidak bisa load lebih!
    //   6. User scroll, onEndReached fire → hasNextPage false → handleLoadMore return early
    //   7. Tapi karena masih di ujung, onEndReached fire terus → UI glitch
    //
    // ATAU sebaliknya (explore init duluan):
    //   1. explore init → MAX_ITEMS: 45, load 45 items
    //   2. beranda baca cache yang sama → dapat 45 items padahal minta 20
    //   3. Beranda menampilkan 45 items di home screen → performa buruk
    //
    // ✅ FIX: Include MAX_ITEMS di query key
    //   beranda: ['products', 'infinite', { limit: 10 }, { maxItems: 20 }]
    //   explore: ['products', 'infinite', { limit: 10 }, { maxItems: 45 }]
    //   → Cache TERPISAH → masing-masing punya getNextPageParam closure sendiri
    //   → MAX_ITEMS berfungsi dengan benar di masing-masing konteks
    // ─────────────────────────────────────────────────────────────────────────
    queryKey: productKeys.infinite(filters, MAX_ITEMS),

    queryFn: async ({ pageParam }) => {
      const products = await fetchProductsFromPlatzi({
        limit: pageSize,
        offset: pageParam,
        title: filters.title,
        price_min: filters.price_min,
        price_max: filters.price_max,
        categoryId: filters.categoryId,
      });
      return mapProductsResponse(products, pageParam, pageSize, TOTAL_PRODUCTS);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((acc, page) => acc + page.products.length, 0);
      if (totalLoaded >= MAX_ITEMS) return undefined;
      if (!lastPage.hasNextPage) return undefined;
      return lastPage.nextOffset;
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
}

export function productCategoryQueryOptions(
  categoryId: number,
  filters: Omit<ProductFilters, 'categoryId'> = {}
) {
  return queryOptions({
    queryKey: productKeys.category(categoryId, filters),
    queryFn: async () => {
      const products = await fetchProductsByCategory(categoryId, {
        limit: filters.limit ?? 10,
        offset: filters.offset ?? 0,
      });
      return {
        products: mapCategoriesArray(products),
        total: products.length,
        categoryId,
      };
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}

export function categoriesQueryOptions() {
  return queryOptions({
    queryKey: productKeys.categories(),
    queryFn: async () => {
      const categories = await fetchCategories();
      return {
        categories: categories as PlatziCategory[],
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

export function productByIdQueryOptions(id: number) {
  return queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const raw = await fetchProductById(id);
      return mapPlatziProductToProduct(raw);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!id && !isNaN(id),
    retry: 1,
  });
}
