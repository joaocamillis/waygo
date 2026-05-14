import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen() {
  const { register, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Não foi possível criar a conta.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Criando...' : 'Criar conta'} onPress={handleRegister} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  error: { color: '#b00020', marginBottom: 12 },
});
