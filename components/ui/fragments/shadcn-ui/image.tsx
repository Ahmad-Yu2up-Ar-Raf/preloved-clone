import { Text } from './text';
import { View } from 'react-native';
import { cn } from '@/lib/utils';

import { Image as ExpoImage, ImageProps as ExpoImageProps, ImageSource } from 'expo-image';
import React, { forwardRef, useState } from 'react';
import { ActivityIndicator, DimensionValue } from 'react-native';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';

export interface ImageProps extends Omit<ExpoImageProps, 'style'> {
  variant?: 'rounded' | 'circle' | 'default';
  source: ImageSource;
  className?: string;
  containerClassName?: string;
  showLoadingIndicator?: boolean;
  showErrorFallback?: boolean;
  errorFallbackText?: string;
  loadingIndicatorSize?: 'small' | 'large';
  aspectRatio?: number;
  width?: DimensionValue;
  height?: DimensionValue;
}

export const Image = forwardRef<ExpoImage, ImageProps>(
  (
    {
      variant = 'rounded',
      source,
      className,
      containerClassName,
      showLoadingIndicator = true,
      showErrorFallback = true,
      errorFallbackText = 'Failed to load image',
      loadingIndicatorSize = 'small',
      aspectRatio,
      width,
      height,
      contentFit = 'cover',
      transition = 200,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const { colorScheme } = useColorScheme();
    const currentTheme = colorScheme ?? 'light';
    const primary = THEME[currentTheme].primary;

    // 🔥 DEV WARNING: Detect common mistakes
    React.useEffect(() => {
      if (__DEV__) {
        // Check if source is a string (common mistake)
        if (typeof source === 'string') {
          console.error(
            '❌ IMAGE ERROR: source prop cannot be a string path!\n' +
              `   You passed: "${source}"\n` +
              '   ✅ For local images, use: require("@/path/image.png")\n' +
              '   ✅ For remote images, use: { uri: "https://..." }'
          );
        }

        // Check if source has uri property with local path
        if (
          typeof source === 'object' &&
          'uri' in source &&
          typeof source.uri === 'string' &&
          !source.uri.startsWith('http://') &&
          !source.uri.startsWith('https://') &&
          !source.uri.startsWith('data:') &&
          !source.uri.startsWith('file://')
        ) {
          console.error(
            '❌ IMAGE ERROR: Invalid URI scheme!\n' +
              `   You passed: { uri: "${source.uri}" }\n` +
              '   ✅ For local images, remove { uri: } wrapper and use require():\n' +
              '      source={require("@/path/image.png")}\n' +
              '   ✅ For remote images, use full URL:\n' +
              '      source={{ uri: "https://example.com/image.png" }}'
          );
        }
      }
    }, [source]);

    const getVariantClasses = () => {
      switch (variant) {
        case 'circle':
          return 'rounded-full';
        case 'rounded':
          return 'rounded-lg';
        default:
          return '';
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleLoadEnd = () => {
      setIsLoading(false);
    };

    const handleError = (error: any) => {
      console.error('Image load error:', error);

      // 🔥 Enhanced error logging in development
      if (__DEV__) {
        if (error?.error?.includes('Expected URL scheme')) {
          console.error(
            '\n' +
              '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
              '❌ IMAGE LOAD ERROR: Invalid source format\n' +
              '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
              '\n' +
              "🔍 Problem: You're using a STRING PATH for local image\n" +
              '\n' +
              '✅ Solution for LOCAL images:\n' +
              '   const image = require("@/assets/photo.png");\n' +
              '   <Image source={image} />\n' +
              '\n' +
              '✅ Solution for REMOTE images:\n' +
              '   <Image source={{ uri: "https://example.com/photo.png" }} />\n' +
              '\n' +
              "❌ DON'T use string paths:\n" +
              '   const image = "@/assets/photo.png"; // ← WRONG!\n' +
              '   <Image source={{ uri: image }} />   // ← WRONG!\n' +
              '\n' +
              '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
          );
        }
      }

      setIsLoading(false);
      setHasError(true);
    };

    // Container style
    const containerStyle = {
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      ...(aspectRatio ? { aspectRatio } : {}),
    };

    // Image style - ExpoImage needs style prop for dimensions
    const imageStyle = {
      width: width || '100%',
      height: height || '100%',
      ...(aspectRatio && !height ? { aspectRatio } : {}),
    };

    return (
      <View
        className={cn(
          'relative flex justify-end overflow-hidden',
          getVariantClasses(),
          containerClassName
        )}
        style={containerStyle}>
        <ExpoImage
          ref={ref}
          source={source}
          style={imageStyle}
          className={cn(getVariantClasses(), className)}
          contentFit={contentFit}
          transition={transition}
          onLoadStart={handleLoadStart}
          onLoad={handleLoadEnd}
          onError={handleError}
          cachePolicy="memory-disk"
          {...props}
        />

        {/* Loading indicator */}
        {isLoading && showLoadingIndicator && !hasError && (
          <View className="absolute inset-0 items-center justify-center bg-card/50">
            <ActivityIndicator size={loadingIndicatorSize} color={primary} />
          </View>
        )}

        {/* Error fallback */}
        {hasError && showErrorFallback && (
          <View className="absolute inset-0 flex items-center justify-center bg-card p-2">
            <Text variant="small" className="text-center text-muted-foreground" numberOfLines={2}>
              {errorFallbackText}
            </Text>
            {__DEV__ && (
              <Text variant="small" className="mt-2 text-center text-xs text-destructive">
                Check console for details
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
);

Image.displayName = 'Image';
