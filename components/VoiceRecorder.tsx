import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VoiceService, { VoiceRecognitionResult } from '../src/services/VoiceService';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface VoiceRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  placeholder?: string;
  apiKey?: string;
}

/**
 * VoiceRecorder component provides a user interface for recording and transcribing speech
 * using the VoiceService.
 */
export function VoiceRecorder({
  onTranscriptionComplete,
  placeholder = 'Tap to speak...',
  apiKey,
}: VoiceRecorderProps) {
  // Component state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  // Initialize VoiceService with API key if provided
  useEffect(() => {
    if (apiKey) {
      // Configure VoiceService with the provided API key
      const voiceServiceInstance = VoiceService as any;
      voiceServiceInstance.options = {
        ...voiceServiceInstance.options,
        openAIApiKey: apiKey,
      };
    }

    // Clean up VoiceService when component unmounts
    return () => {
      VoiceService.destroy();
    };
  }, [apiKey]);

  // Handle recording duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isRecording) {
      setRecordingDuration(0);
      timer = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else if (timer) {
      clearInterval(timer);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle transcription result
  const handleTranscriptionResult = useCallback((result: VoiceRecognitionResult) => {
    setIsRecording(false);
    setIsProcessing(false);
    
    if (result.success && result.text) {
      setTranscription(result.text);
      setError(null);
      
      if (onTranscriptionComplete) {
        onTranscriptionComplete(result.text);
      }
    } else if (result.error) {
      setError(result.error);
    }
  }, [onTranscriptionComplete]);

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
        
        await VoiceService.startListening(handleTranscriptionResult);
      }
    } catch (err) {
      setIsRecording(false);
      setIsProcessing(false);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Clear transcription and error
  const clearTranscription = () => {
    setTranscription('');
    setError(null);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Transcription result or placeholder */}
      {transcription ? (
        <View style={styles.transcriptionContainer}>
          <ThemedText style={styles.transcriptionText}>{transcription}</ThemedText>
          <TouchableOpacity onPress={clearTranscription} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="#888" />
          </TouchableOpacity>
        </View>
      ) : (
        <ThemedText style={styles.placeholder}>
          {error || placeholder}
        </ThemedText>
      )}

      {/* Recording button and status */}
      <View style={styles.controlsContainer}>
        {isRecording && (
          <ThemedText style={styles.recordingTime}>
            {formatTime(recordingDuration)}
          </ThemedText>
        )}
        
        <TouchableOpacity
          onPress={toggleRecording}
          style={[
            styles.recordButton,
            isRecording ? styles.recordingActive : null,
            isProcessing && !isRecording ? styles.processing : null,
          ]}
          disabled={isProcessing && !isRecording}
        >
          {isProcessing && !isRecording ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={24}
              color="#fff"
            />
          )}
        </TouchableOpacity>
        
        {isRecording && (
          <ThemedText style={styles.recordingLabel}>
            Listening...
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transcriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
  },
  transcriptionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  placeholder: {
    fontSize: 16,
    color: '#888',
    minHeight: 60,
    textAlignVertical: 'center',
  },
  clearButton: {
    padding: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  recordingActive: {
    backgroundColor: '#FF3B30',
  },
  processing: {
    backgroundColor: '#8E8E93',
  },
  recordingTime: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  recordingLabel: {
    fontSize: 16,
  },
}); 