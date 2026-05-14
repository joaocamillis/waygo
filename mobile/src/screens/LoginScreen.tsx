import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Não foi possível entrar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WayGo</Text>
      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
      <View style={styles.registerRow}>
        <Text>Ainda não tem uma conta?</Text>
        <Button title="Criar conta" onPress={() => navigation.navigate('Register' as never)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  registerRow: { marginTop: 12, alignItems: 'center' },
  error: { color: '#b00020', marginBottom: 12 },
});
