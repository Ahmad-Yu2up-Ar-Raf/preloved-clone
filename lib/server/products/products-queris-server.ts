import { ProductSchema } from '@/type/products';

export const getProductsInfiniteQueryOptions = () => ({
  queryKey: ['products', 'infinite'],
  // pageParam represents the starting index for the page (0-based)
  queryFn: async ({ pageParam = 0 }) => {
    const res = await fetch('https://fakestoreapi.com/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const allProducts = (await res.json()) as ProductSchema[];

    const pageSize = 5; // adjust page size as desired
    const start = Number(pageParam) || 0;
    const pageItems = allProducts.slice(start, start + pageSize);

    const nextCursor = start + pageSize < allProducts.length ? start + pageSize : null;

    return {
      data: pageItems,
      totalCount: allProducts.length,
      hasNextPage: nextCursor !== null,
      nextCursor,
    } as {
      data: ProductSchema[];
      totalCount: number;
      hasNextPage: boolean;
      nextCursor: number | null;
    };
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage: { hasNextPage: boolean; nextCursor: number | null }) =>
    lastPage.hasNextPage ? (lastPage.nextCursor ?? undefined) : undefined,
  staleTime: 60 * 1000,
  gcTime: 10 * 60 * 1000,
});
