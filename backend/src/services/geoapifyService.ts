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
    const distanceKm = (route.distance || 0) / 1000;
    const durationMin = Math.round((route.time || 0) / 60);
    const geometry = route.legs?.[0]?.steps?.map((s: any) => s.points || []).flat() || null;

    return { distanceKm: Number(distanceKm.toFixed(2)), durationMin, geometry };
  } catch (error: any) {
    throw new Error(`Geoapify routing failed: ${error.message}`);
  }
};

export default { autocomplete, reverseGeocode, routing };
