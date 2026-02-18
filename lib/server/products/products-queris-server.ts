// lib/server/products/products-queris-server.ts - FIXED Platzi API queries
import { fetchProductById } from './products-server';
import { mapPlatziProductToProduct } from '@/lib/utils/product-mappers';
import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import {
  fetchProductsFromPlatzi,
  fetchProductsByCategory,
  fetchCategories,
  getProductsTotalCount,
} from './products-server';
import { mapProductsResponse, mapProductsArray } from '@/lib/utils/product-mappers';
import type { ProductFilters } from '@/type/products-type';

// ✅ MAX ITEMS LIMIT - Hard stop at 30 products
const MAX_ITEMS = 20;

// ✅ Total products in Platzi API
const TOTAL_PRODUCTS = 200;

/**
 * Query keys for products
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  infinite: (filters: ProductFilters) => [...productKeys.all, 'infinite', filters] as const,
  categories: () => [...productKeys.all, 'categories'] as const,
  category: (id: number) => [...productKeys.all, 'category', id] as const,
};

/**
 * Regular query for fetching limited products
 * Used for carousels
 */
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
        products: mapProductsArray(products),
        total: TOTAL_PRODUCTS,
      };
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * ✅ FIXED Infinite query with proper offset pagination
 * - Uses offset instead of skip
 * - Hard limit at 30 items
 * - Proper hasNextPage calculation
 */
export function productInfiniteQueryOptions(filters: Omit<ProductFilters, 'offset'> = {}) {
  const pageSize = filters.limit ?? 10;

  return infiniteQueryOptions({
    queryKey: productKeys.infinite(filters),
    queryFn: async ({ pageParam }) => {
      const products = await fetchProductsFromPlatzi({
        limit: pageSize,
        offset: pageParam, // ✅ offset: 0, 10, 20, 30...
        title: filters.title,
        price_min: filters.price_min,
        price_max: filters.price_max,
        categoryId: filters.categoryId,
      });

      // Map to UI type with pagination metadata
      return mapProductsResponse(products, pageParam, pageSize, TOTAL_PRODUCTS);
    },
    initialPageParam: 0,

    // ✅ FIXED: Proper pagination logic with 30 item limit
    getNextPageParam: (lastPage, allPages) => {
      // ✅ Count total loaded items
      const totalLoaded = allPages.reduce((acc, page) => acc + page.products.length, 0);

      // ✅ STOP if reached MAX_ITEMS (30)
      if (totalLoaded >= MAX_ITEMS) {
        return undefined;
      }

      // ✅ STOP if no more data from API
      if (!lastPage.hasNextPage) {
        return undefined;
      }

      // ✅ Return next offset
      return lastPage.nextOffset;
    },

    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Query for products by category
 */
export function productCategoryQueryOptions(
  categoryId: number,
  filters: Omit<ProductFilters, 'categoryId'> = {}
) {
  return queryOptions({
    queryKey: productKeys.category(categoryId),
    queryFn: async () => {
      const products = await fetchProductsByCategory(categoryId, {
        limit: filters.limit ?? 10,
        offset: filters.offset ?? 0,
      });

      return {
        products: mapProductsArray(products),
        total: products.length,
        categoryId,
      };
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Query for all categories
 */
export function categoriesQueryOptions() {
  return queryOptions({
    queryKey: productKeys.categories(),
    queryFn: async () => {
      return await fetchCategories();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// ✅ TAMBAHKAN INI ke file products-queris-server.ts yang sudah ada
// Tambahkan import fetchProductById di bagian atas:
// import { fetchProductsFromPlatzi, fetchProductsByCategory, fetchCategories, getProductsTotalCount, fetchProductById } from './products-server';

 


// ✅ Tambahkan key 'detail' ke productKeys
// productKeys.detail = (id: number) => [...productKeys.all, 'detail', id] as const,

/**
 * ✅ Query options untuk single product by ID
 * Gunakan ini di halaman detail product dengan useQuery()
 */
export function productByIdQueryOptions(id: number) {
  return queryOptions({
    // Key unik per product ID — otomatis di-cache & reuse
    queryKey: ['products', 'detail', id],

    queryFn: async () => {
      const raw = await fetchProductById(id);
      // ✅ Gunakan mapper yang sudah ada — sanitize images sekalian
      return mapPlatziProductToProduct(raw);
    },

    // Data product jarang berubah — cache agak lama
    staleTime: 5 * 60 * 1000,   // 5 menit
    gcTime: 30 * 60 * 1000,     // 30 menit

    // ✅ Jangan fetch kalau id tidak valid
    enabled: !!id && !isNaN(id),
  });
}