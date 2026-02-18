import ProfileBlock from '@/components/ui/core/block/profile-block';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Link, Stack } from 'expo-router';
import { StarIcon } from 'lucide-react-native';

import * as React from 'react';
import { View } from 'react-native';

export default function Screen() {
  return (
    <>
      <ProfileBlock />
    </>
  );
}
