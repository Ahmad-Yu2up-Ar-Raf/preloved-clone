// components/ui/fragments/custom/skeleton/product-card-skeleton.tsx

import { View, Dimensions } from 'react-native';
import React from 'react';
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton';
import { cn } from '@/lib/utils';

type ButtonCardSkeletonProps = {
  className?: string;
  widht?: number;
};

export function ButtonCardSkeleton({ className, widht = 2.3, ...props }: ButtonCardSkeletonProps) {
  const width = Dimensions.get('window').width;
  const CARD_WIDTH = 80; // Fixed width for button skeletons, adjust as needed
  return (
    <View
      className={cn('m-auto h-fit w-full gap-1 overflow-hidden p-0', className)}
      style={{ width: CARD_WIDTH }}>
      {/* Image skeleton - matches ButtonCard aspect ratio [3/4] */}
      <Skeleton
        className="mb-1.5 aspect-auto w-full rounded-lg"
        style={{ width: CARD_WIDTH, height: 25 }}
      />

      {/* Content skeletons */}
    </View>
  );
}
