// components/ui/fragments/custom/carousel/onboarding-carousel.tsx - Complete onboarding carousel

import { View, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { Header, HeaderAction } from '@/components/ui/fragments/custom/typography/header';
import { CarouselSkeleton } from '@/components/ui/fragments/custom/skeleton/carousel-skeleton';
import { cn } from '@/lib/utils';

import { HelloWave } from '../../shadcn-ui/hello-wave';
import { Text } from '../../shadcn-ui/text';

import { Button } from '../../shadcn-ui/button';
import { Icon } from '../../shadcn-ui/icon';

import { LucideIcon, TrendingUp } from 'lucide-react-native';
import { PlatziCategory } from '@/type/products-type';
import { ButtonCardSkeleton } from '../skeleton/button-skeleton';
import { router } from 'expo-router';

interface Filter {
  label: string;
  onPress: () => void;
  icon: LucideIcon;
}

type TrendingCarouselProps = {
  title: string;
  TrendingCategory: PlatziCategory[];
  isLoading?: boolean;

  className?: string;
  skeletonCount?: number;
};

export default function TrendingCarousel({
  title,
  TrendingCategory,
  isLoading = false,

  className,
  skeletonCount = 5,
}: TrendingCarouselProps) {
  // Show skeleton during loading
  if (isLoading) {
    return (
      <CarouselSkeleton
        cardSkeleton={<ButtonCardSkeleton />}
        itemCount={skeletonCount}
        className={className}
      />
    );
  }

  return (
    <View className={cn('w-full gap-1', className)}>
      {/* Section header with optional action */}
      <View className="px-4">
        <Header title={title} />
      </View>

      {/* Horizontal scrolling onboarding cards */}
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
        {TrendingCategory.slice(1, 5).map((category, index) => {
          return (
            <Button
              onPress={() => {
                router.push({
                  pathname: '/(tabs)/explore/products',
                  params: { category: category.name },
                });
              }}
              variant={'outline'}
              size={'sm'}
              key={`category-${category.id}-${index}`}>
              <Text>{category.name}</Text>
              <Icon as={TrendingUp} size={16} className="text-muted-foreground/80" />
            </Button>
          );
        })}
      </ScrollView>
    </View>
  );
}
