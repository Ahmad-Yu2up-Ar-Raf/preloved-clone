'use client';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';

import { Heart, ShoppingCart, Star, Tag } from 'lucide-react-native';

import { Badge } from '../../shadcn-ui/badge';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/fragments/shadcn-ui/tooltip';

import React from 'react';

import { cn } from '@/lib/utils';

import { Dimensions, Pressable, View, ViewProps } from 'react-native';
import { Icon } from '../../shadcn-ui/icon';
import { ProductSchema } from '@/type/products';
import { Image } from '../../shadcn-ui/image';
import { Text } from '../../shadcn-ui/text';
import Svg, { Path } from 'react-native-svg';

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
  const [loading, setLoading] = React.useState(false);
  const Price = Product.price ? `$${Product.price.toFixed(2)}` : 'Free';

  const showcase_images = Product.image;

  const category = Product.category;
  const IconProduct = Tag;

  const width = Dimensions.get('window').width;

  const CARD_HEIGHT = width / 2.2;
  const is_whislisted = index !== undefined && index % 2 === 0;
  return (
    <Card
      className={cn(
        'm-auto h-full w-full max-w-sm gap-4 border-0 bg-background p-0 shadow-none dark:bg-background'
      )}
      {...props}>
      <CardContent
        className={cn(
          'group relative min-h-[16em] overflow-hidden rounded-xl bg-background px-0 md:min-h-[21em]',
          className
        )}>
        {/* <Badge
          variant="outline"
          className={cn(
            'absolute left-2.5 top-2.5 z-30 rounded-xl bg-primary/80 text-[9px] font-semibold capitalize text-primary-foreground md:text-xs'
          )}>
          <Icon as={IconProduct} className="mr-1.5 size-3 text-primary-foreground" />
          {category}
        </Badge> */}

        <CardAction className="absolute bottom-0 right-0 flex h-full flex-col justify-between pt-1.5 md:pt-0">
          <Tooltip>
            <TooltipTrigger>
              <Button
                size={'sm'}
                variant={'ghost'}
                className={cn(
                  'z-40 rounded-full px-0 hover:bg-destructive md:py-5',

                  is_whislisted
                    ? 'transition-all duration-300 ease-out hover:text-destructive [&_svg]:fill-destructive hover:[&_svg]:fill-none hover:[&_svg]:text-accent'
                    : ''
                )}>
                <Icon
                  as={Heart}
                  className={cn(
                    'border-white transition-all duration-300 ease-out',

                    is_whislisted ? 'size-6 text-destructive' : 'size-5 text-white'
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Text variant={'p'}>
                {is_whislisted ? 'Remove from Whistlist' : 'Add to whishlist'}
              </Text>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button className="relative z-40 size-11 rounded-full text-white lg:size-12">
                <Icon as={ShoppingCart} className="size-5.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Text variant={'p'}>Add to cart</Text>
            </TooltipContent>
          </Tooltip>
        </CardAction>
        <View className="size-14.5 absolute bottom-0 right-0 z-30 lg:size-16">
          <Svg   viewBox="0 0 62 62" className="relative z-20">
            <Path
              d="M 36 10 L 52 10 C 57.523 10 62 5.523 62 0 L 62 62 L 0 62 C 5.523 62 10 57.523 10 52 L 10 36 C 10 21.641 21.641 10 36 10 Z"
              fill="var(--background)"
            />
          </Svg>
        </View>

        <Pressable className="absolute h-full w-full cursor-zoom-in">
          <Image
            width={width - 32}
            height={CARD_HEIGHT}
            source={{
              uri: Product.image,
            }}
            className={cn(
              'h-full w-full rounded-xl object-cover object-center opacity-100 transition-all duration-300 ease-out',

              showcase_images && showcase_images.length > 0 && 'group-hover:opacity-0'
            )}
          />
        </Pressable>
        <Pressable className="absolute h-full w-full">
          {showcase_images && showcase_images.length > 0 && (
            <Image
              width={width - 32}
              height={CARD_HEIGHT}
              source={{
                uri: Product.image,
              }}
              className="h-full w-full rounded-xl object-cover object-center opacity-0 transition-all duration-300 ease-out group-hover:opacity-100"
            />
          )}
        </Pressable>
      </CardContent>
      <Pressable className="space-y-4 lg:space-y-4">
        <CardHeader className="bg-background py-0 pl-0 pr-2.5">
          <Tooltip>
            <TooltipTrigger className="w-fit">
              <Badge
                variant={'outline'}
                className="w-fit border-0 p-0 text-accent-foreground lg:text-sm">
                <Icon as={Star} className="size-4 fill-primary text-primary" />{' '}
                <Text variant={'small'} className="font-medium">
                  {Product.rating != null ? Math.round(Product.rating.rate * 10) / 10 : 0.0}
                </Text>
                <Text variant={'small'} className="">
                  ({Product.rating.count})
                </Text>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <Text variant={'p'}>Average Rating</Text>
            </TooltipContent>
          </Tooltip>
          <CardTitle className="line-clamp-2 font-medium leading-6 tracking-tight lg:text-lg">
            {Product.title}{' '}
          </CardTitle>
          {/* <CardDescription>
          Enter your email bel ow to login to your account
        </CardDescription> */}
        </CardHeader>

        <CardFooter className="bg-background p-0 text-left">
          <View className="flex flex-col">
            <Text variant={'h1'} className="text-left font-medium">
              {Price}
            </Text>
            <Text
              variant={'p'}
              className="line-clamp-1 text-xs text-accent-foreground/90 md:text-sm">
              {Product.rating?.count || 0} Sold{' '}
            </Text>
          </View>
          {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}
        </CardFooter>
      </Pressable>
    </Card>
  );
}
