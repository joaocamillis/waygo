export interface PlaceSuggestion {
  placeId: string;
  displayName: string;
  address?: string;
  latitude: number;
  longitude: number;
  source: 'history' | 'geoapify' | string;
}

export interface RouteResult {
  distanceKm: number;
  durationMin: number;
  geometry?: Array<{ latitude: number; longitude: number }>;
}
