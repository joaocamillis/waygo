import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'WAYGO_TOKEN';

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return token;
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};
