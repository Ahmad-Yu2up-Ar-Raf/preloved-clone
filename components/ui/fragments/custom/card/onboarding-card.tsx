// components/ui/fragments/custom/card/onboarding-card.tsx - Updated with top products

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react';
import { cn } from '@/lib/utils';
import { Dimensions, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Onboarding } from '@/type/onboarding-type';
import { Icon } from '../../shadcn-ui/icon';
import { ChevronRight } from 'lucide-react-native';
import { ImageBackground } from 'expo-image';

type OnboardingCardProps = {
  onboarding: Onboarding;
  className?: string;
  width?: number;
  index?: number;
};

export function OnboardingCard({
  onboarding,
  className,
  width = 2.5,
  index,
  ...props
}: OnboardingCardProps & ViewProps & React.RefAttributes<View>) {
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
        height: CARD_WIDTH * 0.6, // Adjust height as needed
      }}
      {...props}>
      <CardContent className="w-full overflow-hidden p-0">
        <ImageBackground
          source={{ uri: onboarding.image }}
          contentFit="cover"
          className="relative z-30 h-full w-full items-start justify-end gap-1 overflow-hidden bg-muted"
          style={{ width: '100%', height: '100%' }}>
          {/* Gradient Overlay */}
          <LinearGradient
            colors={[
              'rgba(0,0,0,0)', // top fully transparent
              'rgba(0,0,0,0.7)', // middle slightly dark
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
          <View className="relative z-30 h-full w-full items-start justify-end gap-0.5 overflow-hidden rounded-xl p-3">
            <CardHeader className="w-full flex-row items-center gap-1 p-0">
              <CardTitle className="text-xs font-semibold tracking-tight text-white">
                {onboarding.title}
              </CardTitle>
              <Icon as={ChevronRight} size={12} className="text-white" />
            </CardHeader>
            <CardDescription className="line-clamp-1 w-full text-xs text-muted/90 dark:text-muted-foreground">
              {onboarding.description}
            </CardDescription>
          </View>
        </ImageBackground>
      </CardContent>
      {/* ✅ Top 3 Product Images Grid */}
    </Card>
  );
}
