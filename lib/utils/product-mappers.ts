// lib/utils/products/product-mappers.ts
// ✅ CRITICAL: Sanitize Platzi image URLs AT THE DATA LAYER
// This prevents bad URLs from ever reaching the Image component

import type { PlatziProductSchema, Product, ProductQueryResult } from '@/type/products-type';

// ─────────────────────────────────────────────────────────────
// ✅ URL Sanitizer — fixes Platzi API quirk where images
//    come back as '["https://..."]' (JSON-stringified array)
//    Also rejects SVGs which expo-image cannot render
// ─────────────────────────────────────────────────────────────
export function sanitizeImageUrl(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;

  let url = raw.trim();

  // Fix Platzi bracket-wrapped URLs
  if (url.startsWith('[')) {
    try {
      const parsed = JSON.parse(url);
      if (Array.isArray(parsed) && parsed.length > 0) {
        url = String(parsed[0]).trim();
      } else {
        return null;
      }
    } catch {
      // Manual strip as fallback
      url = url.replace(/^\["?|"?\]$/g, '').trim();
    }
  }

  // Reject SVGs
  const lower = url.toLowerCase();
  if (lower.includes('.svg') || lower.includes('svg+xml')) return null;

  // Must be valid http/https URL
  if (!url.startsWith('http://') && !url.startsWith('https://')) return null;

  return url;
}

// ─────────────────────────────────────────────────────────────
// Sanitize an array of image URLs, return only valid ones
// ─────────────────────────────────────────────────────────────
export function sanitizeImages(raw: string[]): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(sanitizeImageUrl).filter((u): u is string => u !== null);
}

// ─────────────────────────────────────────────────────────────
// Map PlatziProductSchema → Product (UI type)
// ─────────────────────────────────────────────────────────────
export function mapPlatziProductToProduct(schema: PlatziProductSchema): Product {
  const cleanImages = sanitizeImages(schema.images ?? []);
  const cleanThumbnail =
    sanitizeImageUrl(schema.images?.[0]) ??
    sanitizeImageUrl(schema.images?.[1]) ??
    'https://placehold.co/400x400/e5e7eb/9ca3af?text=No+Image';

  return {
    id: schema.id,
    title: schema.title,
    description: schema.description,
    price: schema.price,
    images: cleanImages, // ✅ All sanitized
    thumbnail: cleanThumbnail, // ✅ First valid image
    category: {
      id: schema.category.id,
      name: schema.category.name,
      image: sanitizeImageUrl(schema.category.image) ?? '',
    },
    createdAt: new Date(schema.creationAt),
    updatedAt: new Date(schema.updatedAt),
  };
}

export function mapProductsArray(schemas: PlatziProductSchema[]): Product[] {
  return schemas.map(mapPlatziProductToProduct);
}

export function mapProductsResponse(
  products: PlatziProductSchema[],
  offset: number,
  limit: number,
  total: number
): ProductQueryResult {
  const mapped = mapProductsArray(products);
  const hasNextPage = offset + limit < total;
  return {
    products: mapped,
    total,
    offset,
    limit,
    hasNextPage,
    nextOffset: hasNextPage ? offset + limit : null,
  };
}
