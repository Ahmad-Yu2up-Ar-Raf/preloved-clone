// components/ui/fragments/custom/card/product/product-card.tsx
// ✅ FIXED: TypeScript error + navigasi ke /product/[id]/index

'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react';
import { cn } from '@/lib/utils';
import {
  Dimensions,
  View,
  ViewProps,
  Vibration,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from 'react-native';
import { Image } from '../../shadcn-ui/image';
import { Product } from '@/type/products-type';
import { Text } from '../../shadcn-ui/text';
import { Button } from '../../shadcn-ui/button';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import { batasiKata } from '@/hooks/useWord';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';

// ─────────────────────────────────────────────────────────────
// ✅ URL sanitizer — di-keep di sini sebagai defense layer kedua
// (layer pertama sudah di product-mappers.ts)
// ─────────────────────────────────────────────────────────────
function sanitizeUrl(raw: string | undefined | null): string | null {
  if (!raw || typeof raw !== 'string') return null;
  let url = raw.trim();

  if (url.startsWith('[')) {
    try {
      const parsed = JSON.parse(url);
      url = Array.isArray(parsed) ? String(parsed[0]).trim() : '';
    } catch {
      url = url.replace(/^\["|"\]$/g, '').trim();
    }
  }

  if (url.toLowerCase().includes('.svg')) return null;
  if (!url.startsWith('http')) return null;
  return url;
}

// ─────────────────────────────────────────────────────────────
// ✅ Helper navigasi — dipusatkan agar mudah diubah
// KUNCI FIX TYPESCRIPT: gunakan `pathname` + `params` terpisah
// Expo Router typed routes TIDAK menerima template literal
// ─────────────────────────────────────────────────────────────
function navigateToProduct(productId: number) {
  router.push({
    // ✅ Static string — Expo Router bisa infer type-nya
    pathname: '/product/[id]',
    // ✅ ID dipisah ke params — runtime akan inject ke [id]
    params: { id: productId },
  });
}

// ─────────────────────────────────────────────────────────────

type ProductProps = {
  Product: Product;
  className?: string;
  widht?: number;
  index?: number;
  showAction?: boolean;
  withCarousel?: boolean;
};

export function ProductCard({
  Product,
  className,
  index,
  showAction = true,
  withCarousel = true,
  widht = 2.25,
  ...props
}: ProductProps & ViewProps & React.RefAttributes<View>) {
  const Price = Product.price.toLocaleString('id-ID', {
    style: 'currency',
    minimumFractionDigits: 3,
    maximumFractionDigits: 5,

    currency: 'IDR',
  });

  const images = React.useMemo(() => {
    const raw = Product.images ?? [];
    const cleaned = raw.map(sanitizeUrl).filter(Boolean) as string[];
    const thumb = sanitizeUrl(Product.thumbnail);
    return cleaned.length > 0 ? cleaned : thumb ? [thumb] : [];
  }, [Product.images, Product.thumbnail]);

  const screenWidth = Dimensions.get('window').width;
  const CARD_WIDTH = screenWidth / widht;
  const IMAGE_HEIGHT = CARD_WIDTH * (4 / 3);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const title = batasiKata(Product.title, 2);
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';

  const ONE_SECOND_IN_MS = 40;

  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
      if (idx !== activeIndex) setActiveIndex(idx);
    },
    [CARD_WIDTH, activeIndex]
  );

  const showCarousel = withCarousel && images.length > 1;
  const PATTERN = [1 * ONE_SECOND_IN_MS, 2 * ONE_SECOND_IN_MS, 3 * ONE_SECOND_IN_MS];
  const animation = React.useRef<LottieView>(null);
  const isFirstRun = React.useRef(true);
  const [isWhislisted, setIsWhislited] = React.useState(false);

  React.useEffect(() => {
    if (isFirstRun.current) {
      if (isWhislisted) {
        animation.current?.play(19, 50);
      } else {
        animation.current?.play(19, 19);
      }
      isFirstRun.current = false;
    } else if (isWhislisted) {
      animation.current?.play(19, 50);
    } else {
      animation.current?.play(0, 19);
    }
  }, [isWhislisted]);

  const handleWhistlist = () => {
    setIsWhislited((v) => !v);
    Vibration.vibrate(PATTERN);
  };

  return (
    <Card
      className={cn(
        'relative m-auto h-fit w-full gap-0.5 overflow-hidden rounded-none border-0 bg-background p-0 shadow-none',
        className
      )}
      style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT + 60 }}
      {...props}>
      {/* ─── Image Area ──────────────────────────────────────────── */}
      <CardHeader
        className="relative mb-1.5 w-full overflow-hidden rounded-2xl bg-muted px-0"
        style={{ height: IMAGE_HEIGHT }}>
        {images.length === 0 ? (
          <Image
            source={{ uri: 'https://placehold.co/400x400/e5e7eb/9ca3af?text=No+Image' }}
            contentFit="cover"
            className="h-full w-full bg-white"
          />
        ) : showCarousel ? (
          <View style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
              bounces={false}
              nestedScrollEnabled={true}
              directionalLockEnabled={true}
              style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT }}>
              {images.map((uri, i) => (
                <Pressable
                  // ✅ FIXED: Pakai helper function — tidak ada lagi TypeScript error
                  onPress={() => navigateToProduct(Product.id)}
                  key={`img-${i}`}
                  className="active:opacity-70"
                  style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT }}>
                  <Image
                    source={{ uri }}
                    contentFit="cover"
                    showLoadingIndicator={true}
                    showErrorFallback={false}
                    className="h-full w-full bg-white"
                  />
                </Pressable>
              ))}
            </ScrollView>

            {images.length > 1 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 16,
                  left: 0,
                  right: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 4,
                }}>
                {images.map((_, i) => (
                  <View
                    key={`dot-${i}`}
                    style={{
                      height: 6.5,
                      width: 6.5,
                      borderColor: 'rgba(255, 255, 255, 0.8)',
                      borderWidth: 0.5,
                      borderRadius: 30,
                      backgroundColor:
                        i === activeIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.35)',
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <Pressable
            // ✅ FIXED
            onPress={() => navigateToProduct(Product.id)}
            className="active:opacity-70">
            <Image
              source={{ uri: images[0] }}
              contentFit="cover"
              showLoadingIndicator={true}
              showErrorFallback={false}
              className="h-full w-full bg-white"
            />
          </Pressable>
        )}
      </CardHeader>

      {/* ─── Info ────────────────────────────────────────────────── */}
      <CardContent className="relative w-full flex-row items-center justify-between px-1.5 py-0.5">
        <Pressable
          // ✅ FIXED
          onPress={() => navigateToProduct(Product.id)}
          className="flex-1 gap-0.5 pr-1 active:opacity-70">
          <CardTitle className="text-xs font-semibold tracking-tight text-primary">
            {Price}
          </CardTitle>
          <CardDescription className="line-clamp-1 text-[11px] font-normal text-muted-foreground">
            {title}
          </CardDescription>
          <Text className="line-clamp-1 text-[11px] font-normal text-muted-foreground">
            {Product.category?.name ?? 'Product'}
          </Text>
        </Pressable>

        {showAction && (
          <CardAction className="size-fit p-0">
            <Button
              onPress={handleWhistlist}
              variant="ghost"
              size="icon"
              className="size-6 rounded-full border-none p-0">
              <LottieView
                speed={isWhislisted ? 1.7 : 0.6}
                ref={animation}
                style={{
                  width: isWhislisted ? 50 : 40,
                  height: isWhislisted ? 50 : 40,
                }}
                source={require('@/assets/animations/like.json')}
                autoPlay={false}
                loop={false}
              />
            </Button>
          </CardAction>
        )}
      </CardContent>
    </Card>
  );
}
