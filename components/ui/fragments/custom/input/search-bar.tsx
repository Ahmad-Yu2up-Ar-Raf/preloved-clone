import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Input } from '../../shadcn-ui/input';
import { Icon } from '../../shadcn-ui/icon';
import { SearchIcon, XIcon } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { Button } from '../../shadcn-ui/button';

export default function SearchBar() {
  const [searchText, setSearchText] = React.useState('');
  return (
    <Pressable className="relative h-9 w-[87%] flex-row items-center gap-0 overflow-hidden rounded-2xl bg-muted px-2.5">
      <Icon as={SearchIcon} className="mr-2 size-5 text-muted-foreground/40" />
      <Input
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Click to search..."
        className="bg-transparen border-0 border-none px-1 font-Inter_Regular text-sm tracking-wide shadow-none outline-none placeholder:font-medium placeholder:text-muted-foreground/70"
      />

      <Button
        onPress={() => setSearchText('')}
        size="icon"
        variant="default"
        className={cn(
          'ios:size-9 absolute right-2 size-5 rounded-full bg-muted-foreground/40 p-1 transition-all duration-100 ease-out',
          searchText.length > 0 ? 'scale-100' : 'scale-0'
        )}>
        <Icon as={XIcon} className={cn('size-full text-background')} />
      </Button>
    </Pressable>
  );
}
