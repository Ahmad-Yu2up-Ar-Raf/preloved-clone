import { cn } from '@/lib/utils';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Wrapper({
  children,

  className,
  edges = ['top', 'bottom'],
}: {
  children: React.ReactNode;
  className?: string;

  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  return (
    <SafeAreaView edges={edges} className=" ">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerClassName="   "
        showsVerticalScrollIndicator={false}>
        <View className={cn('flex h-full flex-1 flex-col gap-5', className)}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
