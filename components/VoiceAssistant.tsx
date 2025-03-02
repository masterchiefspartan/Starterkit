import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VoiceService, { VoiceRecognitionResult, Message } from '../src/services/VoiceService';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface VoiceAssistantProps {
  apiKey?: string;
  initialMessage?: string;
  onMessageReceived?: (message: Message) => void;
}

/**
 * VoiceAssistant component provides a conversational interface with voice input and output
 * using the VoiceService.
 */
export function VoiceAssistant({
  apiKey,
  initialMessage = "Hi there! How can I help you today?",
  onMessageReceived,
}: VoiceAssistantProps) {
  // Component state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const scrollViewRef = useRef<ScrollView>(null);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Speak the initial message
  useEffect(() => {
    if (initialMessage) {
      speakMessage(initialMessage);
    }
  }, []);

  // Handle transcription result
  const handleTranscriptionResult = useCallback(async (result: VoiceRecognitionResult) => {
    setIsRecording(false);
    setIsProcessing(false);
    
    if (result.success && result.text) {
      // Add user message to conversation
      const userMessage: Message = { role: 'user', content: result.text };
      setMessages(prev => [...prev, userMessage]);
      
      if (onMessageReceived) {
        onMessageReceived(userMessage);
      }
      
      // In a real app, you would send this to an API and get a response
      // For this example, we'll just echo back a simple response
      await processUserMessage(result.text);
    } else if (result.error) {
      console.error('Voice recognition error:', result.error);
      
      // Add error message
      const errorMessage: Message = { 
        role: 'assistant', 
        content: `Sorry, I couldn't understand that. ${result.error}` 
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Speak the error message
      await speakMessage(errorMessage.content);
    }
  }, [onMessageReceived]);

  // Process user message and generate a response
  const processUserMessage = async (text: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a simple response based on the input
      // In a real app, this would be replaced with an actual API call
      let responseText = '';
      
      if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
        responseText = 'Hello! How can I help you today?';
      } else if (text.toLowerCase().includes('time')) {
        responseText = `The current time is ${new Date().toLocaleTimeString()}.`;
      } else if (text.toLowerCase().includes('weather')) {
        responseText = 'I\'m sorry, I don\'t have access to weather information yet.';
      } else if (text.toLowerCase().includes('thank')) {
        responseText = 'You\'re welcome! Is there anything else I can help with?';
      } else {
        responseText = `I heard you say: "${text}". How can I assist you with that?`;
      }
      
      // Add assistant message to conversation
      const assistantMessage: Message = { role: 'assistant', content: responseText };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (onMessageReceived) {
        onMessageReceived(assistantMessage);
      }
      
      // Speak the response
      await speakMessage(responseText);
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Speak a message using text-to-speech
  const speakMessage = async (text: string) => {
    try {
      setIsSpeaking(true);
      await VoiceService.speak(text);
    } catch (error) {
      console.error('Error speaking message:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Toggle recording state
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        // Stop recording
        await VoiceService.stopListening();
      } else {
        // Start recording
        setIsRecording(true);
        await VoiceService.startListening(handleTranscriptionResult);
      }
    } catch (err) {
      setIsRecording(false);
      console.error('Voice recording error:', err);
      
      // Add error message
      const errorMessage: Message = { 
        role: 'assistant', 
        content: `Sorry, there was an error with the voice recording: ${err instanceof Error ? err.message : String(err)}` 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Conversation history */}
      <ScrollView 
        style={styles.messagesContainer}
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <View 
            key={index} 
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            ]}
          >
            <ThemedText style={styles.messageText}>
              {message.content}
            </ThemedText>
          </View>
        ))}
        
        {isProcessing && (
          <View style={[styles.messageBubble, styles.assistantMessage]}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      </ScrollView>
      
      {/* Voice controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={toggleRecording}
          style={[
            styles.recordButton,
            isRecording ? styles.recordingActive : null,
            isSpeaking ? styles.speakingActive : null,
          ]}
          disabled={isProcessing || isSpeaking}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : isSpeaking ? (
            <Ionicons name="volume-high" size={24} color="#fff" />
          ) : (
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={24}
              color="#fff"
            />
          )}
        </TouchableOpacity>
        
        <ThemedText style={styles.statusText}>
          {isRecording ? 'Listening...' : 
           isSpeaking ? 'Speaking...' : 
           'Tap to speak'}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9E9EB',
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  recordingActive: {
    backgroundColor: '#FF3B30',
  },
  speakingActive: {
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 16,
  },
}); 