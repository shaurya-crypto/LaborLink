import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WorkerTabNavigator } from './WorkerTabNavigator';
import { JobDetailsScreen } from '@/screens/main/JobDetailsScreen';
import { NotificationsScreen } from '@/screens/main/NotificationsScreen';
import { SavedJobsScreen } from '@/screens/main/SavedJobsScreen';
import { ActivityScreen } from '@/screens/main/ActivityScreen';
import { ConversationListScreen } from '@/screens/chat/ConversationListScreen';
import { ChatRoomScreen } from '@/screens/chat/ChatRoomScreen';
import { useAppStore } from '@/store/useAppStore';


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
  ConversationList: undefined;
  ChatRoom: { conversationId: string };
  Activity: undefined;

  EmployerTabs: undefined;
  PostJob: undefined;
  Applicants: { jobId: string, jobTitle?: string };
  WorkerProfile: { workerId: string };
  EmployerNotifications: undefined;
  EmployerConversationList: undefined;
  EmployerChatRoom: { conversationId: string };
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
          <Stack.Screen name="EmployerConversationList" component={ConversationListScreen} />
          <Stack.Screen name="EmployerChatRoom" component={ChatRoomScreen} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="WorkerTabs" component={WorkerTabNavigator} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
          <Stack.Screen name="ConversationList" component={ConversationListScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          <Stack.Screen name="Activity" component={ActivityScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
