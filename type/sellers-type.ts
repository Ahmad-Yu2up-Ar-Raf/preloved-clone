// type/sellers-type.ts - Platzi Fake Store API user/seller types

/**
 * PlatziUserSchema - Raw API response from Platzi /users endpoint
 */
export interface PlatziUserSchema {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'admin';
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

/**
 * Seller - UI-friendly seller type with top products
 */
export interface Seller {
  id: number;
  name: string;
  email: string;
  avatar: string; // Seller logo/profile image
  role: string;
  rating: number; // Generated: 4.0-5.0
  totalProducts: number; // Count of products
  topProductImages: string[]; // ✅ Top 3 product images
  createdAt: Date;
}

/**
 * PlatziUsersResponse - Response wrapper
 */
export interface PlatziUsersResponse {
  users: PlatziUserSchema[];
  total: number;
  offset: number;
  limit: number;
}

/**
 * SellerFilters - Filter options for sellers
 */
export interface SellerFilters {
  limit?: number;
  offset?: number;
}

/**
 * SellerQueryResult - Transformed result
 */
export interface SellerQueryResult {
  sellers: Seller[];
  total: number;
  offset: number;
  limit: number;
  hasNextPage: boolean;
  nextOffset: number | null;
}
