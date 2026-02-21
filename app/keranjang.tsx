import KeranjangEmptyBlock from '@/components/ui/core/block/empty/keranjang-empty';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <KeranjangEmptyBlock />
    </>
  );
}



