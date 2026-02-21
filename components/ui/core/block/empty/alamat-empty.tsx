import React from 'react';
import { Wrapper } from '@/components/provider/wrapper';
import { Dimensions, View } from 'react-native';
import { Header } from '@/components/ui/fragments/custom/typography/header';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Image } from '@/components/ui/fragments/shadcn-ui/image';
import Animated, {
  AnimatedRef,
  AnimatedScrollViewProps,
  AnimatedStyle,
  FadeInDown,
} from 'react-native-reanimated';
export default function JualEmptyBlock() {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const CARD_WIDTH = SCREEN_WIDTH * 0.43; // 15 padding horizontal di kiri dan kanan, jadi total 30
  const IMAGE_HEIGHT = CARD_WIDTH * (4 / 3.3);
  return (
    <Wrapper
      edges={['top']}
      className="flex-col items-center justify-center gap-14 px-4 py-10 text-center">
      <View className="m-auto w-full text-center">
        <Header title="Tambah alamat" className="text-center text-2xl" />
        <Text variant="p" className="mt-1 text-center text-muted-foreground text-base">
          Masukan alamat pickup untuk estimasi ongkir dan penjeputan kurir
        </Text>
      </View>
      <Animated.View entering={FadeInDown.duration(500)}>
        <Image
          width={CARD_WIDTH}
          height={IMAGE_HEIGHT}
          className="m-auto w-fit"
          source={require('@/assets/images/3d/alamat.png')}
        />
      </Animated.View>
    </Wrapper>
  );
}
