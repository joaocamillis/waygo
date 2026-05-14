import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Provider } from '../types/provider';

export default function ProviderBadge({ provider }: { provider: Provider }) {
  return (
    <View style={[styles.badge, { backgroundColor: provider.color || '#333' }]}>
      <Text style={styles.text}>{provider.displayName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  text: { color: '#fff', fontWeight: '600' },
});
