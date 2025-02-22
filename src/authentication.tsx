import React, { useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';

const auth = getAuth();

const Authentication = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('Signed in with email:', user.email);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleEmailSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User signed up:', user.email);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleGoogleSignIn = async () => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
    });

    React.useEffect(() => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithPopup(auth, credential)
          .then((result) => {
            console.log('Signed in with Google:', result.user.email);
          })
          .catch((error) => {
            setError(error.message);
          });
      }
    }, [response]);

    promptAsync();
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In with Email" onPress={handleEmailSignIn} />
      <Button title="Sign Up with Email" onPress={handleEmailSignUp} />
      <Button title="Reset Password" onPress={handlePasswordReset} />
      <Button title="Sign In with Google" onPress={handleGoogleSignIn} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
};

export default Authentication; 