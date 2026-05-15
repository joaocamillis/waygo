import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PlaceAutocompleteInput from '../components/PlaceAutocompleteInput';
import { PlaceSuggestion } from '../types/place';
import { isValidLocation } from '../utils/locationUtils';
import MapView from '../components/MapView';
import { Location } from '../types/location';
import locationService from '../services/locationService';
import routeService from '../services/routeService';
import { createSearch } from '../services/rideService';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [origin, setOrigin] = useState<Location | null>(null);
  const [originText, setOriginText] = useState('');
  const [destination, setDestination] = useState<Location | null>(null);
  const [destinationText, setDestinationText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [geometry, setGeometry] = useState<Array<{ latitude: number; longitude: number }> | undefined>();
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  const initializeLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const granted = await locationService.requestLocationPermission();
      if (!granted) {
        Alert.alert('Permissão necessária', 'Permissão de localização é necessária para usar o app.');
        return;
      }

      const currentLoc = await locationService.getCurrentLocation();
      if (!currentLoc) {
        Alert.alert('Erro', 'Não foi possível obter sua localização.');
        return;
      }

      const reversed = await locationService.getReverseGeocode(currentLoc.latitude, currentLoc.longitude);
      if (reversed) {
        setOrigin(reversed);
        setOriginText(reversed.address || 'Localização atual');
      } else {
        setOrigin(currentLoc);
        setOriginText('Localização atual');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao obter localização.');
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      initializeLocation();
    }, [initializeLocation])
  );

  const handleCompare = async () => {
    if (!origin || !destination) {
      Alert.alert('Atenção', 'Preencha origem e destino antes de comparar.');
      return;
    }

    setLoading(true);
    try {
      // Fetch real route from Geoapify
      const route: any = await routeService.getRoute(origin, destination);
      if (!route) {
        Alert.alert('Erro', 'Não foi possível calcular a rota.');
        setLoading(false);
        return;
      }

      setRouteInfo(route);
      // set geometry if available (array of {latitude, longitude})
      if (Array.isArray(route.geometry)) {
        setGeometry(route.geometry.map((p: any) => ({ latitude: Number(p.latitude), longitude: Number(p.longitude) })));
      } else if (Array.isArray((route as any).coordinates)) {
        setGeometry((route as any).coordinates.map((p: any) => ({ latitude: Number(p.latitude), longitude: Number(p.longitude) })));
      } else {
        setGeometry(undefined);
      }

      // Save search to backend
      await createSearch({
        originLat: origin.latitude,
        originLng: origin.longitude,
        originAddress: origin.address || originText,
        destinationLat: destination.latitude,
        destinationLng: destination.longitude,
        destinationAddress: destination.address || destinationText,
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
        selectedProvider: null,
      });

      (navigation.navigate as any)('Results', {
        origin,
        destination,
        distanceKm: route.distanceKm,
        durationMin: route.durationMin,
      });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao processar a busca.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        <PlaceAutocompleteInput
          placeholder="Origem (localização atual)"
          value={originText}
          onChangeText={(t) => {
            setOriginText(t);
            setOrigin(null);
          }}
          onSelectPlace={(place) => {
            setOrigin({ latitude: Number(place.latitude), longitude: Number(place.longitude), address: place.address });
            setOriginText(place.displayName);
          }}
          lat={origin?.latitude}
          lng={origin?.longitude}
        />
        <Text style={{ fontSize: 12, color: '#666', marginTop: 6 }}>Confira se o número está correto.</Text>

        <PlaceAutocompleteInput
          placeholder="Destino"
          value={destinationText}
          onChangeText={(t) => {
            setDestinationText(t);
            setDestination(null);
          }}
          onSelectPlace={(place) => {
            setDestination({ latitude: Number(place.latitude), longitude: Number(place.longitude), address: place.address });
            setDestinationText(place.displayName);
          }}
          lat={origin?.latitude}
          lng={origin?.longitude}
        />

        {routeInfo && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>
              {routeInfo.distanceKm} km • {routeInfo.durationMin} min
            </Text>
          </View>
        )}

          <Button
            title={loading ? 'Processando...' : 'Comparar corridas'}
            onPress={handleCompare}
            disabled={
              loading || !isValidLocation(origin) || !isValidLocation(destination)
            }
          />
          {(!isValidLocation(origin) || !isValidLocation(destination)) && (
            <Text style={{ color: '#b00020', marginTop: 8 }}>Escolha um endereço da lista para continuar.</Text>
          )}
      </View>

      {loadingLocation ? (
        <View style={styles.mapPlaceholder}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      ) : (
        <MapView origin={origin} destination={destination} geometry={geometry} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputSection: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  routeInfo: { marginVertical: 8, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 6 },
  routeText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
  mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
