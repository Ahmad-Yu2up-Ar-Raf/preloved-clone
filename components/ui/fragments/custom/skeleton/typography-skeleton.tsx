// components/ui/fragments/custom/skeleton/typography-skeleton.tsx

import React from 'react';
import { Skeleton } from '@/components/ui/fragments/shadcn-ui/skeleton';
import { cn } from '@/lib/utils';
import type { ViewProps } from 'react-native';

type TypographySkeletonProps = {
  width?: number  ;
  height?: number;
  className?: string;
} & ViewProps;

export function TypographySkeleton({
  width = 120,
  height = 20,
  className,
  ...props
}: TypographySkeletonProps) {
  return <Skeleton className={cn('rounded', className)} style={{ width, height }}{...props} />;
}

/**
 * Preset variants for common typography skeletons
 */
export const TypographySkeletonVariants = {
  /**
   * Large header skeleton (h1/h2)
   */
  Header: ({ className }: { className?: string }) => (
    <TypographySkeleton width={150} height={18} className={cn('mb-2', className)} />
  ),

  /**
   * Medium title skeleton (h3/h4)
   */
  Title: ({ className }: { className?: string }) => (
    <TypographySkeleton width={120} height={18} className={cn('mb-1.5', className)} />
  ),

  /**
   * Small subtitle skeleton
   */
  Subtitle: ({ className }: { className?: string }) => (
    <TypographySkeleton width={100} height={14} className={className} />
  ),
};
