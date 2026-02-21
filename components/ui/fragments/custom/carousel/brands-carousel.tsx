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
import { ButtonCardSkeleton } from '../skeleton/button-skeleton';
import { router } from 'expo-router';
type BrandsCarouselProps = {
  title: string;
  BrandsCategory: String[];
  isLoading?: boolean;
  onSeeAllPress?: () => void;
  className?: string;
  skeletonCount?: number;
};

export default function BrandsCarousel({
  title,
  BrandsCategory,
  isLoading = false,
  onSeeAllPress,
  className,
  skeletonCount = 5,
}: BrandsCarouselProps) {
  // Show skeleton during loading
  if (isLoading) {
    return (
      <CarouselSkeleton
        cardSkeleton={<ButtonCardSkeleton />}
        itemCount={skeletonCount}
        style={{
          paddingHorizontal: 16,
          gap: 10,
          flexDirection: 'row',
          flexWrap: 'wrap',
          maxWidth: 1200,
        }}
        className={className}
      />
    );
  }

  return (
    <View className={cn('w-full gap-2', className)}>
      {/* Section header with optional action */}
      <View className="px-4">
        {onSeeAllPress ? (
          <HeaderAction title={title} onPress={onSeeAllPress} />
        ) : (
          <Header title={title} />
        )}
      </View>

      {/* Horizontal scrolling onboarding cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 4,
          flexDirection: 'row',
          flexWrap: 'wrap',
          maxWidth: 1200,
        }}
        decelerationRate="fast"
        snapToInterval={200} // Smooth snapping
        snapToAlignment="start">
        {BrandsCategory.map((Brand, index) => {
          return (
            <Button
              onPress={() => {
                router.push({
                  pathname: '/(tabs)/explore/products',
                  params: { brand: Brand.toLowerCase() },
                });
              }}
              size={'sm'}
              key={`Brand-${Brand}-${index}`}>
              <Text variant={'large'} className="font-semibold">
                {Brand}
              </Text>
            </Button>
          );
        })}
      </ScrollView>
    </View>
  );
}
