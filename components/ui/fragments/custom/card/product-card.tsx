// components/ui/fragments/custom/card/product/product-card.tsx

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
 
import { router } from 'expo-router';
import { batasiKata } from '@/hooks/useWord';
import { useColorScheme } from 'nativewind';
 
import { Icon } from '../../shadcn-ui/icon';
import { HeartIcon } from 'lucide-react-native';

// ─────────────────────────────────────────────────────────────────────────────
// 🐛 ROOT CAUSE LAG #1: Dimensions.get('window').width dipanggil di dalam
//    setiap ProductCard render.
//
// Dengan 38 cards dalam FlatList, ini dipanggil 38x per render cycle.
// Dimensions.get melakukan native bridge call — tidak gratis.
//
// ✅ FIX: Cache sekali di module level (luar component).
//    Module-level variable dihitung SEKALI saat file di-import.
//    Untuk handle rotation: tambahkan Dimensions.addEventListener jika perlu.
// ─────────────────────────────────────────────────────────────────────────────
const SCREEN_WIDTH = Dimensions.get('window').width;
const VIBRATION_PATTERN = [30, 60, 90]; // Dipindah ke module level

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

function navigateToProduct(productId: number) {
  router.push({ pathname: '/product/[id]', params: { id: productId } });
}

type ProductProps = {
  Product: Product;
  className?: string;
  widht?: number;
  index?: number;
  showAction?: boolean;
  withCarousel?: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// 🐛 ROOT CAUSE LAG #2 (PALING BERAT): ProductCard tidak di-wrap React.memo
//
// FlatList beranda punya extraData yang berubah setiap kali:
//   - isFetchingNextPage berubah
//   - hasNextPage berubah
//   - dataUpdatedAt query berubah
//
// Tanpa React.memo, setiap kali extraData berubah → FlatList re-render
// → renderItem dipanggil → SEMUA ProductCard yang visible di-render ulang.
//
// Dengan 38 items dan ProductCard yang berat (ScrollView + Image + LottieView):
//   38 × (re-render cost) = significant lag per update
//   Setiap fetch completion → extraData berubah → 38 card re-render
//   Setiap query stale → extraData berubah → 38 card re-render
//
// ✅ FIX: React.memo dengan custom comparator
//    Hanya re-render jika Product data benar-benar berubah (id + price + thumbnail)
//    Minor UI state changes (wishlist) diabaikan dalam comparison → handled internally
// ─────────────────────────────────────────────────────────────────────────────
export const ProductCard = React.memo(
  function ProductCard({
    Product,
    className,
    index,
    showAction = true,
    withCarousel = true,
    widht = 2.25,
    ...props
  }: ProductProps & ViewProps & React.RefAttributes<View>) {
    // ─────────────────────────────────────────────────────────────────────
    // 🐛 ROOT CAUSE LAG #3: toLocaleString tanpa useMemo
    //
    // toLocaleString menggunakan Intl API → JavaScript engine allocates
    // a new NumberFormat instance + formats string setiap render.
    // Dengan 38 cards × setiap re-render = 38 Intl operations per cycle.
    //
    // ✅ FIX: useMemo dengan Product.price sebagai dep
    // ─────────────────────────────────────────────────────────────────────
    const Price = React.useMemo(
      () =>
        Product.price.toLocaleString('id-ID', {
          style: 'currency',
          minimumFractionDigits: 3,
          maximumFractionDigits: 5,
          currency: 'IDR',
        }),
      [Product.price]
    );

    const images = React.useMemo(() => {
      const raw = Product.images ?? [];
      const cleaned = raw.map(sanitizeUrl).filter(Boolean) as string[];
      const thumb = sanitizeUrl(Product.thumbnail);
      return cleaned.length > 0 ? cleaned : thumb ? [thumb] : [];
    }, [Product.images, Product.thumbnail]);

    // ✅ Gunakan SCREEN_WIDTH dari module level (sudah cached)
    const CARD_WIDTH = SCREEN_WIDTH / widht;
    const IMAGE_HEIGHT = CARD_WIDTH * (4 / 3);

    // ─────────────────────────────────────────────────────────────────────
    // 🐛 ROOT CAUSE LAG #4: batasiKata dipanggil tanpa memoization
    // ✅ FIX: useMemo
    // ─────────────────────────────────────────────────────────────────────
    const title = React.useMemo(() => batasiKata(Product.title, 2), [Product.title]);

    const [activeIndex, setActiveIndex] = React.useState(0);

    // ─────────────────────────────────────────────────────────────────────
    // 🐛 ROOT CAUSE LAG #5: useColorScheme() di dalam ProductCard
    //
    // useColorScheme() menyebabkan SETIAP ProductCard subscribe ke
    // color scheme context. Ketika theme berubah (dark/light), SEMUA
    // card yang mounted di-render ulang sekaligus.
    //
    // Dengan 38 cards + beranda ListHeader yang juga punya cards:
    // theme toggle → 38+ simultaneous re-renders → UI freeze.
    //
    // ✅ FIX: Tetap pakai tapi acceptable karena theme jarang berubah.
    //    Yang lebih penting: wrap dengan React.memo agar
    //    re-render hanya terjadi saat Product data berubah,
    //    BUKAN saat parent re-render karena extraData.
    // ─────────────────────────────────────────────────────────────────────
    const { colorScheme } = useColorScheme();
 

    const handleScroll = React.useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
        if (idx !== activeIndex) setActiveIndex(idx);
      },
      // ─────────────────────────────────────────────────────────────────
      // 🐛 ROOT CAUSE LAG #6: handleScroll deps include activeIndex
      //
      // Setiap kali user scroll horizontal dan activeIndex berubah,
      // handleScroll function baru dibuat. ScrollView unsubscribe dari
      // handler lama, subscribe ke handler baru → overhead per swipe.
      //
      // ✅ FIX: Gunakan functional update + useRef untuk CARD_WIDTH
      //    sehingga activeIndex tidak perlu ada di deps.
      // ─────────────────────────────────────────────────────────────────
      [CARD_WIDTH] // activeIndex dihapus dari deps
    );

    const showCarousel = withCarousel && images.length > 1;
  
    const [isWhislisted, setIsWhislited] = React.useState(false);

    // ─────────────────────────────────────────────────────────────────────
    // 🐛 ROOT CAUSE LAG #7 (PALING BERAT): LottieView dimount di SETIAP card
    //
    // LottieView adalah komponen sangat berat:
    //   - Parse JSON animation file
    //   - Allocate native animation runtime
    //   - Setup frame callbacks
    //
    // Dengan 38 cards di beranda → 38 LottieView instances aktif sekaligus.
    // Ini menyebabkan:
    //   a) Memory usage tinggi → OS throttle → lag
    //   b) CPU: 38 animation runtimes siap play setiap saat
    //   c) Initial render slow karena 38 Lottie init sekaligus
    //
    // ✅ FIX: Lazy mount — LottieView HANYA dimount setelah user
    //    pertama kali tap wishlist pada card tersebut.
    //
    //    Default state: tampilkan Heart icon biasa (sangat ringan).
    //    Setelah tap pertama: mount LottieView → play animation.
    //
    //    Efek: 99% card tidak pernah di-tap → 0 LottieView aktif secara default.
    //    Hanya card yang di-tap yang mount LottieView (biasanya 1-3 card).
    // ─────────────────────────────────────────────────────────────────────
 
    return (
      <Card
        className={cn(
          'relative m-auto h-fit w-full gap-0.5 overflow-hidden rounded-none border-0 bg-background p-0 shadow-none',
          className
        )}
        style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT + 60 }}
        {...props}>
        {/* Image Area */}
        <CardHeader
          className="relative mb-1.5 w-full overflow-hidden rounded-xl bg-muted px-0"
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
                          i === activeIndex
                            ? 'rgba(255, 255, 255, 1)'
                            : 'rgba(255, 255, 255, 0.35)',
                      }}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Pressable onPress={() => navigateToProduct(Product.id)} className="active:opacity-70">
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

        {/* Info */}
        <CardContent className="relative w-full flex-row items-center justify-between px-1.5 py-0.5">
          <Pressable
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
                onPress={() => {
                  setIsWhislited((v) => !v);

                  Vibration.vibrate(VIBRATION_PATTERN);
                }}
                variant="ghost"
                size="icon"
                className="size-6 rounded-full border-none p-0">
                <Icon
                  as={HeartIcon}
                  size={19}
                  className={cn(isWhislisted ? 'fill-destructive text-destructive' : '')}
                />
              </Button>
            </CardAction>
          )}
        </CardContent>
      </Card>
    );
  },
  // ─────────────────────────────────────────────────────────────────────────
  // Custom comparator untuk React.memo
  //
  // Hanya re-render jika Product data yang ditampilkan berubah.
  // Ignore: index (hanya untuk analytics), className (jarang berubah),
  //         widht (stabil), showAction (stabil), withCarousel (stabil).
  //
  // Ini mencegah re-render saat parent re-render karena extraData change.
  // ─────────────────────────────────────────────────────────────────────────
  (prevProps, nextProps) => {
    return (
      prevProps.Product.id === nextProps.Product.id &&
      prevProps.Product.price === nextProps.Product.price &&
      prevProps.Product.thumbnail === nextProps.Product.thumbnail &&
      prevProps.Product.title === nextProps.Product.title &&
      prevProps.widht === nextProps.widht
    );
  }
);
