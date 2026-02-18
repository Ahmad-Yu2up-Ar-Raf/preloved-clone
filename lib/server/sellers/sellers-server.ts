// lib/server/sellers/sellers-server.ts - Platzi users API with top products

import type { PlatziUserSchema, SellerFilters } from '@/type/sellers-type';
import type { PlatziProductSchema } from '@/type/products-type';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

/**
 * Build URL with query parameters
 */
function buildQueryString(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Fetch users from Platzi API
 * Returns array of users
 */
export async function fetchUsersFromPlatzi(
  filters: SellerFilters = {}
): Promise<PlatziUserSchema[]> {
  const { limit, offset } = filters;

  const queryString = buildQueryString({
    offset: offset ?? 0,
    limit: limit ?? 10,
  });

  const url = `${BASE_URL}/users${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch users`);
    }

    const data = (await response.json()) as PlatziUserSchema[];
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
    throw new Error('Failed to fetch users: Unknown error');
  }
}

/**
 * Fetch single user by ID
 */
export async function fetchUserById(id: number): Promise<PlatziUserSchema> {
  const url = `${BASE_URL}/users/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch user`);
    }

    const data = (await response.json()) as PlatziUserSchema;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user ${id}: ${error.message}`);
    }
    throw new Error(`Failed to fetch user ${id}: Unknown error`);
  }
}

/**
 * Fetch top 3 product images for a seller
 * Since Platzi doesn't have seller-product relationship,
 * we'll fetch random products and use their first images
 */
export async function fetchTopProductsForSeller(sellerId: number): Promise<string[]> {
  const url = `${BASE_URL}/products`;

  try {
    // Fetch products with offset based on seller ID for variety
    const offset = (sellerId * 3) % 50; // Rotate through products
    const response = await fetch(`${url}?offset=${offset}&limit=3`);

    if (!response.ok) {
      // Return fallback images if fetch fails
      return [
        'https://i.imgur.com/QkIa5tT.jpeg',
        'https://i.imgur.com/1twoaDy.jpeg',
        'https://i.imgur.com/cHddUCu.jpeg',
      ];
    }

    const products = (await response.json()) as PlatziProductSchema[];

    // Extract first image from each product's images array
    const topImages = products
      .filter((p) => p.images && p.images.length > 0)
      .slice(0, 3)
      .map((p) => p.images[0]);

    // Ensure we have 3 images (use fallbacks if needed)
    while (topImages.length < 3) {
      topImages.push('https://i.imgur.com/QkIa5tT.jpeg');
    }

    return topImages;
  } catch (error) {
    // Return fallback images on error
    return [
      'https://i.imgur.com/QkIa5tT.jpeg',
      'https://i.imgur.com/1twoaDy.jpeg',
      'https://i.imgur.com/cHddUCu.jpeg',
    ];
  }
}

/**
 * Fetch users with their top product images
 * This is the main function to use for sellers
 */
export async function fetchSellersWithProducts(
  filters: SellerFilters = {}
): Promise<Array<PlatziUserSchema & { topProductImages: string[] }>> {
  const users = await fetchUsersFromPlatzi(filters);

  // Fetch top products for each user in parallel
  const sellersWithProducts = await Promise.all(
    users.map(async (user) => {
      const topProductImages = await fetchTopProductsForSeller(user.id);
      return {
        ...user,
        topProductImages,
      };
    })
  );

  return sellersWithProducts;
}

/**
 * Get total count of users
 */
export async function getUsersTotalCount(): Promise<number> {
  // Platzi has limited users, estimate ~30
  return 30;
}
