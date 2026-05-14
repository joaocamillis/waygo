import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DestinationInput from '../components/DestinationInput';
import { createSearch } from '../services/rideService';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    setError('');
    setLoading(true);
    try {
      await createSearch({
        originLat: -23.55052,
        originLng: -46.633308,
        originAddress: 'Localização atual',
        destinationLat: -23.542,
        destinationLng: -46.612,
        destinationAddress: destination || 'Etec da Zona Leste',
        distanceKm: 12.5,
        durationMin: 28,
        selectedProvider: null,
      });
      navigation.navigate('Results' as never);
    } catch (err: any) {
      setError('Não foi possível salvar a busca.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WayGo</Text>
      <DestinationInput value={destination} onChangeText={setDestination} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Salvando...' : 'Comparar corridas'} onPress={handleCompare} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  error: { color: '#b00020', marginBottom: 12 },
});
