// app/(tabs)/_layout.tsx
import { Stack, Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // ✅ Import ini
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { CirclePlus, Home, Mail, Search, User, UserRound } from 'lucide-react-native';
import { HapticTab } from '@/components/haptic-tab';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const tintColor = THEME[currentTheme].primary;
  const backgroundColor = THEME[currentTheme].background;
  const inactiveTintColor = THEME[currentTheme].mutedForeground;

  const insets = useSafeAreaInsets(); // ✅ Dapetin safe area insets

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarButton: HapticTab,
          headerShown: false,
          tabBarActiveTintColor: tintColor,
          tabBarInactiveTintColor: inactiveTintColor,
          tabBarStyle: {
            backgroundColor,
            paddingBottom: insets.bottom, // ✅ CRITICAL: Apply bottom inset
            height: 53 + insets.bottom, // ✅ CRITICAL: Tinggi + bottom inset
            paddingTop: 2,
            borderTopWidth: 0.5,
            borderTopColor: THEME[currentTheme].border,
          },
          tabBarLabelStyle: {
            fontSize: 10.3,
            fontWeight: '600',
            marginTop: 1,
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
                size={22}
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
              <Ionicons name={focused ? 'search' : 'search-outline'} size={23} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="jual"
          options={{
            title: 'Jual',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? 'plus-circle' : 'plus-circle-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="inbox"
          options={{
            title: 'Inbox',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'mail' : 'mail-outline'} size={23} color={color} />
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
                size={24}
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
