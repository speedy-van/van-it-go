/**
 * Server-side geocoding via Mapbox. Use from API routes only.
 */

const KM_TO_MILES = 0.621371;

export function kmToMiles(km: number): number {
  return Math.round(km * KM_TO_MILES * 100) / 100;
}

export async function geocodePostcode(
  postcode: string
): Promise<{ lat: number; lng: number; address?: string }> {
  const token =
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Mapbox token not configured');
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(postcode.trim())}.json?access_token=${token}&country=gb&limit=1`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Mapbox API failed');

  const data = (await res.json()) as {
    features?: Array<{
      place_name: string;
      geometry: { coordinates: [number, number] };
    }>;
  };

  if (!data.features?.length) {
    throw new Error(`Address not found: ${postcode}`);
  }

  const f = data.features[0];
  return {
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    address: f.place_name,
  };
}
