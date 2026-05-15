// Geocoding is now handled via PlaceAutocompleteInput and /places/autocomplete API
// This file is kept for potential future use or fallback

import { Location } from '../types/location';

export const geocode = async (address: string): Promise<Location | null> => {
  return null;
};

export default { geocode };
