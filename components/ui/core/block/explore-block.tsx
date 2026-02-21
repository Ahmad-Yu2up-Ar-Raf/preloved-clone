import React from 'react';
import { Wrapper } from '@/components/provider/wrapper';

import MenuCard from '../../fragments/custom/card/menu-card';

import { Flame, Sparkles } from 'lucide-react-native';
import { MenuDetail } from '@/type';
import { categoriesQueryOptions } from '@/lib/server/products/products-queris-server';
import { useQuery } from '@tanstack/react-query';
import TrendingCarousel from '../../fragments/custom/carousel/trending-carousel';

import CategoryMenu from '../../fragments/custom/menu/categories-menu';
import BrandsCarousel from '../../fragments/custom/carousel/brands-carousel';
import { router } from 'expo-router';
import KoleksiCarousel from '../../fragments/custom/carousel/koleksi-carousel';
import { View } from 'react-native';

interface ExploreBlockProps {
  className?: string;
}
export default function ExploreBlock() {
  const menuDetails: MenuDetail[] = [
    {
      Label: 'Explore item terbaru',
      icon: Sparkles,
    },
    {
      Label: 'Lihat item populer',
      icon: Flame,
    },
  ];

  const categoryQuery = useQuery(categoriesQueryOptions());

  const handleRefresh = React.useCallback(() => {
    categoryQuery.refetch();
  }, [categoryQuery]);

  const isRefreshing =
    (categoryQuery.isFetching && !categoryQuery.isLoading) ||
    console.log('category', categoryQuery);
  const trendingCategories = categoryQuery.data?.categories;
  const Brans: string[] = [
    'Adidas',
    'Nike',
    'Puma',
    'Reebok',
    'Vans',
    'Converse',
    'New Balance',
    'Asics',
    'Under Armour',
    'Fila',
    'Brooks',
    'Mizuno',
    'Saucony',
    'Hoka One One',
    'Salomon',
    'Columbia',
    'The North Face',
    'Patagonia',
    'Arc’teryx',
    'Lululemon',
  ];
  return (
    <Wrapper edges={[]} className="gap-5 p-0 px-0 py-4 pb-7">
      <MenuCard
        hideLastSeparator={true}
        MenuList={menuDetails}
        className="border-b-0 p-0"
        buttonClassName="px-6 w-full py-4  "
      />
      <View className="gap-8">
        <TrendingCarousel
          title="Trending"
          isLoading={categoryQuery.isLoading}
          TrendingCategory={trendingCategories ?? []}
        />
        <CategoryMenu
          title="Kategori"
          Category={trendingCategories ?? []}
          isLoading={categoryQuery.isLoading}
        />
        <BrandsCarousel
          onSeeAllPress={() => router.push('/(tabs)/explore')}
          title="Brands for you"
          BrandsCategory={Brans}
          isLoading={categoryQuery.isLoading}
        />
        <KoleksiCarousel
          title="Koleksi"
          onSeeAllPress={() => router.push('/(tabs)/explore')}
          isLoading={categoryQuery.isLoading}
        />
      </View>
    </Wrapper>
  );
}
