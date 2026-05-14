import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function DestinationInput({ value, onChangeText }: Props) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder="Para onde você vai?"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 },
});
