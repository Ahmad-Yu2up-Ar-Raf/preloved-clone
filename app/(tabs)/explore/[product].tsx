import { ProductSchema } from '@/type/products';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Product = () => {
  const params = useLocalSearchParams<{ product?: string }>();
  const product = params.product ? (JSON.parse(params.product) as ProductSchema) : undefined;
  return <View></View>;
};

export default Product;
