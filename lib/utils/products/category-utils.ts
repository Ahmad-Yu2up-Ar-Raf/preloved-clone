import { Category } from '@/type/products';
import { CheckCircle2, CircleIcon, CircleX, Clock } from 'lucide-react';
import { LucideIcon } from 'lucide-react-native';

// 🧩 Return icon based on product Kategori
export function getProductKategoriIcon(Kategori?: Category): LucideIcon {
  const found = ProductKategoriOptions.find((s) => s.value === Kategori);
  return found?.icon || CircleIcon;
}

export function getProductKategoriColor(Kategori: Category): string {
  const KategoriColors: Record<Category, string> = {
    [Category.Available]: 'text-yellow-500',
    [Category.Not_Available]: 'text-red-500',
    [Category.Coming_Soon]: 'text-yellow-500',
  };

  return KategoriColors[Kategori] || 'text-gray-400';
}

// 🏷️ Optional: human-readable label mapping
export function getProductKategoriLabel(Kategori: Category): string {
  const KategoriLabels: Record<Category, string> = {
    [Category.Available]: 'Available',
    [Category.Not_Available]: 'Not Available',
    [ProductKategori.Coming_Soon]: 'Coming Soon',
  };

  return KategoriLabels[Kategori] || 'Unknown';
}
