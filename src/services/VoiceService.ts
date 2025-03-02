import * as Speech from 'expo-speech';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Types for our service
export interface VoiceServiceOptions {
  silenceDetectionThreshold?: number; // Number of checks with no file size change
  silenceCheckInterval?: number; // Interval in ms to check for silence
  maxRecordingDuration?: number; // Maximum recording duration in ms
  useWhisperAPI?: boolean; // Whether to use Whisper API or on-device recognition
  openAIApiKey?: string; // OpenAI API key for Whisper
}

export interface VoiceRecognitionResult {
  success: boolean;
  text?: string;
  error?: string;
}

// Message type for conversation history
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Whisper API response type
interface WhisperResponse {
  text: string;
}

/**
 * VoiceService handles all voice-related functionality:
 * - Audio recording with optimized quality
 * - Client-side silence detection
 * - Speech recognition
 * - Text-to-speech output
 */
class VoiceService {
  private isListening: boolean = false;
  private recording: Audio.Recording | null = null;
  private recordingURI: string | null = null;
  private silenceTimer: NodeJS.Timeout | null = null;
  private lastFileSize: number = 0;
  private silenceCounter: number = 0;
  private onSpeechEndCallback: ((result: VoiceRecognitionResult) => void) | null = null;
  
  // Configuration options
  private options: Required<VoiceServiceOptions> = {
    silenceDetectionThreshold: 3, // 3 consecutive checks with no file size change
    silenceCheckInterval: 500, // Check every 500ms
    maxRecordingDuration: 30000, // 30 seconds max recording
    useWhisperAPI: true, // Use Whisper API by default
    openAIApiKey: process.env.OPENAI_API_KEY || '', // Get API key from env
  };

  constructor(options?: VoiceServiceOptions) {
    // Override default options with any provided options
    if (options) {
      this.options = { ...this.options, ...options };
    }
    
    // Initialize Voice listeners
    this.setupVoiceListeners();
  }

  /**
   * Set up Voice recognition event listeners
   */
  private setupVoiceListeners(): void {
    Voice.onSpeechResults = this.handleSpeechResults.bind(this);
    Voice.onSpeechError = this.handleSpeechError.bind(this);
    Voice.onSpeechEnd = this.handleSpeechEnd.bind(this);
  }

  /**
   * Start listening for voice input with optimized audio settings
   * @param callback Function to call when speech recognition is complete
   */
  async startListening(callback: (result: VoiceRecognitionResult) => void): Promise<void> {
    if (this.isListening) {
      console.log('Already listening');
      return;
    }

    try {
      // Request audio recording permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        callback({ 
          success: false, 
          error: 'Microphone permission not granted' 
        });
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });

      // Start recording with optimized settings
      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: 2, // MPEG_4
          audioEncoder: 3, // AAC
          sampleRate: 22050, // Reduced from 44100
          numberOfChannels: 1, // Mono instead of stereo
          bitRate: 64000, // Reduced from 128000
        },
        ios: {
          extension: '.m4a',
          outputFormat: 'aac ', // MPEG4AAC
          audioQuality: 64, // MEDIUM
          sampleRate: 22050, // Reduced from 44100
          numberOfChannels: 1, // Mono instead of stereo
          bitRate: 64000, // Reduced from 128000
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 64000,
        },
        isMeteringEnabled: true,
      });

      this.recording = recording;
      this.recordingURI = recording.getURI() || null;
      this.isListening = true;
      this.onSpeechEndCallback = callback;
      this.silenceCounter = 0;
      this.lastFileSize = 0;

      // Start silence detection
      this.startSilenceDetection();

      // Set a maximum recording duration
      setTimeout(() => {
        if (this.isListening) {
          this.stopListening();
        }
      }, this.options.maxRecordingDuration);

      console.log('Started listening for voice input');
    } catch (error) {
      console.error('Error starting voice recording:', error);
      callback({ 
        success: false, 
        error: `Failed to start recording: ${error}` 
      });
    }
  }

  /**
   * Start monitoring file size to detect silence
   */
  private startSilenceDetection(): void {
    if (!this.recordingURI) return;

    this.silenceTimer = setInterval(async () => {
      try {
        if (!this.recordingURI) return;

        const fileInfo = await FileSystem.getInfoAsync(this.recordingURI);
        
        if (fileInfo.exists && fileInfo.size) {
          // If file size hasn't changed significantly since last check
          if (Math.abs(fileInfo.size - this.lastFileSize) < 100) {
            this.silenceCounter++;
            
            // If silence threshold reached, stop recording
            if (this.silenceCounter >= this.options.silenceDetectionThreshold) {
              console.log('Silence detected, stopping recording');
              this.stopListening();
            }
          } else {
            // Reset silence counter if file size changed
            this.silenceCounter = 0;
            this.lastFileSize = fileInfo.size;
          }
        }
      } catch (error) {
        console.error('Error in silence detection:', error);
      }
    }, this.options.silenceCheckInterval);
  }

  /**
   * Stop listening and process the recorded audio
   */
  async stopListening(): Promise<void> {
    if (!this.isListening) return;

    try {
      // Clear silence detection timer
      if (this.silenceTimer) {
        clearInterval(this.silenceTimer);
        this.silenceTimer = null;
      }

      // Stop recording
      if (this.recording) {
        await this.recording.stopAndUnloadAsync();
        
        // Process the recorded audio
        if (this.recordingURI && this.onSpeechEndCallback) {
          if (this.options.useWhisperAPI && this.options.openAIApiKey) {
            // Process with Whisper API
            await this.processWithWhisperAPI();
          } else {
            // Fallback to on-device recognition
            await this.processWithOnDeviceRecognition();
          }
        }
        
        this.recording = null;
      }
      
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      if (this.onSpeechEndCallback) {
        this.onSpeechEndCallback({
          success: false,
          error: `Failed to stop recording: ${error}`
        });
      }
    }
  }

  /**
   * Process audio with Whisper API for high-accuracy transcription
   */
  private async processWithWhisperAPI(): Promise<void> {
    if (!this.recordingURI || !this.onSpeechEndCallback) return;

    try {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(this.recordingURI);
      if (!fileInfo.exists) {
        throw new Error('Recording file not found');
      }

      // Read file as base64
      const base64Audio = await FileSystem.readAsStringAsync(this.recordingURI, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: this.recordingURI,
        name: 'audio.m4a',
        type: 'audio/m4a',
      } as any);
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');
      
      // Call Whisper API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.options.openAIApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Whisper API error: ${response.status} ${errorText}`);
      }

      const data = await response.json() as WhisperResponse;
      
      // Call the callback with the transcribed text
      this.onSpeechEndCallback({
        success: true,
        text: data.text.trim()
      });

    } catch (error) {
      console.error('Error processing with Whisper API:', error);
      
      // Fallback to on-device recognition if Whisper fails
      await this.processWithOnDeviceRecognition();
    }
  }

  /**
   * Process audio with on-device speech recognition
   * This is a fallback if Whisper API is not available or fails
   */
  private async processWithOnDeviceRecognition(): Promise<void> {
    try {
      await Voice.start('en-US');
      
      // Voice.onSpeechResults will be called when recognition is complete
      // The callback will handle the result
    } catch (error) {
      console.error('Error with on-device recognition:', error);
      if (this.onSpeechEndCallback) {
        this.onSpeechEndCallback({
          success: false,
          error: `Speech recognition failed: ${error}`
        });
      }
    }
  }

  /**
   * Handle speech recognition results
   */
  private handleSpeechResults(event: SpeechResultsEvent): void {
    if (event.value && event.value.length > 0) {
      const recognizedText = event.value[0];
      
      if (this.onSpeechEndCallback) {
        this.onSpeechEndCallback({
          success: true,
          text: recognizedText
        });
      }
      
      // Clean up Voice
      Voice.stop();
    }
  }

  /**
   * Handle speech recognition errors
   */
  private handleSpeechError(event: SpeechErrorEvent): void {
    console.error('Speech recognition error:', event);
    
    if (this.onSpeechEndCallback) {
      this.onSpeechEndCallback({
        success: false,
        error: `Speech recognition error: ${event.error?.message || 'Unknown error'}`
      });
    }
  }

  /**
   * Handle speech recognition end
   */
  private handleSpeechEnd(): void {
    // This is just a lifecycle event, actual results are handled in handleSpeechResults
    console.log('Speech recognition ended');
  }

  /**
   * Speak text using text-to-speech
   */
  async speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: resolve,
        onError: (error) => {
          console.error('TTS error:', error);
          resolve();
        }
      });
    });
  }

  /**
   * Check if the service is currently listening
   */
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Clean up resources
   */
  async destroy(): Promise<void> {
    if (this.silenceTimer) {
      clearInterval(this.silenceTimer);
    }
    
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch (error) {
        console.error('Error stopping recording during cleanup:', error);
      }
    }
    
    try {
      await Voice.destroy();
    } catch (error) {
      console.error('Error destroying Voice:', error);
    }
  }
}

// Export a singleton instance
export default new VoiceService(); 