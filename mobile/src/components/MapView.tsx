import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import MapViewLibrary from 'react-native-maps';
import { Marker, Polyline } from 'react-native-maps';
import { Location } from '../types/location';

type Props = {
  origin: Location | null;
  destination: Location | null;
  geometry?: Array<{ latitude: number; longitude: number }>;
};

export default function MapView({ origin, destination, geometry }: Props) {
  const region = useMemo(() => {
    if (!origin && !destination) return null;
    if (origin && !destination) {
      return {
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    if (!origin && destination) {
      return {
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    // Both set: calculate center and zoom
    const minLat = Math.min(origin!.latitude, destination!.latitude);
    const maxLat = Math.max(origin!.latitude, destination!.latitude);
    const minLng = Math.min(origin!.longitude, destination!.longitude);
    const maxLng = Math.max(origin!.longitude, destination!.longitude);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) * 1.5,
      longitudeDelta: (maxLng - minLng) * 1.5,
    };
  }, [origin, destination]);

  if (!region) return null;

  const routeCoordinates = useMemo(() => {
    if (!geometry || geometry.length === 0) {
      if (origin && destination) {
        return [
          { latitude: origin.latitude, longitude: origin.longitude },
          { latitude: destination.latitude, longitude: destination.longitude },
        ];
      }
      return [];
    }
    return geometry;
  }, [geometry, origin, destination]);

  return (
    <MapViewLibrary style={styles.map} region={region} scrollEnabled={true}>
      {origin && (
        <Marker
          coordinate={{ latitude: origin.latitude, longitude: origin.longitude }}
          title="Origem"
          pinColor="#00b894"
        />
      )}
      {destination && (
        <Marker
          coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
          title="Destino"
          pinColor="#ff5a5f"
        />
      )}
      {routeCoordinates.length > 1 && (
        <Polyline coordinates={routeCoordinates} strokeColor="#007bff" strokeWidth={3} />
      )}
    </MapViewLibrary>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
