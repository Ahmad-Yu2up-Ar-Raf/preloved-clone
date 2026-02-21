// components/ui/fragments/custom/skeleton/product-card-skeleton.tsx

import { View, Dimensions } from 'react-native';
import React from 'react';
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton';
import { cn } from '@/lib/utils';

type CardSkeletonProps = {
  className?: string;
  widht?: number;
};

export function CardSkeleton({ className, widht = 2.3, ...props }: CardSkeletonProps) {
  const width = Dimensions.get('window').width;
  const CARD_WIDTH = width /  2;
  return (
    <View
      className={cn('m-auto h-20 w-full flex-1 gap-1 overflow-hidden p-0', className)}
      style={{ width: CARD_WIDTH, height: CARD_WIDTH * (4 / 7) }}>
      {/* Image skeleton - matches OnboardingCard aspect ratio [3/4] */}
      <Skeleton className="mb-1.5 h-full w-full" />

      {/* Content skeletons */}
    </View>
  );
}
