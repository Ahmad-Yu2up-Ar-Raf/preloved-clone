import JualEmptyBlock from '@/components/ui/core/block/empty/alamat-empty';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <JualEmptyBlock />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 12,
          paddingTop: 12,
          paddingHorizontal: 15,

          flexDirection: 'column',
          gap: 12,
          zIndex: 100,
        }}>
        <Button variant="default" className="rounded-xl">
          <Text className="font-Termina_Bold text-base">Tambah alamat</Text>
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            router.back();
          }}
          className="rounded-xl">
          <Text className="font-Termina_Bold text-base">Nanti saja</Text>
        </Button>
      </View>
    </>
  );
}
