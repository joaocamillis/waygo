import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ResultsScreen from '../screens/ResultsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar conta' }} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Results" component={ResultsScreen} options={{ title: 'Resultados' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return <NavigationContainer>{user ? <AppTabs /> : <AuthStack />}</NavigationContainer>;
}
