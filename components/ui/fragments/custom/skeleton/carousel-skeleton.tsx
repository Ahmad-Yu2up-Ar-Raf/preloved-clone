// components/ui/fragments/custom/skeleton/carousel-skeleton.tsx

import { View, ScrollView } from 'react-native';
import React from 'react';
import { TypographySkeletonVariants } from './typography-skeleton';
import { ProductCardSkeleton } from './product-card-skeleton';
import { cn } from '@/lib/utils';

type CarouselSkeletonProps = {
  itemCount?: number;
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
  cardSkeleton?: React.ReactNode;
};

export function CarouselSkeleton({
  itemCount = 5,
  showTitle = true,
  showDescription = false,
  className,
  cardSkeleton = <ProductCardSkeleton widht={2.7} />,
}: CarouselSkeletonProps) {
  return (
    <View
      className={cn(
        'w-full gap-1.5',
        className,

        showDescription && 'gap-3'
      )}>
      {/* Section header with optional action */}

      {/* Title skeleton */}
      {showTitle && (
        <View className="px-4">
          <TypographySkeletonVariants.Header />
          <TypographySkeletonVariants.Subtitle />
        </View>
      )}

      {/* Horizontal scrolling skeleton cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 11,
        }}
        snapToInterval={200} // Smooth snapping (adjust based on card width)
        snapToAlignment="start">
        {Array.from({ length: itemCount }).map((_, index) => (
          <View key={`carousel-skeleton-${index}`}>{cardSkeleton}</View>
        ))}
      </ScrollView>
    </View>
  );
}
