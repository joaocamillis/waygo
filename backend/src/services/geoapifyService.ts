import axios from 'axios';

const API_KEY = process.env.GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com';

const client = axios.create({ baseURL: BASE_URL });

export const autocomplete = async (input: string, lat?: number, lng?: number, lang = 'pt', limit = 5) => {
  if (!API_KEY) throw new Error('GEOAPIFY_API_KEY not set');

  const params: any = {
    text: input,
    apiKey: API_KEY,
    lang,
    limit,
    format: 'json',
    filter: 'countrycode:br',
  };

  if (lat !== undefined && lng !== undefined) {
    params.bias = `proximity:${lng},${lat}`;
  }

  try {
    const response = await client.get('/v1/geocode/autocomplete', { params });
    return response.data.results || [];
  } catch (error: any) {
    throw new Error(`Geoapify autocomplete failed: ${error.message}`);
  }
};

export const reverseGeocode = async (lat: number, lng: number) => {
  if (!API_KEY) throw new Error('GEOAPIFY_API_KEY not set');

  const params = {
    lat,
    lon: lng,
    apiKey: API_KEY,
    format: 'json',
  };

  try {
    const response = await client.get('/v1/geocode/reverse', { params });
    const results = response.data.results || [];
    if (results.length === 0) return null;
    const result = results[0];
    return {
      latitude: lat,
      longitude: lng,
      address: result.formatted || `${lat}, ${lng}`,
      displayName: result.address_line1 || result.formatted,
    };
  } catch (error: any) {
    throw new Error(`Geoapify reverse geocode failed: ${error.message}`);
  }
};

export const routing = async (originLat: number, originLng: number, destinationLat: number, destinationLng: number) => {
  if (!API_KEY) throw new Error('GEOAPIFY_API_KEY not set');

  const params = {
    apiKey: API_KEY,
    mode: 'drive',
    format: 'json',
  };

  const waypoints = `${originLat},${originLng}|${destinationLat},${destinationLng}`;

  try {
    const response = await client.get(`/v1/routing?waypoints=${waypoints}`, { params });
    const routes = response.data.routes || [];
    if (routes.length === 0) return null;

    const route = routes[0];
    const distanceKm = (Number(route.distance) || 0) / 1000;
    const durationMin = Math.round((Number(route.time) || 0) / 60);

    // Try multiple locations for geometry
    let coordinates: Array<{ latitude: number; longitude: number }> | null = null;

    // Geoapify may return geometry.coordinates as [lon, lat] pairs
    if (route.geometry && Array.isArray(route.geometry.coordinates)) {
      coordinates = route.geometry.coordinates.map((pt: any) => {
        const lon = Number(pt[0]);
        const lat = Number(pt[1]);
        return { latitude: lat, longitude: lon };
      });
    }

    // Fallback: legs -> steps -> geometry
    if (!coordinates && Array.isArray(route.legs)) {
      const pts: Array<{ latitude: number; longitude: number }> = [];
      for (const leg of route.legs) {
        if (Array.isArray(leg.steps)) {
          for (const step of leg.steps) {
            if (step.geometry && Array.isArray(step.geometry.coordinates)) {
              for (const c of step.geometry.coordinates) {
                const lon = Number(c[0]);
                const lat = Number(c[1]);
                pts.push({ latitude: lat, longitude: lon });
              }
            }
          }
        }
      }
      if (pts.length > 0) coordinates = pts;
    }

    // Ensure coordinates are numbers
    if (coordinates) {
      coordinates = coordinates.filter(c => Number.isFinite(c.latitude) && Number.isFinite(c.longitude));
    }

    return { distanceKm: Number(distanceKm.toFixed(2)), durationMin, coordinates };
  } catch (error: any) {
    throw new Error(`Geoapify routing failed: ${error.message}`);
  }
};

export default { autocomplete, reverseGeocode, routing };
