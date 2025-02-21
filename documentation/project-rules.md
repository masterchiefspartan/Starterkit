## Project Overview

*   **Type:** cursor_project_rules
*   **Description:** Generate a React Native mobile app using the 'React Native + Firebase' starter kit from CodeGuide.dev. The app, named "Kaizen Flow," is a voice-only interactive tool designed for both iOS and Android. It employs Firebase for authentication and secure data storage (Firestore), integrates Expo's Speech API and React Native Voice for natural language interaction, and leverages cognitive frameworks to offer AI-guided self-help sessions that help users manage cognitive stress, social anxiety, and confidence issues.
*   **Primary Goal:** To provide a seamless, voice-driven journaling experience that guides users through six cognitive frameworks with adaptive, AI-generated prompts and generates reflective, read-only journal entries for self-care and personal growth.

## Project Structure

### Framework-Specific Routing

*   **Directory Rules:**

    *   `Expo+Latest`: Leverage Expo's routing and component architecture; the project follows a modular file system structure through the `app/` directory emphasizing stack-based navigation for mobile apps.
    *   Example 1: In Expo apps, use `app/(tabs)/_layout.tsx` for tab-based routing.
    *   Example 2: For deeper navigation flows like authentication and voice-guided sessions, organize screens within the `app/` directory (e.g., `app/index.tsx`, `app/+not-found.tsx`).

### Core Directories

*   **Versioned Structure:**

    *   `app/`: Contains primary screens and navigation layouts including tabs for authentication, framework exploration, and journal entries.
    *   `components/`: UI components such as buttons, card displays, and voice interaction indicators.
    *   `config/`: Firebase configuration and integration with Expo's environment settings.
    *   `assets/`: Static resources including fonts and images.
    *   `documentation/`: Markdown documents detailing tech stack and project guidelines.

### Key Files

*   **Stack-Versioned Patterns:**

    *   `app/(tabs)/_layout.tsx`: Root layout file setting up base tab navigation in Expo.
    *   `app/index.tsx`: Entry point to the app showcasing the welcome screen and initial voice greeting.
    *   `config/firebase.ts`: Firebase configuration aligning with authentication and Firestore integration.

## Tech Stack Rules

*   **Version Enforcement:**

    *   `expo@latest`: Structure must adhere to Expo's conventions including using the managed workflow and expo-specific navigation patterns.
    *   `typescript@latest`: Use TypeScript throughout for type safety and clear code documentation.
    *   `firebase@latest`: Enforce Firebase Authentication for sign-in and Firestore for data storage, with security rules implemented appropriately.
    *   `react-native@latest`: Follow best practices for mobile app performance and component rendering.
    *   `tailwindcss (via tailwind-rn)`: Apply utility-first styling consistently to achieve a minimalistic, card-based UI design.

## PRD Compliance

*   **Non-Negotiable:**

    *   "Exclusive voice-interaction model; no standard keyboard input." – The app must solely rely on voice for interactions with fallback training modes and confirmation prompts.
    *   "Implement Firebase Authentication for secure email/password and Google sign-in." – Security and user management are core requirements.
    *   "Utilize Expo's Speech API and React Native Voice for handling voice interactions." – Ensure clear, adaptive voice responses and accurate speech-to-text integration.
    *   "Generate AI-driven, text-based journal entries following each cognitive session." – Summaries must be stored and displayed as immutable journals in the dedicated Journal Entry tab.

## App Flow Integration

*   **Stack-Aligned Flow:**

    *   Example: Upon app launch, `app/index.tsx` initiates a voice prompt: "Welcome to Kaizen Flow. Choose a cognitive framework to explore by saying its name or list available frameworks." This triggers Firebase Authentication, followed by a voice calibration phase. Once authenticated and trained, users navigate via voice commands to framework-specific screens (e.g., `app/(tabs)/explore.tsx`) where voice-guided sessions are rendered, and on session completion, an AI-generated summary is stored in Firestore and displayed under a dedicated journal entry view.

## Best Practices

*   Expo

    *   Use Expo's managed workflow to simplify cross-platform development.
    *   Maintain performance by leveraging Expo's optimizing tools (e.g., Expo Image Cache) for assets.
    *   Follow Expo's folder conventions to ensure a smooth app lifecycle.

*   TypeScript

    *   Enforce strong typing across components and modules for maintainability.
    *   Use interfaces and types to define props and state for clarity.
    *   Leverage TypeScript tooling to catch errors in development time.

*   Firebase

    *   Secure authentication flows with proper security rules in Firestore.
    *   Use environment variables to manage Firebase keys.
    *   Regularly update SDK versions to mitigate security vulnerabilities.

*   React Native

    *   Optimize component rendering to ensure responsive UI.
    *   Use hooks effectively to manage state and side-effects.
    *   Adhere to accessibility guidelines especially for voice-driven input.

*   Tailwind CSS (tailwind-rn)

    *   Apply consistent utility-first styling to maintain clean UI design.
    *   Keep classes minimal to reduce redundancy.
    *   Ensure responsive design specifications for various device sizes.

## Rules

*   Derive folder/file patterns **directly** from the tech stack and CodeGuide.dev starter kit, ensuring alignment with Expo and React Native conventions.

*   Enforce a strictly voice-driven interface:

    *   The app must feature a training mode in `app/index.tsx` to calibrate voice recognition before accessing core functionalities.
    *   Utilize Expo's Speech API and React Native Voice, with clearly defined fallback and confirmation prompts (e.g., "Did you mean 'Gratitude Mapping'?") in challenging environments.

*   Maintain separate directories for authentication, framework flows, and journal entries to keep the code organized and modular.

*   Never mix traditional keyboard-based input with the designated voice interaction model; keyboard input is allowed only as a temporary fallback. 