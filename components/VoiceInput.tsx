import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VoiceService, { VoiceRecognitionResult } from '../src/services/VoiceService';
import { ThemedView } from './ThemedView';

interface VoiceInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  apiKey?: string;
  style?: any;
  inputStyle?: any;
}

/**
 * VoiceInput component provides a text input with voice recognition capabilities
 * using the VoiceService.
 */
export function VoiceInput({
  value,
  onChangeText,
  placeholder = 'Type or speak...',
  apiKey,
  style,
  inputStyle,
}: VoiceInputProps) {
  // Component state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle transcription result
  const handleTranscriptionResult = useCallback((result: VoiceRecognitionResult) => {
    setIsRecording(false);
    setIsProcessing(false);
    
    if (result.success && result.text) {
      onChangeText(result.text);
      setError(null);
    } else if (result.error) {
      setError(result.error);
      console.error('Voice recognition error:', result.error);
    }
  }, [onChangeText]);

  // Toggle recording state
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        // Stop recording
        setIsProcessing(true);
        await VoiceService.stopListening();
      } else {
        // Start recording
        setError(null);
        setIsProcessing(true);
        setIsRecording(true);
        
        // Configure VoiceService with API key if provided
        if (apiKey) {
          const voiceServiceInstance = VoiceService as any;
          voiceServiceInstance.options = {
            ...voiceServiceInstance.options,
            openAIApiKey: apiKey,
          };
        }
        
        await VoiceService.startListening(handleTranscriptionResult);
      }
    } catch (err) {
      setIsRecording(false);
      setIsProcessing(false);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Voice recording error:', err);
    }
  };

  return (
    <ThemedView style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, inputStyle]}
        multiline
      />
      
      <TouchableOpacity
        onPress={toggleRecording}
        style={[
          styles.recordButton,
          isRecording ? styles.recordingActive : null,
        ]}
        disabled={isProcessing && !isRecording}
      >
        {isProcessing && !isRecording ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Ionicons
            name={isRecording ? "stop" : "mic"}
            size={20}
            color="#fff"
          />
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  recordingActive: {
    backgroundColor: '#FF3B30',
  },
}); 