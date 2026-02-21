// components/ui/fragments/custom/skeleton/product-card-skeleton.tsx

import { View, Dimensions } from 'react-native';
import React from 'react';
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton';
import { cn } from '@/lib/utils';

type SellerCardSkeletonProps = {
  className?: string;
  widht?: number;
};

export function SellerCardSkeleton({ className, widht = 2.3, ...props }: SellerCardSkeletonProps) {
  const width = Dimensions.get('window').width;
  const CARD_WIDTH = width / 1.8;
  return (
    <View
      className={cn('m-auto h-fit w-full gap-1 overflow-hidden p-0', className)}
      style={{ width: CARD_WIDTH }}>
      {/* Image skeleton - matches SellerCard aspect ratio [3/4] */}
      <Skeleton
        className="mb-1.5 aspect-[3/4] w-full rounded-lg"
        style={{ width: CARD_WIDTH, height: 110 }}
      />

      {/* Content skeletons */}
      <View className="-mt-10 mb-1 w-full flex-col content-center items-center justify-center gap-1.5">
        {/* Price skeleton */}
        <Skeleton className="size-12 rounded-full border-2 border-background" />

        {/* Title skeleton */}
        <Skeleton className="h-2 w-16 rounded" />

        {/* Availability skeleton */}
        <Skeleton className="h-2 w-10 rounded" />
      </View>
    </View>
  );
}
