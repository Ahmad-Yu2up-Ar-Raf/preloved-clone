import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const ONE_SECOND_IN_MS = 40;

  const PATTERN = [1 * ONE_SECOND_IN_MS, 2 * ONE_SECOND_IN_MS, 3 * ONE_SECOND_IN_MS];
  return (
    
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        Vibration.vibrate(PATTERN);
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
