// components/ui/fragments/custom/carousel/onboarding-carousel.tsx - Complete onboarding carousel

import { View, ScrollView, Pressable, Button } from 'react-native';
import React from 'react';
import { Header, HeaderAction } from '@/components/ui/fragments/custom/typography/header';

import { cn } from '@/lib/utils';

import { PlatziCategory } from '@/type/products-type';
import { CategoryCard } from '../card/category-card';
import { CardSkeleton } from './card-skeleton';
import { TypographySkeletonVariants } from './typography-skeleton';

type MenuSkeletonProps = {
  itemCount?: number;
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
  cardSkeleton?: React.ReactNode;
};

export function MenuSkeleton({
  itemCount = 5,
  showTitle = true,
  showDescription = false,
  className,
  cardSkeleton = <CardSkeleton widht={2.7} />,
}: MenuSkeletonProps) {
  // Show skeleton during loading

  return (
    <View className={cn('w-full gap-1 px-4', className)}>
      {/* Section header with optional action */}
      {showTitle && (
        <View className=" ">
          <TypographySkeletonVariants.Header />
        </View>
      )}

      <View className="mb-1.5 w-full flex-row gap-3.5">
        <CardSkeleton />
        <CardSkeleton />
      </View>
      <View className="mb-1.5 w-full flex-row gap-3.5">
        <CardSkeleton />
        <CardSkeleton />
      </View>

      {/* Horizontal scrolling onboarding cards */}
    </View>
  );
}
