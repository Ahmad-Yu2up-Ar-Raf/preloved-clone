import React from 'react';
import { Wrapper } from '@/components/provider/wrapper';
import { Dimensions, View } from 'react-native';

import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Image } from '@/components/ui/fragments/shadcn-ui/image';
import Animated, { FadeInDown } from 'react-native-reanimated';
export default function InboxEmptyBlock() {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
  const CARD_WIDTH = SCREEN_WIDTH * 0.3; // 15 padding horizontal di kiri dan kanan,
  return (
    <Wrapper edges={['top']} className="h-full content-center items-center justify-center">
      <View className="flex-col content-center items-center justify-between">
        <Animated.View entering={FadeInDown.duration(500)}>
          <Image
            width={CARD_WIDTH}
            height={CARD_WIDTH}
            className="m-auto w-fit"
            source={require('@/assets/images/3d/inbox.png')}
          />
        </Animated.View>
        <Text variant="p" className="m-auto mt-2 text-center text-base text-muted-foreground">
          Belum ada message
        </Text>
      </View>
    </Wrapper>
  );
}
