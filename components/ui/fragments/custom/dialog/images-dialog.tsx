// components/ui/fragments/custom/dialog/images-dialog.tsx
// ✅ FIXES:
// 1. defaultIndex — carousel mulai dari index yang di-click user
// 2. Close on overlay click — pakai Pressable fullscreen overlay sendiri
// 3. Caption "X dari Y total" di atas
// 4. Fade in/out transition via Reanimated FadeIn/FadeOut
// 5. Hapus ketergantungan pada Dialog component (Dialog primitive bermasalah dengan FullWindowOverlay iOS)

import { Dimensions, Pressable, StatusBar, View } from 'react-native';
import { Text } from '../../shadcn-ui/text';
import { Image } from '../../shadcn-ui/image';
import React from 'react';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import Animated, { FadeIn, FadeOut, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { Platform } from 'react-native';
import { Button } from '../../shadcn-ui/button';
import { X } from 'lucide-react-native';

type ImagesPreviewProps = {
  images: string[];
  // ✅ curentIndex: index gambar yang di-click dari ProductGallery
  curentIndex: number;
  setShowPreview: React.Dispatch<React.SetStateAction<number | null>>;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ✅ Wrapper: FullWindowOverlay di iOS agar tampil di atas semua (termasuk navigation bar)
// Di Android cukup React.Fragment
const OverlayWrapper = Platform.OS === 'ios' ? FullWindowOverlay : React.Fragment;

export function ImagesPreview({ images, curentIndex, setShowPreview }: ImagesPreviewProps) {
  const insets = useSafeAreaInsets();
  const CARD_WIDTH = SCREEN_WIDTH;
  const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.75;

  // ✅ activeIndex — track carousel position untuk caption
  const [activeIndex, setActiveIndex] = React.useState(curentIndex);

  // Carousel ref + progress untuk Pagination
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(curentIndex);

  const handleClose = () => setShowPreview(null);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <OverlayWrapper>
      {/*
       * ✅ FadeIn/FadeOut pada root view — animasi masuk/keluar dialog
       * Tidak pakai Dialog primitive — lebih simple dan tidak ada issue overlay iOS
       */}
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
          backgroundColor: 'rgba(0,0,0,0.92)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/*
         * ✅ Overlay pressable — klik di luar carousel = close
         * Dibuat fullscreen di belakang carousel
         */}
        <Pressable
          onPress={handleClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* ─── Caption: "X dari Y" ──────────────────────────────── */}
        <View
          style={{
            position: 'absolute',
            top: insets.top + 8,
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            zIndex: 10,
          }}>
          {/* ✅ Caption teks: "2 dari 5" */}
          <Text className="text-sm font-semibold text-white">
            {activeIndex + 1} dari {images.length}
          </Text>

          {/* Close button */}
          <Button
            onPress={handleClose}
            variant="ghost"
            size="icon"
            className="size-9 rounded-full bg-white/10 active:bg-white/20">
            <X size={20} color="#ffffff" />
          </Button>
        </View>

        {/*
         * ─── Carousel ──────────────────────────────────────────────
         * ✅ defaultIndex: mulai dari index yang di-click user
         * ✅ onSnapToItem: update caption saat geser
         */}
        <Carousel
          ref={ref}
          width={CARD_WIDTH}
          height={IMAGE_HEIGHT}
          loop={false}
          autoPlay={false}
          // ✅ KEY FIX: mulai dari index gambar yang diklik
          defaultIndex={curentIndex}
          onProgressChange={(_, absoluteProgress) => {
            progress.value = absoluteProgress;
          }}
          onSnapToItem={(index) => setActiveIndex(index)}
          data={images}
          renderItem={({ item, index }) => (
            /*
             * ✅ Pressable di setiap item — klik gambar sendiri TIDAK close
             * (stopPropagation — event tidak bubble ke overlay Pressable di belakang)
             */
            <Pressable
              onPress={(e) => e.stopPropagation()}
              key={`preview-img-${index}`}
              style={{
                width: CARD_WIDTH,
                height: IMAGE_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={{ uri: item }}
                contentFit="contain"
                showLoadingIndicator={true}
                showErrorFallback={false}
                width={CARD_WIDTH}
                height={IMAGE_HEIGHT}
              />
            </Pressable>
          )}
        />

        {/* ─── Dot Pagination ────────────────────────────────────── */}
        {images.length > 1 && (
          <Pagination.Basic
            progress={progress}
            data={images}
            dotStyle={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.4)',
            }}
            activeDotStyle={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,1)',
            }}
            containerStyle={{
              position: 'absolute',
              bottom: insets.bottom + 16,
              gap: 6,
            }}
            onPress={onPressPagination}
          />
        )}
      </Animated.View>
    </OverlayWrapper>
  );
}
