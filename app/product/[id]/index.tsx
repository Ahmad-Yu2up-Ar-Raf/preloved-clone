// app/product/[id]/index.tsx
// ✅ FINAL ROOT CAUSE FIX untuk icon color:
//
// Masalah sebelumnya:
// - useAnimatedProps({ color }) → lucide SVG tidak bisa di-drive native
// - cssInterop override → color kalah
//
// SOLUSI BENAR: Overlay 2 icon (putih + hitam), animate OPACITY
// Opacity adalah satu-satunya prop yang 100% native animatable di semua RN component
// Tidak ada dependency pada SVG props, tidak ada cssInterop issue

import React from 'react';
import { View, ActivityIndicator, Dimensions, Pressable, ViewStyle } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { productByIdQueryOptions } from '@/lib/server/products/products-queris-server';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import DetailProduct from '@/components/ui/core/block/detail-product';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { ChevronLeft, ShoppingBag } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ACTION_BAR_HEIGHT = 72;

// ─── Animated Icon Overlay Component ─────────────────────────────────────────
// Render 2 icon ditumpuk: putih (awal) + hitam (akhir)
// Animate opacity masing-masing secara berlawanan
// Ini 100% native thread — opacity selalu bisa di-animate native
type AnimatedDualIconProps = {
  IconComponent: typeof ChevronLeft;
  size?: number;
  scrollY: SharedValue<number>;
  fadeStart: number;
  fadeEnd: number;
};

function AnimatedDualIcon({
  IconComponent,
  size = 24,
  scrollY,
  fadeStart,
  fadeEnd,
}: AnimatedDualIconProps) {
  // ✅ Icon putih: opacity 1 → 0 (fade out saat scroll)
  const whiteIconStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(scrollY.value, [fadeStart, fadeEnd], [1, 0], 'clamp'),
  }));

  // ✅ Icon hitam: opacity 0 → 1 (fade in saat scroll)
  const darkIconStyle = useAnimatedStyle<ViewStyle>(() => ({
    opacity: interpolate(scrollY.value, [fadeStart, fadeEnd], [0, 1], 'clamp'),
  }));

  return (
    // Container relatif — kedua icon ditumpuk di posisi yang sama
    <View style={{ width: size, height: size }}>
      {/* Icon putih — visible di atas gambar */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, whiteIconStyle]}>
        <IconComponent size={size} color="#ffffff" />
      </Animated.View>

      {/* Icon hitam — visible setelah scroll (light mode) */}
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0 }, darkIconStyle]}>
        <IconComponent size={size} color="#0a0a0a" />
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ProductDetail() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const bgColor = THEME[currentTheme].background;

  const CARD_WIDTH = SCREEN_WIDTH;
  const IMAGE_HEIGHT = CARD_WIDTH * (4 / 3.3);

  const FADE_START = IMAGE_HEIGHT * 0.1;
  const FADE_END = IMAGE_HEIGHT * 0.5;

  // ─── Scroll tracking ─────────────────────────────────────────────────────
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet';
      scrollY.value = event.contentOffset.y;
    },
  });

  // ─── Parallax image ───────────────────────────────────────────────────────
  const imageAnimationStyle = useAnimatedStyle<ViewStyle>(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
          [-IMAGE_HEIGHT / 2, 0, IMAGE_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(scrollY.value, [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT], [2, 1, 1]),
      },
    ],
  }));

  // ─── Header background ────────────────────────────────────────────────────
  const headerBgStyle = useAnimatedStyle<ViewStyle>(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [FADE_START, FADE_END],
      ['rgba(0,0,0,0)', bgColor]
    );
    return { backgroundColor };
  });

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading, isError, error } = useQuery(productByIdQueryOptions(productId));
  const SCREEN_OPTIONS = {
    headerTransparent: true,
    header: () => (
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            paddingTop: insets.top,
            paddingBottom: 8,
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          headerBgStyle,
        ]}>
        {/* Back Button */}
        <Button
          onPress={() => router.back()}
          size="icon"
          variant="ghost"
          className="size-10 rounded-full active:bg-accent/50">
          {/*
           * ✅ AnimatedDualIcon: 2 icon ditumpuk, animate opacity berlawanan
           * - Putih fade out seiring scroll
           * - Hitam fade in seiring scroll
           * Tidak ada cssInterop, tidak ada SVG prop issue
           */}

          {currentTheme === 'light' ? (
            <AnimatedDualIcon
              IconComponent={ChevronLeft}
              size={30}
              scrollY={scrollY}
              fadeStart={FADE_START}
              fadeEnd={FADE_END}
            />
          ) : (
            <Icon as={ChevronLeft} size={30} color="#ffffff" />
          )}
        </Button>

        {/* Wishlist Button */}
        <Button
          onPressIn={() => router.push('/keranjang')}
          size="icon"
          variant="ghost"
          className="size-10 rounded-full active:bg-accent/50">
          {currentTheme === 'light' ? (
            <AnimatedDualIcon
              IconComponent={ShoppingBag}
              size={27}
              scrollY={scrollY}
              fadeStart={FADE_START}
              fadeEnd={FADE_END}
            />
          ) : (
            <Icon as={ShoppingBag} size={27} color="#ffffff" />
          )}
        </Button>
      </Animated.View>
    ),
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View style={{ flex: 1 }}>
        {/* Loading */}
        {isLoading && (
          <View className="flex-1 items-center justify-center bg-background">
            <ActivityIndicator size="large" />
            <Text className="mt-3 text-sm text-muted-foreground">Loading product...</Text>
          </View>
        )}

        {/* Error */}
        {(isError || !product) && !isLoading && (
          <View className="flex-1 items-center justify-center bg-background px-6">
            <Text className="text-lg font-semibold text-destructive">Product not found</Text>
            <Text className="mt-2 text-center text-sm text-muted-foreground">
              {error?.message ?? 'Something went wrong'}
            </Text>
            <Pressable
              onPress={() => router.back()}
              className="mt-4 rounded-full bg-primary px-6 py-2 active:opacity-70">
              <Text className="font-semibold text-primary-foreground">Go Back</Text>
            </Pressable>
          </View>
        )}

        {/* Content */}
        {product && (
          <DetailProduct
            imageAnimationStyle={imageAnimationStyle}
            scrollRef={scrollRef}
            onScroll={scrollHandler}
            CARD_WIDTH={CARD_WIDTH}
            IMAGE_HEIGHT={IMAGE_HEIGHT}
            Product={product}
            bottomPadding={ACTION_BAR_HEIGHT + insets.bottom + 8}
          />
        )}

        {/* ─── Floating Header ────────────────────────────────────────────────── */}

        {/* Bottom Action Bar */}
        {product && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: insets.bottom > 0 ? insets.bottom + 7 : 12,
              paddingTop: 12,
              paddingHorizontal: 15,
              backgroundColor: bgColor,
              borderTopWidth: 0.5,
              borderTopColor: THEME[currentTheme].border,
              flexDirection: 'row',
              gap: 9,
              zIndex: 100,
            }}>
            <Button variant="outline" className="flex-1 rounded-xl">
              <Text className="font-Termina_Bold text-sm text-primary">Nego</Text>
            </Button>
            <Button variant="default" className="flex-1 rounded-xl">
              <Text className="font-Termina_Bold text-sm text-primary-foreground">Beli</Text>
            </Button>
          </View>
        )}
      </View>
    </>
  );
}
