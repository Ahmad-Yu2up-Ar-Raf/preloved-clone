// lib/server/sellers/sellers-queris-server.ts - Platzi users/sellers queries

import { queryOptions } from '@tanstack/react-query';
import {
  fetchSellersWithProducts,
  fetchUserById,
  fetchTopProductsForSeller,
  getUsersTotalCount,
} from './sellers-server';
import { mapSellersArray, mapPlatziUserToSeller } from '@/lib/utils/sellers-mappers';
import type { SellerFilters } from '@/type/sellers-type';

const TOTAL_SELLERS = 30; // Platzi has ~30 users

/**
 * Query keys for sellers
 */
export const sellerKeys = {
  all: ['sellers'] as const,
  lists: () => [...sellerKeys.all, 'list'] as const,
  list: (filters: SellerFilters) => [...sellerKeys.lists(), filters] as const,
  detail: (id: number) => [...sellerKeys.all, 'detail', id] as const,
};

/**
 * Query for fetching sellers with top products
 * ✅ Includes top 3 product images per seller
 */
export function sellerQueryOptions(filters: SellerFilters = {}) {
  return queryOptions({
    queryKey: sellerKeys.list(filters),
    queryFn: async () => {
      // Fetch users with their top product images
      const sellersWithProducts = await fetchSellersWithProducts({
        limit: filters.limit ?? 10,
        offset: filters.offset ?? 0,
      });

      return {
        sellers: mapSellersArray(sellersWithProducts),
        total: TOTAL_SELLERS,
      };
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Query for single seller detail
 */
export function sellerDetailQueryOptions(id: number) {
  return queryOptions({
    queryKey: sellerKeys.detail(id),
    queryFn: async () => {
      const user = await fetchUserById(id);
      const topProductImages = await fetchTopProductsForSeller(id);

      return mapPlatziUserToSeller(user, topProductImages);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
