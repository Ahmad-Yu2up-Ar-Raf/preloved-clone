// components/ui/fragments/custom/carousel/onboarding-carousel.tsx - Complete onboarding carousel

import { View, ScrollView, Pressable, Button } from 'react-native';
import React from 'react';
import { Header, HeaderAction } from '@/components/ui/fragments/custom/typography/header';
import { CarouselSkeleton } from '@/components/ui/fragments/custom/skeleton/carousel-skeleton';
import { cn } from '@/lib/utils';

import { PlatziCategory } from '@/type/products-type';
import { CategoryCard } from '../card/category-card';
import { MenuSkeleton } from '../skeleton/menu-skeleton';

type CategoryProps = {
  title: string;
  Category: PlatziCategory[];
  isLoading?: boolean;

  className?: string;
  skeletonCount?: number;
};

export default function CategoryMenu({
  title,
  Category,
  isLoading = false,

  className,
  skeletonCount = 5,
}: CategoryProps) {
  // Show skeleton during loading
  if (isLoading) {
    return <MenuSkeleton itemCount={skeletonCount} className={className} />;
  }

  return (
    <View className={cn('w-full gap-1 px-4', className)}>
      {/* Section header with optional action */}
      <View className=" ">
        <Header title={title} />
      </View>
      <View className="mb-1.5 w-full flex-row gap-3.5">
        <CategoryCard Category={Category[1]} className="flex-1" />
        <CategoryCard Category={Category[2]} className="flex-1" />
      </View>
      <View className="w-full flex-row gap-3.5">
        <CategoryCard Category={Category[3]} className="flex-1" />
        <CategoryCard Category={Category[4]} className="flex-1" />
      </View>
      {/* Horizontal scrolling onboarding cards */}
    </View>
  );
}
