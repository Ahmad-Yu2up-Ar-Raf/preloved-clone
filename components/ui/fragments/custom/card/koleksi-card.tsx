// components/ui/fragments/custom/card/category-card.tsx - Updated with top products

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react';
import { cn } from '@/lib/utils';
import { Dimensions, Pressable, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from '../../shadcn-ui/icon';
import { ChevronRight } from 'lucide-react-native';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';

export interface Koleksi {
  name: string;
  image: string;
}

type KoleksiCardProps = {
  Koleksi: Koleksi;
  className?: string;
  width?: number;
  index?: number;
};

export function KoleksiCard({
  Koleksi,
  className,
  width = 2.5,
  index,
  ...props
}: KoleksiCardProps & ViewProps & React.RefAttributes<View>) {
  const screenWidth = Dimensions.get('window').width;
  const CARD_WIDTH = screenWidth / 1.8;

  return (
    <Card
      className={cn(
        'm-auto h-fit w-full content-start items-start justify-start overflow-hidden rounded-lg border-0 bg-background p-0 shadow-none active:scale-95 active:opacity-70',
        className
      )}
      style={{
        width: CARD_WIDTH,
        height: CARD_WIDTH * 0.5, // Adjust height as needed
      }}
      {...props}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: '/(tabs)/explore/products',
            params: { category: Koleksi.name },
          });
        }} className='  size-full'>
        <CardContent className="w-full overflow-hidden p-0">
          <ImageBackground
            source={{ uri: Koleksi.image }}
            contentFit="cover"
            className="relative z-30 h-full w-full items-start justify-end gap-1 overflow-hidden bg-muted"
            style={{ width: '100%', height: '100%' }}>
            {/* Gradient Overlay */}
            <LinearGradient
              colors={[
                'rgba(0,0,0,0)', // top fully transparent
                'rgba(0,0,0,0.2)', // middle slightly dark
                'rgba(0,0,0,0.8)', // bottom darker
              ]}
              locations={[0, 0.5, 1]}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
              }}
            />
            <View className="relative z-30 h-full w-full items-start justify-end gap-0.5 overflow-hidden rounded-xl p-2.5">
              <CardHeader className="w-full flex-row items-center gap-1 p-0">
                <CardTitle className="text-base font-semibold tracking-tight text-white">
                  {Koleksi.name}
                </CardTitle>
                <Icon as={ChevronRight} size={12} className="sr-only text-white" />
              </CardHeader>
            </View>
          </ImageBackground>
        </CardContent>
      </Pressable>
      {/* ✅ Top 3 Product Images Grid */}
    </Card>
  );
}
  