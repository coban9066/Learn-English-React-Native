import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
  Stats: undefined;
  Settings: undefined;
  Leaderboard: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Oyun' }} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
