import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Authentication from '../src/authentication';
import { ThemedText } from '@/components/ThemedText';

const App = () => {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Welcome to Kaizen Flow</ThemedText>
      <View style={styles.link}>
        <Button 
          title="Open Voice Components Demo" 
          onPress={() => {
            // Navigate to the voice demo screen using Expo Router
            // Using the path with leading slash to match the expected type
            router.push('/voice-demo');
          }}
        />
      </View>
      <Authentication />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default App;
