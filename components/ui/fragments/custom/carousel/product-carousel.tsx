// components/ui/fragments/custom/carousel/product-carousel.tsx

import { View, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { Header, HeaderAction } from '@/components/ui/fragments/custom/typography/header';
import { ProductCard } from '@/components/ui/fragments/custom/card/product-card';
import { CarouselSkeleton } from '@/components/ui/fragments/custom/skeleton/carousel-skeleton';
import type { Product } from '@/type/products-type';
import { cn } from '@/lib/utils';

type ProductCarouselProps = {
  title: string;
  products: Product[];
  isLoading?: boolean;
  onProductPress?: (product: Product) => void;
  onSeeAllPress?: () => void;
  className?: string;
  skeletonCount?: number;
};

export default function ProductCarousel({
  title,
  products,
  isLoading = false,
  onProductPress,
  onSeeAllPress,
  className,
  skeletonCount = 5,
}: ProductCarouselProps) {
  // Show skeleton during loading
  if (isLoading) {
    return <CarouselSkeleton itemCount={skeletonCount} className={className} />;
  }

  // Show nothing if no products after loading
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View className={cn('w-full gap-3', className)}>
      {/* Section header with optional action */}
      <View className="px-4">
        {onSeeAllPress ? (
          <HeaderAction title={title} onPress={onSeeAllPress} />
        ) : (
          <Header title={title} />
        )}
      </View>

      {/* Horizontal scrolling product cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 11,
        }}
        snapToInterval={200} // Smooth snapping (adjust based on card width)
        snapToAlignment="start">
        {products.map((product, index) => {
          return (
            <ProductCard
              withCarousel={false}
              key={`product-${product.id}-${index}`}
              widht={2.5}
              showAction={false}
              Product={product}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
