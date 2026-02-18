// components/ui/fragments/custom/skeleton/product-card-skeleton.tsx

import { View, Dimensions } from 'react-native';
import React from 'react';
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton';
import { cn } from '@/lib/utils';

type OnboardingCardSkeletonProps = {
  className?: string;
  widht?: number;
};

export function OnboardingCardSkeleton({
  className,
  widht = 2.3,
  ...props
}: OnboardingCardSkeletonProps) {
  const width = Dimensions.get('window').width;
  const CARD_WIDTH = width / 1.8;
  return (
    <View
      className={cn('m-auto h-fit w-full gap-1 overflow-hidden p-0', className)}
      style={{ width: CARD_WIDTH }}>
      {/* Image skeleton - matches OnboardingCard aspect ratio [3/4] */}
      <Skeleton
        className="mb-1.5 aspect-[3/4] w-full rounded-sm"
        style={{ width: CARD_WIDTH, height: 120 }}
      />

      {/* Content skeletons */}
    </View>
  );
}
