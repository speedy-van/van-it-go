/**
 * UK Removal Items dataset - types and data loading
 */

export interface RemovalItem {
  id: string;
  name: string;
  category: string;
  categoryDisplay: string;
  dimensions: { lengthCm: number; widthCm: number; heightCm: number };
  areaM2: number;
  weightKg: number;
  volumeM3: number;
  vanUnits: number;
  workers: number;
  loadingComplexity: string;
  specialHandling: string;
  filename: string;
  imageUrl: string | null;
}

export interface RemovalCategory {
  id: string;
  displayName: string;
  itemCount: number;
  items: RemovalItem[];
}

export interface RemovalItemsData {
  version: string;
  generatedAt: string;
  totalItems: number;
  categories: RemovalCategory[];
}

export interface SelectedRemovalItem {
  item: RemovalItem;
  quantity: number;
}

export function getSelectedVolumeM3(selected: SelectedRemovalItem[]): number {
  return selected.reduce((sum, s) => sum + s.item.volumeM3 * s.quantity, 0);
}

export function getSelectedItemCount(selected: SelectedRemovalItem[]): number {
  return selected.reduce((sum, s) => sum + s.quantity, 0);
}
