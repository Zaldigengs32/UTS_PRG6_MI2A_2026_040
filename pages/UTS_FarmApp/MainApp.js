import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import SapiScreen from './SapiScreen';
import DombaScreen from './DombaScreen';
import KambingScreen from './KambingScreen';
import DetailScreen from './DetailScreen';

const Stack = createNativeStackNavigator();

export default function MainApp() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sapi"
            component={SapiScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Domba"
            component={DombaScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Kambing"
            component={KambingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              title: 'Farm Apps_040',
              headerStyle: { backgroundColor: '#ffffff' },
              headerTintColor: '#000000',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}