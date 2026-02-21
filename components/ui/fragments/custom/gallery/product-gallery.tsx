// components/ui/fragments/custom/gallery/product-gallery.tsx
// ✅ FIXED: AnimatedStyle<ViewStyle> — spesifik ViewStyle, bukan generic AnimatedStyle

import {
  View,
  NativeSyntheticEvent,
  ScrollView,
  Pressable,
  NativeScrollEvent,
  ViewStyle,
  Vibration,
} from 'react-native';
import React from 'react';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Image } from '../../shadcn-ui/image';
import { Button } from '../../shadcn-ui/button';
import { Icon } from '../../shadcn-ui/icon';
import { Heart, Share2 } from 'lucide-react-native';
import { Text } from '../../shadcn-ui/text';
import { useShare } from '../../shadcn-ui/share';
import LottieView from 'lottie-react-native';
import { cn } from '@/lib/utils';

type ProductGalleryProps = {
  images: string[];
  CARD_WIDTH: number;
  IMAGE_HEIGHT: number;
  setShowPreview: React.Dispatch<React.SetStateAction<number | null>>;
  // ✅ FIX: AnimatedStyle<ViewStyle> — bukan plain AnimatedStyle
  // AnimatedStyle tanpa generic = DefaultStyle (ViewStyle | TextStyle | ImageStyle)
  // Animated.View hanya terima ViewStyle → harus dispesifikkan
  imageAnimationStyle: AnimatedStyle<ViewStyle>;
};

export default function ProductGallery({
  images,
  setShowPreview,
  CARD_WIDTH,
  IMAGE_HEIGHT,
  imageAnimationStyle,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { shareContent } = useShare();
  const [totalLikes, setTotalLikes] = React.useState(12);
  const handleScroll = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
      if (idx !== activeIndex) setActiveIndex(idx);
    },
    [CARD_WIDTH, activeIndex]
  );

  const handleShare = async () => {
    try {
      await shareContent({
        message: 'Check out this product!',
        title: 'Share Product',
      });
    } catch (_) {}
  };
  const ONE_SECOND_IN_MS = 30;
  const PATTERN = [1 * ONE_SECOND_IN_MS, 2 * ONE_SECOND_IN_MS, 3 * ONE_SECOND_IN_MS];
  const animation = React.useRef<LottieView>(null);
  const isFirstRun = React.useRef(true);
  const [isWhislisted, setIsWhislited] = React.useState(false);

  React.useEffect(() => {
    if (isFirstRun.current) {
      if (isWhislisted) {
        animation.current?.play(0, 600);
      } else {
        animation.current?.play(0, 600);
      }
      isFirstRun.current = false;
    } else if (isWhislisted) {
      animation.current?.play(0, 600);
    } else {
      animation.current?.play(0, 600);
    }
  }, [isWhislisted]);

  const handleWhistlist = () => {
    setIsWhislited((v) => !v);
    if (isWhislisted) {
      setTotalLikes((v) => v - 1);
    } else {
      setTotalLikes((v) => v + 1);
    }
    Vibration.vibrate(PATTERN);
  };

  return (
    <>
      <Animated.View style={[{ width: CARD_WIDTH, height: IMAGE_HEIGHT }, imageAnimationStyle]}>
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
              onPress={() => setShowPreview(i)}
              key={`img-${i}`}
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

        {/* Dot Indicators */}
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

        {/* Action Buttons */}
        <View className="absolute bottom-4 right-4 z-50 gap-3">
          <Button
            variant="secondary"
            className="rounded-full border-2 border-white/95 bg-white/80 p-4 active:bg-white/70"
            size="icon"
            onPress={handleShare}>
            <Icon as={Share2} size={20} className="text-black" />
          </Button>
          <Button
            onPress={handleWhistlist}
            variant="secondary"
            className="h-fit w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-full border-2 border-white/95 bg-white/80 py-2.5 active:bg-white/70"
            size="icon">
            <Icon
              as={Heart}
              size={20}
              className={cn('text-black', isWhislisted ? 'fill-destructive text-destructive' : '')}
            />
            <Text variant="small" className="text-xs text-black">
              {totalLikes}
            </Text>
          </Button>
        </View>
        {isWhislisted && (
          <LottieView
            ref={animation}
            style={{
              width: 300,
              height: 300,
            }}
            containerStyle={{
              position: 'absolute',
              top: '50%',
              bottom: '50%',
              left: '50%',
              right: '50%',
              transform: [{ translateX: -150 }, { translateY: -150 }],

              flexDirection: 'row',
              cursor: 'pointer',
              pointerEvents: 'box-none',
              zIndex: 40,
            }}
            source={require('@/assets/animations/Heart Animations Detail.json')}
            autoPlay={false}
            loop={false}
          />
        )}
      </Animated.View>
    </>
  );
}
