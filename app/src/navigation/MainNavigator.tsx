import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmployerSetupScreen } from '@/screens/main/EmployerSetupScreen';
import { WorkerTabNavigator } from './WorkerTabNavigator';
import { JobDetailsScreen } from '@/screens/main/JobDetailsScreen';
import { NotificationsScreen } from '@/screens/main/NotificationsScreen';
import { SavedJobsScreen } from '@/screens/main/SavedJobsScreen';
import { useAppStore } from '@/store/useAppStore';
import { HomeScreen } from '@/screens/main/HomeScreen';

import { EmployerTabNavigator } from './EmployerTabNavigator';
import { 
  PostJobScreen, 
  ApplicantsScreen, 
  WorkerProfileScreen, 
  EmployerNotificationsScreen 
} from '@/screens/employer';

export type MainStackParamList = {
  WorkerTabs: undefined;
  JobDetails: { jobId: string };
  Notifications: undefined;
  SavedJobs: undefined;
  
  EmployerTabs: undefined;
  PostJob: undefined;
  Applicants: { jobId: string };
  WorkerProfile: { workerId: string };
  EmployerNotifications: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  const { role } = useAppStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {role === 'employer' ? (
        <>
          <Stack.Screen name="EmployerTabs" component={EmployerTabNavigator} />
          <Stack.Screen name="PostJob" component={PostJobScreen} />
          <Stack.Screen name="Applicants" component={ApplicantsScreen} />
          <Stack.Screen name="WorkerProfile" component={WorkerProfileScreen} />
          <Stack.Screen name="EmployerNotifications" component={EmployerNotificationsScreen} />
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
