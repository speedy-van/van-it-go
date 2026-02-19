import mapboxgl from 'mapbox-gl';

export function initializeMapbox() {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
}

export async function geocodeAddress(address: string) {
  const response = await fetch('/api/geocode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) throw new Error('Geocoding failed');
  return response.json();
}

export async function getDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  const response = await fetch('/api/distance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to }),
  });

  if (!response.ok) throw new Error('Distance calculation failed');
  return response.json();
}
