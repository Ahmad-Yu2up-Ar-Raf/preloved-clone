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
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
