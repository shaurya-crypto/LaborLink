import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmployerSetupScreen } from '@/screens/main/EmployerSetupScreen';
import { WorkerTabNavigator } from './WorkerTabNavigator';
import { JobDetailsScreen } from '@/screens/main/JobDetailsScreen';
import { NotificationsScreen } from '@/screens/main/NotificationsScreen';
import { SavedJobsScreen } from '@/screens/main/SavedJobsScreen';
import { useAppStore } from '@/store/useAppStore';
import { HomeScreen } from '@/screens/main/HomeScreen';

export type MainStackParamList = {
  WorkerTabs: undefined;
  EmployerDashboard: undefined;
  EmployerSetup: undefined;
  JobDetails: { jobId: string };
  Notifications: undefined;
  SavedJobs: undefined; // Accessible from Profile or Home depending on design
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  const { role } = useAppStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'employer' ? (
        <>
          <Stack.Screen name="EmployerDashboard" component={HomeScreen} />
          <Stack.Screen name="EmployerSetup" component={EmployerSetupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="WorkerTabs" component={WorkerTabNavigator} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
