import Provider from '@/components/provider/provider';
import '@/global.css';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';
import * as React from 'react';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
export default function RootLayout() {
  // This is the default configuration
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });
  return (
    <Provider>
      <Routes />
    </Provider>
  );
}

// ✅ Splash Screen Configuration
SplashScreen.preventAutoHideAsync();
function Routes() {
  // Use `useFonts` only if you can't use the config plugin.
  const [loaded, error] = useFonts({
    Termina_Semibold: require('@/assets/fonts/termina/TerminaTest-Semibold.otf'),
    Termina_Medium: require('@/assets/fonts/termina/TerminaTest-Medium.otf'),
    Termina_Regular: require('@/assets/fonts/termina/TerminaTest-Regular.otf'),
    Termina_Light: require('@/assets/fonts/termina/TerminaTest-Light.otf'),
    Termina_Bold: require('@/assets/fonts/termina/TerminaTest-Bold.otf'),
    Termina_ExtraBold: require('@/assets/fonts/termina/TerminaTest-ExtraBold.otf'),
    Termina_ExtraLight: require('@/assets/fonts/termina/TerminaTest-ExtraLight.otf'),
    Termina_Thin: require('@/assets/fonts/termina/TerminaTest-Thin.otf'),
    Termina_Black: require('@/assets/fonts/termina/TerminaTest-Black.otf'),
    Termina_ExtraBlack: require('@/assets/fonts/termina/TerminaTest-ExtraBold.otf'),
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product" options={{ headerShown: false }} />
      <Stack.Screen name="keranjang" options={SCREEN_OPTIONS} />
    </Stack>
  );
}

import { ChevronLeft, Handbag, ShoppingBag } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/fragments/custom/typography/header';

const SCREEN_OPTIONS = {
  headerTransparent: true,
  header: () => (
    <View
      className="safe-area-inset-top left-0 right-0 top-5 h-fit flex-row items-center justify-start bg-background px-3.5 pb-2 web:mx-2"
      style={{ paddingTop: useSafeAreaInsets().top - 20 }}>
      <Goback />
      <Header title="Keranjang" className="m-0 w-full p-0 text-center" />
    </View>
  ),
};

function Goback() {
  return (
    <Button
      onPressIn={() => router.push('/(tabs)/explore')}
      size="icon"
      variant="ghost"
      className="ios:size-9 flex-1 rounded-full web:mx-4">
      <Icon as={ChevronLeft} size={30} className="mix-blend-difference" />
    </Button>
  );
}
