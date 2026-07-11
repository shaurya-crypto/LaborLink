import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoleSelectionScreen } from '@/screens/onboarding/RoleSelectionScreen';
import { LocationPermissionScreen } from '@/screens/onboarding/LocationPermissionScreen';
import { WorkerOnboardingScreen } from '@/screens/onboarding/WorkerOnboardingScreen';

export type OnboardingStackParamList = {
  RoleSelection: undefined;
  LocationPermission: undefined;
  WorkerOnboarding: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <Stack.Screen name="WorkerOnboarding" component={WorkerOnboardingScreen} />
    </Stack.Navigator>
  );
};
