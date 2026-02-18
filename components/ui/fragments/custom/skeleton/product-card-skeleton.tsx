// components/ui/fragments/custom/skeleton/product-card-skeleton.tsx

import { View, Dimensions } from 'react-native';
import React from 'react';
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton';
import { cn } from '@/lib/utils';

type ProductCardSkeletonProps = {
  className?: string;
  widht?: number;
};

export function ProductCardSkeleton({
  className,
  widht = 2.3,
  ...props
}: ProductCardSkeletonProps) {
  const width = Dimensions.get('window').width;
  const CARD_WIDTH = width / widht;
  return (
    <View
      className={cn('m-auto h-fit w-full gap-1 overflow-hidden p-0', className)}
      style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.4 + 50 }}>
      {/* Image skeleton - matches ProductCard aspect ratio [3/4] */}
      <Skeleton
        className="mb-1.5 aspect-[3/4] w-full rounded-sm"
        style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.3 }}
      />

      {/* Content skeletons */}
      <View className="w-full gap-1 px-1.5">
        {/* Price skeleton */}
        <Skeleton className="h-2 w-12 rounded" />

        {/* Title skeleton */}
        <Skeleton className="h-2 w-16 rounded" />

        {/* Availability skeleton */}
        <Skeleton className="h-2 w-10 rounded" />
      </View>
    </View>
  );
}
