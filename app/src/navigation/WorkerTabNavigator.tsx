import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FloatingTabBar } from './FloatingTabBar';

import { HomeScreen } from '@/screens/main/HomeScreen';
import { SearchScreen } from '@/screens/main/SearchScreen';
import { ApplicationsScreen } from '@/screens/main/ApplicationsScreen';
import { ProfileScreen } from '@/screens/main/ProfileScreen';
import { ConversationListScreen } from '@/screens/chat/ConversationListScreen';

export type WorkerTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  ApplicationsTab: undefined;
  ChatTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<WorkerTabParamList>();

export const WorkerTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={FloatingTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="ApplicationsTab" component={ApplicationsScreen} options={{ title: 'Applications' }} />
      <Tab.Screen name="ChatTab" component={ConversationListScreen} options={{ title: 'Chat' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};
