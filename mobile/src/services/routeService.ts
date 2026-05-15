import { Location } from '../types/location';
import locationService from './locationService';

const toRad = (v: number) => (v * Math.PI) / 180;

const haversine = (from: Location, to: Location): { distanceKm: number; durationMin: number } => {
  const R = 6371; // km
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) * Math.cos(toRad(to.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;

  const averageSpeedKmh = 28;
  const durationHours = distanceKm / averageSpeedKmh;
  const durationMin = Math.max(1, Math.round(durationHours * 60));

  return { distanceKm: Number(distanceKm.toFixed(2)), durationMin };
};

export const getRoute = async (from: Location | null, to: Location | null) => {
  if (!from || !to) return null;

  // Try to get real route from Geoapify API via backend
  try {
    const result = await locationService.getRoute(from.latitude, from.longitude, to.latitude, to.longitude);
    if (result) return result;
  } catch (e) {
    // fallback to Haversine
  }

  // Fallback: use Haversine calculation
  return haversine(from, to);
};

export default { getRoute };
