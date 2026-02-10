import React from 'react';
import { Handbag } from 'lucide-react-native';
import { Stack } from 'expo-router';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';

import SearchBar from '@/components/ui/fragments/custom/input/search-bar';
import { View } from 'react-native';

const SCREEN_OPTIONS = {
  header: () => (
    <View className="safe-area-inset-top left-0 right-0 top-5 h-fit flex-row items-center justify-between bg-background px-3.5 pb-2 pt-5 web:mx-2">
      <SearchBar />
      <Whishlist />
    </View>
  ),
};

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={SCREEN_OPTIONS} />
      {/* Tambahkan screen lain di sini jika ada nested routes */}
    </Stack>
  );
}

function Whishlist() {
  return (
    <Button
      // onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={Handbag} className="size-6" />
    </Button>
  );
}
