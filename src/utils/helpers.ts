import { nanoid } from 'nanoid';

export function generateId(): string {
  return nanoid();
}

export function formatDistance(
  distanceKm: number
): string {
  return `${distanceKm.toFixed(1)} km`;
}

export function formatPrice(
  price: number,
  currency: string = 'GBP'
): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function calculateCO2(distanceKm: number): number {
  // Approximate CO2 emissions: 0.229 kg per km (medium van)
  return Math.round(distanceKm * 229);
}
