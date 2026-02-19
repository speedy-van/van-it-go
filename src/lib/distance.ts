/**
 * Server-side distance/duration calculation via Mapbox Directions API.
 * Use this from API routes and server code instead of fetching /api/distance
 * to avoid relative URL issues and extra HTTP round-trips.
 */

/** Mapbox Directions API route geometry (GeoJSON LineString) */
export interface RouteGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface DistanceResult {
  distanceKm: number;
  durationMinutes: number;
  geometry?: RouteGeometry;
}

export async function getDistanceAndDuration(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Promise<DistanceResult> {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    console.warn('NEXT_PUBLIC_MAPBOX_TOKEN not set; distance estimation disabled');
    return { distanceKm: 0, durationMinutes: 0 };
  }

  const coordinates = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?access_token=${token}&steps=false&geometries=geojson&overview=simplified`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Mapbox API failed');
  }

  const data = (await response.json()) as {
    routes?: Array<{
      distance: number;
      duration: number;
      geometry?: RouteGeometry;
    }>;
  };

  if (!data.routes?.length) {
    throw new Error('No route found');
  }

  const route = data.routes[0];
  const distanceKm = route.distance / 1000;
  const durationMinutes = Math.ceil(route.duration / 60);

  return {
    distanceKm: Math.round(distanceKm * 100) / 100,
    durationMinutes,
    geometry: route.geometry,
  };
}
