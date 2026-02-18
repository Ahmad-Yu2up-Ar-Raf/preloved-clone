// lib/utils/sellers/seller-mappers.ts - Platzi user to seller mapper

import type { PlatziUserSchema, Seller, SellerQueryResult } from '@/type/sellers-type';

/**
 * Generate random rating between 4.0 - 5.0
 * Provides realistic seller ratings
 */
function generateSellerRating(userId: number): number {
  // Use userId as seed for consistent ratings
  const seed = userId * 0.137; // Prime-ish multiplier
  const random = (seed - Math.floor(seed)) * 10;
  return Math.round((4.0 + random * 0.1) * 10) / 10; // 4.0 - 5.0
}

/**
 * Estimate total products for seller
 * Based on seller ID for variety
 */
function estimateTotalProducts(userId: number): number {
  const seed = userId * 0.271;
  const random = (seed - Math.floor(seed)) * 100;
  return Math.floor(10 + random); // 10-110 products
}

/**
 * Maps PlatziUserSchema to Seller (UI type)
 * Includes top product images, rating, and product count
 */
export function mapPlatziUserToSeller(
  user: PlatziUserSchema,
  topProductImages: string[] = []
): Seller {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar, // Seller logo/profile
    role: user.role,
    rating: generateSellerRating(user.id), // ✅ 4.0-5.0 rating
    totalProducts: estimateTotalProducts(user.id),
    topProductImages:
      topProductImages.length > 0
        ? topProductImages
        : [
            'https://i.imgur.com/QkIa5tT.jpeg',
            'https://i.imgur.com/1twoaDy.jpeg',
            'https://i.imgur.com/cHddUCu.jpeg',
          ], // Fallback images
    createdAt: new Date(user.creationAt),
  };
}

/**
 * Maps array of users with top products to Seller[]
 */
export function mapSellersArray(
  users: Array<PlatziUserSchema & { topProductImages?: string[] }>
): Seller[] {
  return users.map((user) => mapPlatziUserToSeller(user, user.topProductImages));
}

/**
 * Maps sellers response to SellerQueryResult
 * Adds pagination metadata
 */
export function mapSellersResponse(
  users: Array<PlatziUserSchema & { topProductImages?: string[] }>,
  offset: number,
  limit: number,
  total: number
): SellerQueryResult {
  const mappedSellers = mapSellersArray(users);
  const hasNextPage = offset + limit < total;
  const nextOffset = hasNextPage ? offset + limit : null;

  return {
    sellers: mappedSellers,
    total,
    offset,
    limit,
    hasNextPage,
    nextOffset,
  };
}

/**
 * Type guard for PlatziUserSchema
 */
export function isPlatziUser(data: unknown): data is PlatziUserSchema {
  if (!data || typeof data !== 'object') return false;

  const user = data as Partial<PlatziUserSchema>;

  return (
    typeof user.id === 'number' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    typeof user.avatar === 'string'
  );
}
