# Debugging Guidelines

## General Debugging Practices
- Use descriptive console logs with prefixes for easy filtering (e.g., `[VoiceService]`, `[API]`)
- Implement different log levels (debug, info, warn, error) and control them via environment
- Use conditional breakpoints in development tools
- Implement proper try/catch blocks with specific error handling
- Create custom error classes for different types of errors

## React Native Specific
- Use React DevTools for component inspection
- Implement Flipper integration for network and storage debugging
- Use React Native's Performance Monitor to identify bottlenecks
- Implement proper component memoization to prevent unnecessary re-renders
- Use the React Native Debugger for combined debugging experience

## Voice Service Debugging
- Log the audio recording state transitions
- Implement visual indicators for audio levels during recording
- Create a debug mode that saves audio files for later inspection
- Log API request/response pairs for Whisper API calls
- Implement a fallback chain with proper logging at each step

## Network Debugging
- Log request and response headers in development
- Implement network interceptors for debugging
- Use tools like Charles Proxy or Proxyman for deep inspection
- Track network request timing and log slow requests
- Implement retry logic with exponential backoff for failed requests

## Performance Debugging
- Use React Native's built-in performance APIs
- Track and log memory usage for critical operations
- Implement performance marks and measures for critical paths
- Use React Profiler to identify slow components
- Monitor and log frame rates during animations

## Error Reporting
- Implement a centralized error reporting system
- Capture JS errors, native crashes, and ANRs
- Include relevant context with error reports (device info, app state)
- Implement breadcrumbs for easier reproduction
- Create a debug menu accessible in development builds

## Testing for Debugging
- Write unit tests for critical utility functions
- Implement integration tests for complex workflows
- Create a suite of end-to-end tests for critical paths
- Use snapshot testing for UI components
- Implement visual regression testing 