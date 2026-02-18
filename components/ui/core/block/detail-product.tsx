// components/ui/core/block/detail-product.tsx
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
  FadeInUp,
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
import { Href, Link, router } from 'expo-router';
import { cn } from '@/lib/utils';
import { formatDistance, format, subDays } from 'date-fns';
import { id } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import {
  productCategoryQueryOptions,
  productQueryOptions,
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
      // ✅ Static string — Expo Router bisa infer type-nya
      pathname: '/(tabs)/explore',
      // ✅ ID dipisah ke params — runtime akan inject ke [id]
      params: { category: category },
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
  const filter: ProductFilters = {
    limit: 10,
    price_max: 35,
  };
  // ✅ null = tutup | number = buka di index tersebut
  const sameSeller = useQuery(productQueryOptions(filter));
  const [showPreview, setShowPreview] = React.useState<number | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  const similarProducts = useQuery(productCategoryQueryOptions(Product.category.id, { limit: 5 }));
  return (
    <>
      <Wrapper edges={['bottom']} scrollRef={scrollRef} onScroll={onScroll} className="pb-20">
        <ProductGallery
          setShowPreview={setShowPreview}
          imageAnimationStyle={imageAnimationStyle}
          images={images}
          CARD_WIDTH={CARD_WIDTH}
          IMAGE_HEIGHT={IMAGE_HEIGHT}
        />

        <View className="gap-5 bg-background py-3">
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
                <Icon as={Flame} className=" " />
                <Text variant="small">Staff Pick</Text>
              </Badge>
              <Badge variant="secondary" className="w-fit gap-1.5 px-2.5 py-1">
                <Icon as={ShoppingBag} className=" " />
                <Text variant="small">2 Terjual</Text>
              </Badge>
            </View>
          </View>
          <Separator className="border-accent" />
          <View className="gap-4 border-border px-4">
            <View className="gap-0.5">
              <Text variant="h3" className="text-sm font-medium capitalize">
                {Product.title}
              </Text>

              <Text variant={'muted'}>Baik • Lengkap</Text>
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
              <Text
                variant={'small'}
                className={cn('text-xs text-blue-500 underline underline-offset-2')}>
                Lihat Detail
              </Text>
            </Pressable>
          </View>
          {showAll && (
            <Animated.View entering={FadeInDown.duration(200)}>
              {menuDetails.map((detail, i) => (
                <Button
                  key={i}
                  variant={'outline'}
                  onPress={detail.onPress}
                  className={cn(
                    'h-fit w-full justify-between rounded-none bg-background py-4 dark:bg-background',
                    i != menuDetails.length - 1 ? 'border-b-0' : 'border-b-0',
                    detail.onPress
                      ? 'active:bg-accent dark:active:bg-input/50'
                      : 'active:bg-transparent dark:active:bg-transparent'
                  )}>
                  <Text variant={'h4'}>{detail.Label}</Text>
                  <View className="flex-row items-center gap-1">
                    <Text variant={'p'} className="m-0 p-0">
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
          <Button
            className="h-fit w-full justify-between rounded-none px-4 active:bg-transparent active:opacity-70 dark:active:bg-transparent"
            variant={'ghost'}
            size={'lg'}>
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
                <Text variant={'h4'} className="text-left text-sm font-medium">
                  Garansi Pembelian
                </Text>
                <Text variant={'muted'} className="text-left text-sm text-muted-foreground">
                  Belanja di preloved aman dengan garansi uang kembali
                </Text>
              </View>
            </View>
            <Icon as={ChevronRight} size={20} />
          </Button>
          <Separator className="h-2.5 border-2 border-t border-accent" />
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
                <View className="gap-2">
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
          <View className="gap-6">
            <ProductCarousel
              title="Lainnya dari seller"
              products={sameSeller.data?.products ?? []}
              isLoading={sameSeller.isLoading}
              onSeeAllPress={() => {
                router.push(`/(tabs)/explore?category=${Product.category.id}`);
              }}
            />
            <Separator className="border-accent" />
            <ProductCarousel
              title="Kamu mungkin suka"
              products={similarProducts.data?.products ?? []}
              isLoading={similarProducts.isLoading}
            />
          </View>
        </View>
      </Wrapper>

      {/*
       * ✅ Mount/unmount = trigger FadeIn/FadeOut Reanimated di ImagesPreview
       * showPreview !== null → render → FadeIn
       * setShowPreview(null) → unmount → FadeOut
       */}
      {showPreview !== null && (
        <ImagesPreview images={images} curentIndex={showPreview} setShowPreview={setShowPreview} />
      )}
    </>
  );
}
