// components/ui/fragments/custom/carousel/onboarding-carousel.tsx - Complete onboarding carousel

import { View, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { Header, HeaderAction } from '@/components/ui/fragments/custom/typography/header';
import { CarouselSkeleton } from '@/components/ui/fragments/custom/skeleton/carousel-skeleton';
import { cn } from '@/lib/utils';

import { HelloWave } from '../../shadcn-ui/hello-wave';
import { Text } from '../../shadcn-ui/text';
import { Onboarding } from '@/type/onboarding-type';
import { OnboardingCard } from '../card/onboarding-card';
import { CardSkeleton } from '../skeleton/card-skeleton';

type OnboardingCarouselProps = {
  title: string;

  isLoading?: boolean;
  deskription: string;
  className?: string;
  skeletonCount?: number;
};

const dataOnboarding: Onboarding[] = [
  {
    title: 'Cara Berbelanja',
    description: 'Pelajari cara membeli di Preloved',
    image: 'https://preloved.co.id/_ipx/f_webp,q_80,fit_cover/images/stories/belanja.jpg',
  },
  {
    title: 'Cara Jualan',
    description: 'Pelajari cara jualan di Preloved',
    image: 'https://preloved.co.id/_ipx/f_webp,q_80,fit_cover/images/stories/jualan.jpg',
  },
  {
    title: 'Proses Pemesanan',
    description: 'Pelajari cara proses pemesanan di Preloved',
    image: 'https://preloved.co.id/_ipx/f_webp,q_80,fit_cover/images/stories/proses.jpg',
  },
];

export default function OnboardingCarousel({
  title,

  isLoading = false,
  deskription,
  className,
  skeletonCount = 5,
}: OnboardingCarouselProps) {
  // Show skeleton during loading
  if (isLoading) {
    return (
      <CarouselSkeleton
        showDescription={true}
        cardSkeleton={<CardSkeleton />}
        itemCount={skeletonCount}
        className={className}
      />
    );
  }

  return (
    <View className={cn('w-full gap-4', className)}>
      {/* Section header with optional action */}
      <View className="relative w-fit gap-0 px-4">
        <Header title={title} className="mb-0 w-fit py-0" />

        <HelloWave size="sm" className="absolute left-[10.8rem] top-1" />

        <Text variant={'p'} className="mt-0 w-fit text-sm font-normal text-muted-foreground">
          {deskription}
        </Text>
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
        {dataOnboarding.map((onboarding, index) => {
          return (
            <OnboardingCard
              key={`onboarding-${onboarding.title}-${index}`}
              onboarding={onboarding}
              width={2.7}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
