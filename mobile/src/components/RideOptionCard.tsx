import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProviderBadge from './ProviderBadge';
import { Provider } from '../types/provider';

type Props = {
  provider: Provider;
  price: number;
  etaMinutes: number;
  durationMinutes: number;
};

export default function RideOptionCard({ provider, price, etaMinutes, durationMinutes }: Props) {
  return (
    <View style={styles.card}>
      <ProviderBadge provider={provider} />
      <View style={styles.info}>
        <Text style={styles.provider}>{provider.displayName}</Text>
        <Text style={styles.meta}>{durationMinutes} min · ETA {etaMinutes} min</Text>
      </View>
      <Text style={styles.price}>${price.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  info: { flex: 1, marginLeft: 12 },
  provider: { fontSize: 16, fontWeight: '600' },
  meta: { color: '#666', marginTop: 4 },
  price: { fontSize: 16, fontWeight: '700' },
});
