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

  const get = (obj: any, keys: string[], fallback = '-') => {
    for (const k of keys) if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
    return fallback;
  };

  const formatDate = (v: any) => {
    if (!v) return '-';
    const d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    return d.toLocaleString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      {loading && <Text>Carregando...</Text>}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && searches.length === 0 && <Text style={styles.empty}>Nenhuma busca feita ainda.</Text>}
      <FlatList
        data={searches}
        keyExtractor={item => String(get(item, ['id', 'search_id'], ''))}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{get(item, ['destinationAddress', 'destination_address', 'destination_address_formatted'], 'Destino não informado')}</Text>
            <Text style={styles.itemText}>Distância: {get(item, ['distanceKm', 'distance_km'], '-')} km</Text>
            <Text style={styles.itemText}>Duração: {get(item, ['durationMin', 'duration_min'], '-')} min</Text>
            <Text style={styles.itemText}>Data: {formatDate(get(item, ['createdAt', 'created_at', 'date']))}</Text>
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
