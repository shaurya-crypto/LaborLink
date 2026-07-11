import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { RootNavigator } from '@/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <RootNavigator />
      <Toast />
    </SafeAreaProvider>
  );
};

export default App;
