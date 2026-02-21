// components/ui/fragments/custom/card/seller-card.tsx
// ✅ FIXED: h-1/2 RN bug, explicit heights, URL sanitization

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/fragments/shadcn-ui/card';
import React from 'react';
import { cn } from '@/lib/utils';
import { Dimensions, View, ViewProps } from 'react-native';
import { Text } from '../../shadcn-ui/text';
import type { Seller } from '@/type/sellers-type';
import { batasiKata } from '@/hooks/useWord';
import { Icon } from '../../shadcn-ui/icon';
import { Star } from 'lucide-react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/fragments/shadcn-ui/avatar';
import { useInitials } from '@/hooks/use-initial';
import { Image } from '../../shadcn-ui/image';

// ─────────────────────────────────────────────────────────────
// ✅ Same sanitizer as image.tsx — clean Platzi bracket URLs
// ─────────────────────────────────────────────────────────────
function sanitizeUrl(raw: string | undefined): string {
  const FALLBACK = 'https://placehold.co/200x200/e5e7eb/9ca3af?text=No+Image';
  if (!raw || typeof raw !== 'string') return FALLBACK;

  let url = raw.trim();
  if (url.startsWith('[')) {
    try {
      const parsed = JSON.parse(url);
      url = Array.isArray(parsed) ? String(parsed[0]).trim() : FALLBACK;
    } catch {
      url = url.replace(/^\["|"\]$/g, '').trim();
    }
  }
  if (url.toLowerCase().includes('.svg')) return FALLBACK;
  if (!url.startsWith('http')) return FALLBACK;
  return url;
}

type SellerCardProps = {
  seller: Seller;
  className?: string;
  index?: number;
};

export function SellerCard({
  seller,
  className,
  index,
  ...props
}: SellerCardProps & ViewProps & React.RefAttributes<View>) {
  const screenWidth = Dimensions.get('window').width;
  const CARD_WIDTH = screenWidth / 1.8;

  // ✅ CRITICAL: Explicit heights in px — h-1/2 in RN requires parent to have
  // explicit numeric height, NOT 'h-full' from NativeWind which resolves to '100%'
  const HEADER_HEIGHT = 110; // px
  const LEFT_IMAGE_HEIGHT = (HEADER_HEIGHT - 4) / 2; // 4px gap
  const RIGHT_IMAGE_HEIGHT = HEADER_HEIGHT;

  // ✅ Clean & validate top product images
  const topImages = React.useMemo(() => {
    const raw = seller.topProductImages ?? [];
    return [0, 1, 2].map((i) => sanitizeUrl(raw[i]));
  }, [seller.topProductImages]);

  const fullName = batasiKata(seller.name, 2);
  const initials = useInitials();
  const avatarFallback = initials(seller.name);
  const cleanAvatar = sanitizeUrl(seller.avatar);

  const renderStars = () => {
    const fullStars = Math.floor(seller.rating ?? 0);
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        as={Star}
        size={10}
        className={cn(i < fullStars ? 'fill-blue-700 text-blue-700' : 'fill-muted text-muted')}
      />
    ));
  };

  return (
    <Card
      className={cn(
        'm-auto h-fit w-full overflow-hidden border-0 bg-background p-0 shadow-none active:opacity-70',
        className
      )}
      style={{ width: CARD_WIDTH }}
      {...props}>
      {/* ─── Top 3 Product Images Grid ──────────────────────── */}
      {/* ✅ FIXED: Use explicit px height, NOT h-full / h-1/2  */}
      <CardHeader className="mb-1.5 overflow-hidden rounded-xl bg-muted p-0">
        <View style={{ height: HEADER_HEIGHT, flexDirection: 'row', gap: 2 }}>
          {/* Left column: 2 stacked images */}
          <View style={{ flex: 1, gap: 2 }}>
            {/* Image 1 */}
            <View style={{ height: LEFT_IMAGE_HEIGHT, overflow: 'hidden' }}>
              <Image source={{ uri: topImages[0] }} contentFit="cover" className="h-full w-full" />
            </View>
            {/* Image 2 */}
            <View style={{ height: LEFT_IMAGE_HEIGHT, overflow: 'hidden' }}>
              <Image source={{ uri: topImages[1] }} contentFit="cover" className="h-full w-full" />
            </View>
          </View>

          {/* Right column: 1 tall image */}
          {/* ✅ FIXED: explicit height = full header height */}
          <View style={{ flex: 1, height: RIGHT_IMAGE_HEIGHT, overflow: 'hidden' }}>
            <Image source={{ uri: topImages[2] }} contentFit="cover" className="h-full w-full" />
          </View>
        </View>
      </CardHeader>

      {/* ─── Seller Info ─────────────────────────────────────── */}
      {/* ✅ Use marginTop to compensate avatar overlap, not absolute position + translate */}
      <CardContent className="w-full items-center gap-1 py-0">
        <View style={{ marginTop: -60, alignItems: 'center', width: '100%' }} className="gap-1.5">
          {/* Avatar */}
          <Avatar
            className="mb-1 size-12 overflow-hidden rounded-full border-2 border-background bg-background"
            alt={`${seller.name} avatar`}>
            <AvatarImage source={{ uri: cleanAvatar }} className="h-full w-full" />
            <AvatarFallback>
              <Text className="text-xs font-semibold">{avatarFallback}</Text>
            </AvatarFallback>
          </Avatar>

          {/* Name */}
          <CardTitle className="line-clamp-1 text-center text-xs font-medium tracking-tight">
            {fullName}
          </CardTitle>

          {/* Stars */}
          <View className="mt-0.5 flex-row items-center justify-center gap-0.5">
            {renderStars()}
            <Text className="sr-only ml-1 text-[10px] text-muted-foreground">
              {(seller.rating ?? 0).toFixed(1)}
            </Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
