// client/src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './src/screens/MapScreen';
import SpotDetailsScreen from './src/screens/SpotDetailsScreen';
import AddSpotScreen from './src/screens/AddSpotScreen';
import RecommendationsScreen from './src/screens/RecommendationsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen
          name="Recommendations"
          component={RecommendationsScreen}
          options={{ title: 'Recommended Spots' }}
        />
        <Stack.Screen name="SpotDetails" component={SpotDetailsScreen} />
        <Stack.Screen name="AddSpot" component={AddSpotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
