import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import RideOptionCard from '../components/RideOptionCard';
import { Provider } from '../types/provider';

const PROVIDERS: Provider[] = [
  { id: 'uber', name: 'uber', displayName: 'Uber', color: '#000' },
  { id: '99', name: '99', displayName: '99', color: '#ff5a5f' },
  { id: 'indrive', name: 'indrive', displayName: 'inDrive', color: '#00b894' },
];

const MOCK = PROVIDERS.map((p, i) => ({ id: String(i + 1), provider: p, price: (10 + i * 5), eta: 3 + i * 2, duration: 12 + i * 5 }));

export default function ResultsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados</Text>
      <FlatList
        data={MOCK}
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
});
