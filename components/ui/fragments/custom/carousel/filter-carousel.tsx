// components/ui/fragments/custom/carousel/filter-carousel.tsx

import { ScrollView } from 'react-native';
import React from 'react';

import { cn } from '@/lib/utils';
import { Text } from '../../shadcn-ui/text';
import { Button } from '../../shadcn-ui/button';
import { Icon } from '../../shadcn-ui/icon';
import { ArrowUpDown, LucideIcon, SlidersHorizontal } from 'lucide-react-native';

interface Filter {
  label: string;
  onPress?: () => void;
  icon?: LucideIcon;
  value?: string;
}

const sampleFilters: Filter[] = [
  { label: 'Filter', icon: SlidersHorizontal },
  { label: 'Brands' },
  { label: 'Categories' },
  { label: 'Urutan', icon: ArrowUpDown },
  { label: 'Trending' },
  { label: 'Price' },
  { label: 'Rating' },
  { label: 'Reviews' },
  { label: 'Date' },
  { label: 'Location' },
];

type FiltersCarouselProps = {
  Filters?: Filter[];
  className?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// ✅ Carousel sekarang komponen murni tanpa Animated.View wrapper.
//
// Animasi dipindah ke parent (products.tsx) yang merender Animated.View
// sebagai overlay wrapper. Ini memisahkan concerns:
//
//   - FiltersCarousel: hanya handle render filter buttons + horizontal scroll
//   - products.tsx: handle animasi show/hide via Animated.View
//
// Keuntungan:
//   1. ScrollView tidak di dalam navigation header → tidak ada gesture conflict
//   2. Tidak perlu prop actionBarStyle — komponen lebih bersih & reusable
//   3. nestedScrollEnabled mencegah conflict scroll horizontal vs vertical
// ─────────────────────────────────────────────────────────────────────────────
export default function FiltersCarousel({
  Filters = sampleFilters,
  className,
}: FiltersCarouselProps) {
  return (
    <ScrollView
      horizontal
      scrollEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 12,
        gap: 10,
        zIndex: 20, // Pastikan carousel tetap di atas konten lainnya
      }}
      // ✅ nestedScrollEnabled WAJIB di Android agar horizontal ScrollView
      // tidak bentrok dengan vertical scroll dari FlatList di belakangnya
      nestedScrollEnabled
      decelerationRate="fast"
      className={cn('z-20 w-full', className)}>
      {Filters.map((filter, index) => (
        <Button
          key={`filter-${filter.label}-${index}`}
          onPress={filter.onPress}
          variant="outline"
          size="sm"
          className="gap-3">
          {filter.icon && <Icon as={filter.icon} size={16} className="text-muted-foreground/80" />}
          <Text>{filter.label}</Text>
        </Button>
      ))}
    </ScrollView>
  );
}
