import React from 'react';
import { View } from 'react-native';
import Authentication from '../src/authentication';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Authentication />
    </View>
  );
};

export default App;
