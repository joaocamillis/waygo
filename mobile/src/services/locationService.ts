import * as Location from 'expo-location';
import { api } from './api';
import { Location as ILocation } from '../types/location';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (e) {
    return false;
  }
};

export const getCurrentLocation = async (): Promise<ILocation | null> => {
  try {
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
  } catch (e) {
    return null;
  }
};

export const getReverseGeocode = async (lat: number, lng: number): Promise<ILocation | null> => {
  try {
    const response = await api.get('/places/reverse', { params: { lat, lng } });
    const result = response.data.result;
    if (!result) return null;
    return {
      latitude: Number(result.latitude),
      longitude: Number(result.longitude),
      address: result.displayName || result.address,
    };
  } catch (e) {
    return null;
  }
};

export const getRoute = async (
  originLat: number,
  originLng: number,
  destinationLat: number,
  destinationLng: number
): Promise<{ distanceKm: number; durationMin: number; geometry?: any } | null> => {
  try {
    const response = await api.get('/routes/car', {
      params: { originLat, originLng, destinationLat, destinationLng },
    });
    const r = response.data.result;
    if (!r) return null;
    return {
      distanceKm: Number(r.distanceKm ?? r.distance ?? 0),
      durationMin: Number(r.durationMin ?? r.duration ?? 0),
      geometry: Array.isArray(r.coordinates) ? r.coordinates.map((p: any) => ({ latitude: Number(p.latitude), longitude: Number(p.longitude) })) : undefined,
    };
  } catch (e) {
    return null;
  }
};

export default { requestLocationPermission, getCurrentLocation, getReverseGeocode, getRoute };
