// type/products-type.ts - Platzi Fake Store API product types

/**
 * PlatziProductSchema - Raw API response from Platzi Fake Store API
 * This is the exact structure returned by the API
 */
export interface PlatziProductSchema {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[]; // ✅ Multiple images array!
  creationAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    image: string;
    creationAt: string;
    updatedAt: string;
  };
}

/**
 * Product - UI-friendly product type
 * This is what components like ProductCard expect
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[]; // ✅ Array of images for carousel
  thumbnail: string; // First image as thumbnail
  category: {
    id: number;
    name: string;
    image: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PlatziProductsResponse - Wrapper for list with total count
 * Note: Platzi API returns array directly, we add metadata
 */
export interface PlatziProductsResponse {
  products: PlatziProductSchema[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * ProductFilters - Filter options for querying products
 */
export interface ProductFilters {
  limit?: number;
  offset?: number; // ✅ Platzi uses offset instead of skip
  title?: string; // Search by title
  price_min?: number;
  price_max?: number;
  categoryId?: number;
}

/**
 * ProductQueryResult - Transformed query result for UI
 */
export interface ProductQueryResult {
  products: Product[];
  total: number;
  offset: number;
  limit: number;
  hasNextPage: boolean;
  nextOffset: number | null;
}

/**
 * PlatziCategory - Category structure
 */
export interface PlatziCategory {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}
