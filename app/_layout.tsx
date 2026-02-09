import Provider from '@/components/provider/provider';
import '@/global.css';

import { Stack } from 'expo-router';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  return (
    <Provider>
      <Stack>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </Provider>
  );
}
