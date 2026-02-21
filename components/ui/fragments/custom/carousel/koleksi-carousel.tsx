// components/ui/fragments/custom/carousel/koleksi-carousel.tsx - Complete koleksi carousel

import { View, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { Header, HeaderAction } from '@/components/ui/fragments/custom/typography/header';
import { CarouselSkeleton } from '@/components/ui/fragments/custom/skeleton/carousel-skeleton';
import { cn } from '@/lib/utils';

import { HelloWave } from '../../shadcn-ui/hello-wave';
import { Text } from '../../shadcn-ui/text';

import { Koleksi, KoleksiCard } from '../card/koleksi-card';
import { CardSkeleton } from '../skeleton/card-skeleton';

type KoleksiCarouselProps = {
  title: string;
  onSeeAllPress?: () => void;
  isLoading?: boolean;

  className?: string;
  skeletonCount?: number;
};

const dataKoleksi: Koleksi[] = [
  {
    name: 'Lokal Brands ',

    image:
      'https://preloved.co.id/_ipx/f_webp,q_80,s_800x533/https://assets.preloved.co.id/collections/lokal-brands-cover.jpg',
  },
  {
    name: 'Y2K 2000s Core',

    image:
      'https://preloved.co.id/_ipx/f_webp,q_80,s_800x533/https://assets.preloved.co.id/collections/2000s-core-cover.jpg',
  },
  {
    name: 'Reworked',

    image:
      'https://preloved.co.id/_ipx/f_webp,q_80,s_800x533/https://assets.preloved.co.id/collections/rework-cover.jpg',
  },
  {
    name: 'Grunge Gothic',

    image:
      'https://preloved.co.id/_ipx/f_webp,q_80,s_800x533/https://assets.preloved.co.id/collections/grunge-gothic-cover.jpg',
  },
  {
    name: 'Baju Jersey',

    image:
      'https://preloved.co.id/_ipx/f_webp,q_80,s_800x533/https://assets.preloved.co.id/collections/jersey-season-cover.jpg',
  },
];

export default function KoleksiCarousel({
  title,

  isLoading = false,
  onSeeAllPress,
  className,
  skeletonCount = 5,
}: KoleksiCarouselProps) {
  // Show skeleton during loading
  if (isLoading) {
    return (
      <CarouselSkeleton
        showDescription={true}
        cardSkeleton={<CardSkeleton widht={1} />}
        itemCount={skeletonCount}
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

      {/* Horizontal scrolling koleksi cards */}
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
        {dataKoleksi.map((koleksi, index) => {
          return (
            <KoleksiCard key={`koleksi-${koleksi.name}-${index}`} Koleksi={koleksi} width={2.7} />
          );
        })}
      </ScrollView>
    </View>
  );
}
