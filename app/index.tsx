import React from 'react';
import { View, Text } from 'react-native';
import { Stack } from 'expo-router';

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
      <Stack.Screen 
        options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
        }} 
      />
      <Text style={{ fontSize: 24, color: '#fff' }}>Welcome to Kaizen Flow</Text>
    </View>
  );
}
