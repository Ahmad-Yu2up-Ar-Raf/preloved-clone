// app/(tabs)/_layout.tsx
import { router, Stack, Tabs, usePathname } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ✅ Import ini
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { CirclePlus, Home, Mail, Search, User, UserRound } from 'lucide-react-native';

import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Vibration } from 'react-native';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primary;
  const backgroundColor = THEME[currentTheme].background;
  const inactiveTintColor = THEME[currentTheme].mutedForeground;
  const foreground = THEME[currentTheme].foreground;

  const insets = useSafeAreaInsets(); // ✅ Dapetin safe area insets
  const ONE_SECOND_IN_MS = 30;
  const pathname = usePathname();
  const PATTERN = [1 * ONE_SECOND_IN_MS, 2 * ONE_SECOND_IN_MS, 3 * ONE_SECOND_IN_MS];
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarButton: ({ children, onPress, tabIndex }) => (
            <Button
              variant={'ghost'}
              onPressIn={(ev) => {
                Vibration.vibrate(PATTERN);
                if (process.env.EXPO_OS === 'ios') {
                  // Add a soft haptic feedback when pressing down on the tabs.
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onPress?.(ev);
              }}
              style={{ justifyContent: 'center', alignItems: 'center' }}
              android_ripple={{
                radius: 100,

                foreground: true,
              }}
              className={cn(
                'h-full w-full flex-col content-center items-center justify-center gap-0 overflow-hidden rounded-lg p-0 font-Termina_Medium'
              )}>
              {children}
            </Button>
          ),
          headerShown: false,
          tabBarActiveTintColor: tintColor,

          tabBarInactiveTintColor: inactiveTintColor,
          tabBarStyle: {
            display: pathname === '/jual' ? 'none' : 'flex',
            backgroundColor,
            overflow: 'hidden',
            height: 50 + insets.bottom, // ✅ CRITICAL: Tinggi + bottom inset
            paddingTop: 0,
            borderTopWidth: 0.5,
            borderTopColor: THEME[currentTheme].border,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 0,
          },
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Icon
                as={Home}
                fill={focused ? tintColor : backgroundColor}
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'search' : 'search-outline'} size={21} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="jual"
          options={{
            headerShown: false,
            title: 'Jual',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'plus-circle' : 'plus-circle-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            headerShown: false,
            title: 'Inbox',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'mail' : 'mail-outline'} size={21} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'account' : 'account-outline'}
                size={20}
                color={color}
              />
            ),
          }}
        />
        {/* Tab lainnya... */}
      </Tabs>
    </>
  );
}
