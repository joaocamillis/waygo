import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      {user ? (
        <View>
          <Text style={styles.label}>{user.name}</Text>
          <Text style={styles.sub}>{user.email}</Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Sair" onPress={() => logout()} />
          </View>
        </View>
      ) : (
        <Text style={styles.empty}>Nenhum usuário</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 18, fontWeight: '600' },
  sub: { color: '#666', marginBottom: 8 },
  empty: { color: '#666' },
});
