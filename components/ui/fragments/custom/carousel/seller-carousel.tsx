// components/ui/fragments/custom/carousel/seller-carousel.tsx - Complete seller carousel

import { View, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { Header, HeaderAction } from '@/components/ui/fragments/custom/typography/header';
import { CarouselSkeleton } from '@/components/ui/fragments/custom/skeleton/carousel-skeleton';
import { cn } from '@/lib/utils';
import { SellerCard } from '../card/seller-card';
import type { Seller } from '@/type/sellers-type';
import { SellerCardSkeleton } from '../skeleton/seller-card-skeleton';

type SellerCarouselProps = {
  title: string;
  sellers: Seller[];
  isLoading?: boolean;
  onSellerPress?: (seller: Seller) => void;
  onSeeAllPress?: () => void;
  className?: string;
  skeletonCount?: number;
};

export default function SellerCarousel({
  title,
  sellers,
  isLoading = false,
  onSellerPress,
  onSeeAllPress,
  className,
  skeletonCount = 5,
}: SellerCarouselProps) {
  // Show skeleton during loading
  if (isLoading) {
    return (
      <CarouselSkeleton
        cardSkeleton={<SellerCardSkeleton />}
        itemCount={skeletonCount}
        className={className}
      />
    );
  }

  // Show nothing if no sellers after loading
  if (!sellers || sellers.length === 0) {
    return null;
  }

  return (
    <View className={cn('w-full gap-1.5', className)}>
      {/* Section header with optional action */}
      <View className="px-4">
        <Header title={title} />
      </View>

      {/* Horizontal scrolling seller cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 11,
        }}
        decelerationRate="fast"
        snapToInterval={200} // Smooth snapping
        snapToAlignment="start">
        {sellers.map((seller, index) => {
          return <SellerCard key={`seller-${seller.id}-${index}`} seller={seller} />;
        })}
      </ScrollView>
    </View>
  );
}
