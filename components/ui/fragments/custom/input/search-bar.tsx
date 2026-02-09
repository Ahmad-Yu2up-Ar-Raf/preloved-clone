import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Input } from '../../shadcn-ui/input'
import { Icon } from '../../shadcn-ui/icon'
import { SearchIcon, XIcon } from 'lucide-react-native'
import { cn } from '@/lib/utils'
import { Button } from '../../shadcn-ui/button'

export default function SearchBar() {
    const [searchText, setSearchText] = React.useState('');
    return (
        <Pressable className='  w-[87%]  relative px-2.5 h-9  gap-0 rounded-xl bg-muted items-center flex-row'>
            
      <Icon as={SearchIcon} className="size-5 text-muted-foreground/40 mr-2" />
      <Input
                value={searchText}
                onChangeText={setSearchText}
   
    
   
                placeholder="Click to search..."
                className='  border-none border-0   placeholder:font-medium text-sm  font-Inter_Regular tracking-wide px-1 placeholder:text-muted-foreground/70 bg-transparen shadow-none outline-none'
            /> 
            {searchText.length > 0 &&
            <Button onPress={() => setSearchText('')} size="icon" variant="default" className="ios:size-9 rounded-full absolute bg-muted-foreground/40  size-5  p-1 right-2   ">
            
             <Icon as={XIcon} className={cn("  size-full       text-background  ")} />
            </Button>
            }
      </Pressable>
  )
}