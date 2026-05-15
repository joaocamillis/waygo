import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RideOptionCard from '../components/RideOptionCard';
import { Provider } from '../types/provider';
import { useRoute } from '@react-navigation/native';
import { Location } from '../types/location';

type RouteParams = {
  origin: Location;
  destination: Location;
  distanceKm: number;
  durationMin: number;
};

const PROVIDERS: Provider[] = [
  { id: 'uber', name: 'uber', displayName: 'Uber', color: '#000' },
  { id: '99', name: '99', displayName: '99', color: '#ff5a5f' },
  { id: 'indrive', name: 'indrive', displayName: 'inDrive', color: '#00b894' },
];

export default function ResultsScreen() {
  const route = useRoute();
  const params = (route.params || {}) as Partial<RouteParams>;
  const distanceKm = params.distanceKm ?? 0;
  const durationMin = params.durationMin ?? 0;
  const origin = params.origin;
  const destination = params.destination;

  // Mock price/eta per provider for now; Uber remains mock
  const data = PROVIDERS.map((p, i) => ({ id: String(i + 1), provider: p, price: Math.max(6, Math.round(distanceKm * (3 + i))), eta: 3 + i * 2, duration: durationMin }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados</Text>
      <View style={styles.info}>
        <Text style={styles.infoText}>Origem: {origin?.address ?? 'Localização atual'}</Text>
        <Text style={styles.infoText}>Destino: {destination?.address ?? '—'}</Text>
        <Text style={styles.infoText}>Distância: {distanceKm} km</Text>
        <Text style={styles.infoText}>Duração estimada: {durationMin} min</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RideOptionCard provider={item.provider} price={item.price} etaMinutes={item.eta} durationMinutes={item.duration} />
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  sep: { height: 12 },
  info: { marginBottom: 12, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  infoText: { color: '#333', marginBottom: 4 },
});
