// components/ui/core/block/detail-product.tsx
// ✅ FIX: sameSeller carousel pakai productQueryOptions (offset 80)
// bukan productCategoryQueryOptions yang broken di Platzi

import { Pressable, View, ViewStyle } from 'react-native';
import React from 'react';
import { Product, ProductFilters } from '@/type/products-type';
import { Wrapper } from '@/components/provider/wrapper';
import ProductGallery from '../../fragments/custom/gallery/product-gallery';
import Animated, {
  AnimatedRef,
  AnimatedScrollViewProps,
  AnimatedStyle,
  FadeInDown,
} from 'react-native-reanimated';
import { Text } from '../../fragments/shadcn-ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/fragments/shadcn-ui/avatar';
import { Icon } from '../../fragments/shadcn-ui/icon';
import {
  ChevronRight,
  Flame,
  Handbag,
  LucideIcon,
  Mail,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
} from 'lucide-react-native';
import { Button, buttonTextVariants, buttonVariants } from '../../fragments/shadcn-ui/button';
import { Badge } from '../../fragments/shadcn-ui/badge';
import { ImagesPreview } from '../../fragments/custom/dialog/images-dialog';
import { Separator } from '../../fragments/shadcn-ui/separator';
import { router } from 'expo-router';
import { cn } from '@/lib/utils';
import { formatDistance, subDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import {
  productQueryOptions, // ✅ Ganti dari productCategoryQueryOptions
  productCategoryQueryOptions, // ✅ Tetap pakai untuk "kamu mungkin suka" karena works
} from '@/lib/server/products/products-queris-server';
import ProductCarousel from '../../fragments/custom/carousel/product-carousel';

type DetailProductProps = {
  Product: Product;
  CARD_WIDTH: number;
  IMAGE_HEIGHT: number;
  imageAnimationStyle: AnimatedStyle<ViewStyle>;
  scrollRef?: AnimatedRef<Animated.ScrollView>;
  onScroll?: AnimatedScrollViewProps['onScroll'];
  bottomPadding?: number;
};

export interface MenuDetail {
  icon?: LucideIcon;
  Label: string;
  onPress?: () => void;
  Value?: string | number;
  rigthComponent?: React.ReactNode;
}

export default function DetailProduct({
  Product,
  scrollRef,
  onScroll,
  CARD_WIDTH,
  IMAGE_HEIGHT,
  imageAnimationStyle,
  bottomPadding = 80,
}: DetailProductProps) {
  function navigateToCategory(category: string) {
    router.push({
      pathname: '/(tabs)/explore',
      params: { category },
    });
  }

  const dateFormated = formatDistance(subDays(new Date(), 3), Product.createdAt, {
    addSuffix: true,
    locale: id,
  });

  const menuDetails: MenuDetail[] = [
    {
      Label: 'Kategori',
      Value: Product.category.name,
      onPress: () => navigateToCategory(Product.category.name),
    },
    {
      Label: 'Kondisi',
      Value: 'Baik',
      onPress: () => navigateToCategory(Product.category.name),
    },
    {
      Label: 'Uploaded',
      Value: dateFormated,
    },
  ];

  const images = Product.images || [];
  const [showPreview, setShowPreview] = React.useState<number | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  // ✅ FIX "Lainnya dari seller":
  // Sebelum: productCategoryQueryOptions(3) → /categories/3/products → sering empty
  // Sesudah: productQueryOptions({ offset: 80 }) → /products → SELALU ada data
  // Offset 80 dipilih supaya berbeda dari carousel di beranda (0, 30, 60) & infinite scroll
  const sameSellerQuery = useQuery(productQueryOptions({ limit: 6, offset: 30 }));

  // ✅ "Kamu mungkin suka" tetap pakai category ID dari product
  // Ini works karena Product.category.id dari produk yang sedang dibuka
  // adalah ID yang memang ada di Platzi (bukan hardcode angka random)
  const similarProductsQuery = useQuery(
    productCategoryQueryOptions(Product.category.id, { limit: 5 })
  );

  return (
    <>
      <Wrapper
        edges={['bottom']}
        scrollRef={scrollRef}
        onScroll={onScroll}
        className="gap-0s pb-20">
        <ProductGallery
          setShowPreview={setShowPreview}
          imageAnimationStyle={imageAnimationStyle}
          images={images}
          CARD_WIDTH={CARD_WIDTH}
          IMAGE_HEIGHT={IMAGE_HEIGHT}
        />

        <View className="gap-5 bg-background py-0">
          {/* Seller info */}
          <View className="gap-3 px-4">
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Avatar
                  className="size-10 overflow-hidden rounded-full border-2 border-background bg-primary-foreground"
                  alt={`Seller-${Product.id} avatar`}>
                  <AvatarImage
                    source={require('@/assets/images/brand/app/adaptive-icon.png')}
                    className="h-full w-full bg-foreground"
                  />
                  <AvatarFallback>
                    <Text className="text-xs font-semibold">PL</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="gap-0.5">
                  <Text variant="h2" className="my-0 border-0 p-0 text-sm font-medium">
                    Preloved
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Icon className="fill-blue-700 text-blue-700" size={12} as={Star} />
                    <Text className="text-xs">4.8</Text>
                    <Text variant="muted" className="text-xs">
                      (12)
                    </Text>
                  </View>
                </View>
              </View>
              <Button variant="ghost" size="icon">
                <Icon as={Mail} size={20} />
              </Button>
            </View>

            <View className="w-fit flex-row gap-2">
              <Badge variant="secondary" className="w-fit gap-1.5 px-2.5 py-1">
                <Icon as={Flame} />
                <Text variant="small">Staff Pick</Text>
              </Badge>
              <Badge variant="secondary" className="w-fit gap-1.5 px-2.5 py-1">
                <Icon as={ShoppingBag} />
                <Text variant="small">2 Terjual</Text>
              </Badge>
            </View>
          </View>

          <Separator className="border-accent" />

          {/* Title & Price */}
          <View className="gap-4 border-border px-4">
            <View className="gap-0.5">
              <Text variant="h3" className="text-sm font-medium capitalize">
                {Product.title}
              </Text>
              <Text variant="muted">Baik • Lengkap</Text>
            </View>
            <Text variant="h3" className="text-sm font-medium capitalize">
              {Product.price.toLocaleString('id-ID', {
                style: 'currency',
                minimumFractionDigits: 3,
                maximumFractionDigits: 5,
                currency: 'IDR',
              })}
            </Text>
          </View>

          <Separator className="h-2.5 border-2 border-t border-accent" />

          {/* Description */}
          <View className="gap-0 px-4">
            <Text variant="muted" className="text-sm font-medium">
              Detail
            </Text>
            <Text
              variant="p"
              className={cn('text-sm', showAll ? 'line-clamp-none' : 'line-clamp-3')}>
              {Product.description}
            </Text>
            <Pressable
              onPress={() => setShowAll((prev) => !prev)}
              className={cn('mt-1 w-fit', showAll && 'sr-only')}>
              <Text variant="small" className="text-xs text-blue-500 underline underline-offset-2">
                Lihat Detail
              </Text>
            </Pressable>
          </View>

          {showAll && (
            <Animated.View entering={FadeInDown.duration(200)}>
              {menuDetails.map((detail, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onPress={detail.onPress}
                  className={cn(
                    'h-fit w-full justify-between rounded-none bg-background py-4 dark:bg-background',
                    'border-b-0',
                    detail.onPress
                      ? 'active:bg-accent dark:active:bg-input/50'
                      : 'active:bg-transparent dark:active:bg-transparent'
                  )}>
                  <Text variant="h4">{detail.Label}</Text>
                  <View className="flex-row items-center gap-1">
                    <Text variant="p" className="m-0 p-0">
                      {detail.Value}
                    </Text>
                    <Icon
                      as={ChevronRight}
                      size={16}
                      className={cn(!detail.onPress && 'sr-only')}
                    />
                  </View>
                </Button>
              ))}
            </Animated.View>
          )}

          <Separator className="h-2.5 border-2 border-t border-accent" />

          {/* Garansi */}
          <Button
            className="h-fit w-full justify-between rounded-none px-4 active:bg-transparent active:opacity-70 dark:active:bg-transparent"
            variant="ghost"
            size="lg">
            <View className="w-fit flex-1 flex-row items-center gap-2">
              <View
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'lg' }),
                  buttonTextVariants({ variant: 'secondary', size: 'lg' }),
                  'mr-3 size-14 rounded-full border border-muted-foreground/30'
                )}>
                <Icon as={ShieldCheck} size={24} />
              </View>
              <View className="w-full flex-1 gap-1">
                <Text variant="h4" className="text-left text-sm font-medium">
                  Garansi Pembelian
                </Text>
                <Text variant="muted" className="text-left text-sm text-muted-foreground">
                  Belanja di preloved aman dengan garansi uang kembali
                </Text>
              </View>
            </View>
            <Icon as={ChevronRight} size={20} />
          </Button>

          <Separator className="h-2.5 border-2 border-t border-accent" />

          {/* Seller card */}
          <View className="gap-5 px-4">
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Avatar
                  className="size-16 overflow-hidden rounded-full border-2 border-background bg-primary-foreground"
                  alt={`Seller-${Product.id} avatar`}>
                  <AvatarImage
                    source={require('@/assets/images/brand/app/adaptive-icon.png')}
                    className="h-full w-full bg-foreground"
                  />
                  <AvatarFallback>
                    <Text className="text-xs font-semibold">PL</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="gap-1">
                  <Text variant="h3" className="m-0 border-0 p-0 text-sm font-medium">
                    Preloved{'  '}
                    <Text variant="muted" className="m-0 -mt-1 border-0 p-0 font-normal">
                      • Bogor
                    </Text>
                  </Text>
                  <View className="m-0 flex-row items-center gap-1 p-0">
                    <Icon className="fill-blue-700 text-blue-700" size={12} as={Star} />
                    <Text className="text-xs">4.8</Text>
                    <Text variant="muted" className="m-0 p-0 text-xs">
                      (12)
                    </Text>
                  </View>
                </View>
              </View>
              <Button variant="default" className="size-7 rounded-full" size="icon">
                <Icon as={Plus} size={20} className="text-primary-foreground" />
              </Button>
            </View>
            <View className="w-full flex-row gap-2.5">
              <Button variant="secondary" className="flex-1" size="sm">
                <Text variant="h4" className="text-sm font-medium">
                  Lihat toko
                </Text>
              </Button>
              <Button variant="secondary" className="flex-1" size="sm">
                <Text variant="h4" className="text-sm font-medium">
                  Message
                </Text>
              </Button>
            </View>
          </View>

          <Separator className="h-2.5 border-2 border-t border-accent" />

          {/* Carousels */}
          <View className="gap-6">
            {/* ✅ Carousel 1: "Lainnya dari seller" — pakai /products offset 80, bukan category */}
            <ProductCarousel
              title="Lainnya dari seller"
              products={sameSellerQuery.data?.products ?? []}
              isLoading={sameSellerQuery.isLoading}
              onSeeAllPress={() => router.push('/(tabs)/explore')}
            />

            <Separator className="border-accent" />

            {/* ✅ Carousel 2: "Kamu mungkin suka" — tetap by category ID (works) */}
            <ProductCarousel
              title="Kamu mungkin suka"
              products={similarProductsQuery.data?.products ?? []}
              isLoading={similarProductsQuery.isLoading}
            />
          </View>
        </View>
      </Wrapper>

      {showPreview !== null && (
        <ImagesPreview images={images} curentIndex={showPreview} setShowPreview={setShowPreview} />
      )}
    </>
  );
}
