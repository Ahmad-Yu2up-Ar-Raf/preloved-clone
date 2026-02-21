import React from 'react';
import { Wrapper } from '@/components/provider/wrapper';
import { Dimensions, View } from 'react-native';

import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Image } from '@/components/ui/fragments/shadcn-ui/image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { ArrowRight } from 'lucide-react-native';
export default function InboxEmptyBlock() {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
  const CARD_WIDTH = SCREEN_WIDTH * 0.4; // 15 padding horizontal di kiri dan kanan,
  return (
    <Wrapper edges={['top']} className="h-full content-center items-center justify-center">
      <View className="flex-col content-center items-center justify-between">
        <Animated.View entering={FadeInDown.duration(500)}>
          <Image
            width={CARD_WIDTH}
            height={CARD_WIDTH}
            className="m-auto w-fit"
            source={require('@/assets/images/3d/keranjang.png')}
          />
        </Animated.View>
        <Text variant="p" className="m-auto my-2 mb-6 text-center text-base text-muted-foreground">
          Keranjang belanjamu kosong nih
        </Text>
        <Button size={'lg'} className="gap-1">
          <Text className="font-Termina_Bold text-sm">Mulai Belanja</Text>
          <Icon as={ArrowRight} size={20} className="text-primary-foreground" />
        </Button>
      </View>
    </Wrapper>
  );
}
