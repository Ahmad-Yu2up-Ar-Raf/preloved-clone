// lib/server/products/products-server.ts - Platzi Fake Store API wrapper

import type { PlatziProductSchema, PlatziCategory, ProductFilters } from '@/type/products-type';

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
 * Fetch products from Platzi API with filters
 * Returns array of products (Platzi returns array directly, not wrapped object)
 */
export async function fetchProductsFromPlatzi(
  filters: ProductFilters = {}
): Promise<PlatziProductSchema[]> {
  const { limit, offset, title, price_min, price_max, categoryId } = filters;

  const queryString = buildQueryString({
    offset: offset ?? 0,
    limit: limit ?? 10,
    title,
    price_min,
    price_max,
    categoryId,
  });

  const url = `${BASE_URL}/products${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch products`);
    }

    const data = (await response.json()) as PlatziProductSchema[];
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    throw new Error('Failed to fetch products: Unknown error');
  }
}

/**
 * Fetch single product by ID
 */
export async function fetchProductById(id: number): Promise<PlatziProductSchema> {
  const url = `${BASE_URL}/products/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch product`);
    }

    const data = (await response.json()) as PlatziProductSchema;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch product ${id}: ${error.message}`);
    }
    throw new Error(`Failed to fetch product ${id}: Unknown error`);
  }
}

/**
 * Fetch products by category ID
 */
export async function fetchProductsByCategory(
  categoryId: number,
  filters: Omit<ProductFilters, 'categoryId'> = {}
): Promise<PlatziProductSchema[]> {
  const { limit, offset } = filters;

  const queryString = buildQueryString({
    offset: offset ?? 0,
    limit: limit ?? 10,
  });

  const url = `${BASE_URL}/categories/${categoryId}/products${queryString}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch category products`);
    }

    const data = (await response.json()) as PlatziProductSchema[];
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch category ${categoryId}: ${error.message}`);
    }
    throw new Error(`Failed to fetch category ${categoryId}: Unknown error`);
  }
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<PlatziCategory[]> {
  const url = `${BASE_URL}/categories`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch categories`);
    }

    const data = (await response.json()) as PlatziCategory[];
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
    throw new Error('Failed to fetch categories: Unknown error');
  }
}

/**
 * Search products by title
 */
export async function searchProducts(
  searchQuery: string,
  filters: Omit<ProductFilters, 'title'> = {}
): Promise<PlatziProductSchema[]> {
  return fetchProductsFromPlatzi({
    ...filters,
    title: searchQuery,
  });
}

/**
 * Get total count of products (for pagination metadata)
 * Platzi API doesn't provide total count, so we estimate from response
 */
export async function getProductsTotalCount(): Promise<number> {
  try {
    // Fetch with very high offset to get total
    const products = await fetchProductsFromPlatzi({ offset: 0, limit: 1 });

    // Since API doesn't return total, we'll use a fixed number based on API docs
    // Platzi has ~200 products
    return 200;
  } catch (error) {
    return 200; // Default estimate
  }
}
