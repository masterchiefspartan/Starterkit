[![CodeGuide](/codeguide-backdrop.svg)](https://codeguide.dev)

# CodeGuide Expo Firebase Starter

A modern cross-platform mobile application starter template built with Expo and Firebase, featuring authentication and real-time database integration.

## Tech Stack

- **Framework:** [Expo](https://expo.dev/) (SDK 52)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/products/auth)
- **Database:** [Firebase](https://firebase.google.com/)
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
- **UI Components:** [React Native](https://reactnative.dev/) with Expo's built-in components
- **Icons:** [@expo/vector-icons](https://docs.expo.dev/guides/icons/)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ installed
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally
- A [Firebase](https://firebase.google.com/) project for authentication and backend services
- Generated project documents from [CodeGuide](https://codeguide.dev/) for best development experience
- (Optional) [Expo Go](https://expo.dev/client) app installed on your mobile device

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd codeguide-expo-firebase
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables Setup**

   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the environment variables in `.env` (see Configuration section below)

4. **Start the development server**

   ```bash
   npx expo start
   ```

5. **Run the app:**
   - Scan the QR code with Expo Go (Android)
   - Scan the QR code with Camera app (iOS)
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator

## Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add an app to your project (iOS and Android)
4. Copy the Firebase configuration object
5. Set up the necessary Firebase services (Authentication, Firestore, etc.)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

## Features

- 🔐 Firebase Authentication
- 📦 Firebase Realtime Database/Firestore
- 📱 Cross-platform (iOS & Android)
- 🎨 Modern UI with native components
- 🚀 File-based routing with Expo Router
- 🔄 Real-time Updates
- 📱 Responsive Design
- 💫 Smooth animations with Reanimated

## Project Structure

```
codeguide-expo-firebase/
├── app/                # Expo Router pages
├── components/         # React Native components
├── constants/         # Constants and configurations
├── hooks/             # Custom hooks
├── assets/            # Static assets
└── documentation/     # Generated documentation from CodeGuide
```

## Documentation Setup

The documentation folder contains all the generated markdown files from CodeGuide:

```bash
documentation/
├── project_requirements_document.md
├── app_flow_document.md
├── frontend_guideline_document.md
└── backend_structure_document.md
```

These documentation files serve as a reference for your project's features and implementation details.

## Voice Service Components

The Kaizen Flow application now includes voice interaction capabilities through the following components:

### VoiceService

A service that handles voice recognition and text-to-speech functionality. Located at `src/services/VoiceService.ts`.

Features:
- Audio recording with optimized settings for speech recognition
- Client-side silence detection
- Integration with OpenAI's Whisper API for high-accuracy transcription
- Fallback to on-device recognition when Whisper API is unavailable
- Text-to-speech capabilities

### Voice UI Components

Three reusable UI components are available to implement voice interactions:

1. **VoiceRecorder** - A standalone component for recording and transcribing speech
   ```jsx
   import { VoiceRecorder } from './components';
   
   <VoiceRecorder 
     onTranscriptionComplete={(text) => console.log('Transcribed:', text)} 
     placeholder="Tap to speak..."
     apiKey="your-openai-api-key" // Optional
   />
   ```

2. **VoiceInput** - A text input with voice recognition capabilities
   ```jsx
   import { VoiceInput } from './components';
   import { useState } from 'react';
   
   function MyComponent() {
     const [text, setText] = useState('');
     
     return (
       <VoiceInput
         value={text}
         onChangeText={setText}
         placeholder="Type or speak..."
       />
     );
   }
   ```

3. **VoiceAssistant** - A conversational interface with voice input and output
   ```jsx
   import { VoiceAssistant } from './components';
   
   <VoiceAssistant 
     initialMessage="How can I help you today?"
     onMessageReceived={(message) => console.log('New message:', message)}
   />
   ```

### Configuration

The VoiceService can be configured with the following options:

```typescript
// Configure VoiceService
import VoiceService from '../src/services/VoiceService';

// Access the singleton instance
const voiceServiceInstance = VoiceService as any;
voiceServiceInstance.options = {
  // Override default options
  silenceDetectionThreshold: 3, // Number of checks with no file size change
  silenceCheckInterval: 500, // Interval in ms to check for silence
  maxRecordingDuration: 30000, // 30 seconds max recording
  useWhisperAPI: true, // Use Whisper API by default
  openAIApiKey: 'your-openai-api-key', // API key for Whisper
};
```

For more details, see the component documentation and examples.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Learn More

To learn more about the technologies used in this project:

- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
