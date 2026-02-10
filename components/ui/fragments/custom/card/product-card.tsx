'use client';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';

import React from 'react';

import { cn } from '@/lib/utils';

import { Dimensions, Pressable, View, ViewProps } from 'react-native';

import { ProductSchema } from '@/type/products';
import { Image } from '../../shadcn-ui/image';
import { Text } from '../../shadcn-ui/text';

import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Button } from '../../shadcn-ui/button';
import { Icon } from '../../shadcn-ui/icon';
import { Heart } from 'lucide-react-native';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { batasiKata } from '@/hooks/useWord';
type ProductProps = {
  Product: ProductSchema;
  className?: string;

  index?: number;
};

export function ProductCard({
  Product,
  className,
  index,

  ...props
}: ProductProps & ViewProps & React.RefAttributes<View>) {
  const Price = Product.price ? `$${Product.price.toFixed(2)}` : 'Free';
  const images = [Product.image, Product.image, Product.image, Product.image, Product.image];
  const width = Dimensions.get('window').width;
  const CARD_WIDTH = width / 2.3;
  const scrollOffsetValue = useSharedValue<number>(0);
  const [isWhislisted, setIsWhislited] = React.useState(false);
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].background;
  const title = batasiKata(Product.title, 2);
  const inactiveTintColor = THEME[currentTheme].mutedForeground;
  return (
    <Card
      className={cn(
        'm-auto h-fit w-full gap-0.5 overflow-hidden rounded-none border-0 bg-background p-0 shadow-none'
      )}
      style={{ width: CARD_WIDTH }}
      {...props}>
      <CardHeader
        className={cn(
          'group relative mb-1.5 aspect-[3/4] h-fit w-full overflow-hidden rounded-sm bg-muted px-0',
          className
        )}>
        <Carousel
          ref={ref}
          width={CARD_WIDTH}
          style={{ width }}
          loop={false}
          autoPlay
          autoPlayInterval={2900}
          scrollAnimationDuration={800}
          data={images}
          renderItem={({ item }) => (
            <Image
              source={{
                uri: item,
              }}
              contentFit="contain"
              className="h-full w-full"
            />
          )}
        />
        <Pagination.Basic
          size={5}
          progress={progress}
          data={images}
          activeDotStyle={{
            overflow: 'hidden',
            backgroundColor: tintColor,
          }}
          dotStyle={{ backgroundColor: inactiveTintColor, borderRadius: 20 }}
          containerStyle={{
            gap: 5,

            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
          }}
          onPress={onPressPagination}
        />
      </CardHeader>
      <CardContent className="w-full flex-row items-center justify-between px-1.5 py-0">
        <View className="gap-[0.5px]">
          <CardTitle className="text-xs font-semibold tracking-tight text-primary">
            {Price}
          </CardTitle>
          <CardDescription className="line-clamp-1 text-xs font-normal text-muted-foreground/90">
            {title}
          </CardDescription>
          <Text className="line-clamp-1 text-xs font-normal text-muted-foreground/90">M</Text>
        </View>
        <CardAction>
          <Button
            onPress={() => setIsWhislited(!isWhislisted)}
            variant={'outline'}
            size={'icon'}
            className={cn(
              'active:scale-80 h-fit w-fit rounded-sm border-0 border-none transition-all duration-300 ease-out'
            )}>
            <Icon
              as={Heart}
              size={17}
              className={cn(isWhislisted ? 'fill-destructive text-destructive' : '')}
            />
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
}

// <Pressable className="space-y-4 lg:space-y-4">

// </Pressable>
