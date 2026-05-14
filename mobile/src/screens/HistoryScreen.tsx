import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listSearches } from '../services/rideService';

export default function HistoryScreen() {
  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSearches = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listSearches();
      setSearches(data);
    } catch {
      setError('Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSearches();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      {loading && <Text>Carregando...</Text>}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && searches.length === 0 && <Text style={styles.empty}>Nenhuma busca feita ainda.</Text>}
      <FlatList
        data={searches}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.destination_address || 'Destino não informado'}</Text>
            <Text style={styles.itemText}>{item.origin_address || 'Origem não informada'}</Text>
            <Text style={styles.itemText}>Distância: {item.distance_km ?? '-'} km</Text>
            <Text style={styles.itemText}>Duração: {item.duration_min ?? '-'} min</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  empty: { color: '#666' },
  error: { color: '#b00020', marginBottom: 12 },
  item: { padding: 14, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  itemTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  itemText: { color: '#555' },
  separator: { height: 12 },
});
