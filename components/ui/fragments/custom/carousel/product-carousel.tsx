// components/ui/fragments/custom/carousel/product-carousel.tsx
import { View, ScrollView } from 'react-native';
import React from 'react';
import { Header, HeaderAction } from '@/components/ui/fragments/custom/typography/header';
import { ProductCard } from '@/components/ui/fragments/custom/card/product-card';
import { CarouselSkeleton } from '@/components/ui/fragments/custom/skeleton/carousel-skeleton';
import type { Product } from '@/type/products-type';
import { cn } from '@/lib/utils';
import { Text } from '../../shadcn-ui/text';

type ProductCarouselProps = {
  title: string;
  products: Product[];
  isLoading?: boolean;
  // ✅ isError: tampilkan pesan error ringan, tidak crash halaman
  isError?: boolean;
  onProductPress?: (product: Product) => void;
  onSeeAllPress?: () => void;
  className?: string;
  skeletonCount?: number;
};

export default function ProductCarousel({
  title,
  products,
  isLoading = false,
  isError = false,
  onProductPress,
  onSeeAllPress,
  className,
  skeletonCount = 5,
}: ProductCarouselProps) {
  if (isLoading) {
    return <CarouselSkeleton itemCount={skeletonCount} className={className} />;
  }

  // ✅ Error state: tampilkan section header + pesan, tidak hilang total
  if (isError) {
    return (
      <View className={cn('w-full gap-3', className)}>
        <View className="px-4">
          {onSeeAllPress ? (
            <HeaderAction title={title} onPress={onSeeAllPress} />
          ) : (
            <Header title={title} />
          )}
        </View>
        <Text className="px-4 text-sm text-muted-foreground">
          Gagal memuat produk. Tarik ke bawah untuk mencoba lagi.
        </Text>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return null; // Silent — tidak tampilkan section kalau kosong
  }

  return (
    <View className={cn('w-full gap-3', className)}>
      <View className="px-4">
        {onSeeAllPress ? (
          <HeaderAction title={title} onPress={onSeeAllPress} />
        ) : (
          <Header title={title} />
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 11 }}
        snapToInterval={200}
        snapToAlignment="start">
        {products.map((product, index) => (
          <ProductCard
            withCarousel={false}
            key={`product-${product.id}-${index}`}
            widht={2.5}
            showAction={false}
            Product={product}
          />
        ))}
      </ScrollView>
    </View>
  );
}
