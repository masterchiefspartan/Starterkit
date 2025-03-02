import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { VoiceRecorder, VoiceInput, VoiceAssistant, ThemedText } from '../components';

/**
 * Voice Demo Screen
 * 
 * This screen demonstrates the three voice components:
 * 1. VoiceRecorder - A standalone component for recording and transcribing speech
 * 2. VoiceInput - A text input with voice recognition capabilities
 * 3. VoiceAssistant - A conversational interface with voice input and output
 */
export default function VoiceDemoScreen() {
  const [inputText, setInputText] = useState('');
  
  // Optional: Your OpenAI API key for Whisper API
  // In a production app, this would come from environment variables or secure storage
  const apiKey = process.env.OPENAI_API_KEY || '';
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Voice Components Demo',
          headerLargeTitle: true,
        }} 
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Section 1: VoiceRecorder */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>Voice Recorder</ThemedText>
          <ThemedText style={styles.description}>
            Tap the microphone button to start recording. Your speech will be transcribed.
          </ThemedText>
          
          <VoiceRecorder 
            onTranscriptionComplete={(text) => console.log('Transcribed:', text)}
            placeholder="Tap to speak..."
            apiKey={apiKey}
          />
        </View>
        
        {/* Section 2: VoiceInput */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>Voice Input</ThemedText>
          <ThemedText style={styles.description}>
            A text input with voice recognition capabilities.
          </ThemedText>
          
          <VoiceInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type or speak..."
            apiKey={apiKey}
            style={styles.voiceInput}
          />
        </View>
        
        {/* Section 3: VoiceAssistant */}
        <View style={styles.section}>
          <ThemedText type="title" style={styles.sectionTitle}>Voice Assistant</ThemedText>
          <ThemedText style={styles.description}>
            A conversational interface with voice input and output.
          </ThemedText>
          
          <View style={styles.assistantContainer}>
            <VoiceAssistant 
              initialMessage="Hi there! How can I help you today?"
              onMessageReceived={(message) => console.log('New message:', message)}
              apiKey={apiKey}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 24,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  voiceInput: {
    backgroundColor: '#fff',
  },
  assistantContainer: {
    height: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
}); 