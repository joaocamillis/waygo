import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export interface PlaceSuggestion {
  placeId: string;
  displayName: string;
  address: string;
  latitude: number;
  longitude: number;
  source: 'history' | 'geoapify';
}

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelectPlace: (place: PlaceSuggestion) => void;
  lat?: number;
  lng?: number;
};

export default function PlaceAutocompleteInput({
  placeholder,
  value,
  onChangeText,
  onSelectPlace,
  lat,
  lng,
}: Props) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const params: any = { input };
      if (lat !== undefined && lng !== undefined) {
        params.lat = lat;
        params.lng = lng;
      }

      const response = await api.get('/places/autocomplete', { params });
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 400);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value, fetchSuggestions]);

  const handleSelectSuggestion = (place: PlaceSuggestion) => {
    onChangeText(place.displayName);
    onSelectPlace(place);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
        />
        {loading && <ActivityIndicator size="small" color="#666" style={styles.loader} />}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.placeId}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Text style={styles.suggestionTitle}>{item.displayName}</Text>
                <Text style={styles.suggestionSubtitle}>
                  {item.source === 'history' ? '📍 Recente' : '🌐 Sugestão'}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  inputWrapper: { position: 'relative' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  loader: { position: 'absolute', right: 12, top: 14 },
  suggestionsContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 250,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  suggestionSubtitle: { fontSize: 12, color: '#999' },
});
