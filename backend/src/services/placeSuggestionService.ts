import pool from '../database/connection';
import geoapifyService from './geoapifyService';

export interface PlaceSuggestion {
  placeId: string;
  displayName: string;
  address: string;
  latitude: number;
  longitude: number;
  source: 'history' | 'geoapify';
}

const getRecentDestinations = async (userId: string, limit: number) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (destination_address) destination_address, destination_lat, destination_lng 
       FROM ride_searches 
       WHERE user_id = $1 AND destination_address IS NOT NULL 
       ORDER BY destination_address, created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return rows.map((r: any, i: number) => ({
      placeId: `history_${i}`,
      displayName: r.destination_address,
      address: r.destination_address,
      latitude: r.destination_lat,
      longitude: r.destination_lng,
      source: 'history' as const,
    }));
  } catch (error) {
    return [];
  }
};

export const searchPlaces = async (
  userId: string,
  input: string,
  lat?: number,
  lng?: number
): Promise<PlaceSuggestion[]> => {
  if (!input || input.trim().length < 2) return [];

  const historySuggestions = await getRecentDestinations(userId, 3);
  const filtered = historySuggestions.filter((h: any) =>
    h.displayName.toLowerCase().includes(input.toLowerCase())
  );

  const geoapifySuggestions: PlaceSuggestion[] = [];
  try {
    const results = await geoapifyService.autocomplete(input, lat, lng, 'pt', 5);
    geoapifySuggestions.push(
      ...results.map((result: any, i: number) => ({
        placeId: `geoapify_${result.place_id || i}`,
        displayName: result.address_line1 || result.formatted,
        address: result.formatted || result.address_line1,
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        source: 'geoapify' as const,
      }))
    );
  } catch (error) {
    // fallback: return only history
  }

  // priority: history first, then geoapify
  const combined = [...filtered, ...geoapifySuggestions];
  return combined.slice(0, 8); // limit total to 8 suggestions
};

export const getPlaceDetails = async (placeId: string): Promise<PlaceSuggestion | null> => {
  if (placeId.startsWith('history_')) {
    // For history suggestions, we already have all the details
    // This is mainly for consistency; ideally already cached on client.
    return null;
  }

  if (placeId.startsWith('geoapify_')) {
    // For Geoapify suggestions, we'd need to fetch from Geoapify again
    // For now, this is a placeholder as we cache on client
    return null;
  }

  return null;
};

export default { searchPlaces, getPlaceDetails };
