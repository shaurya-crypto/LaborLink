import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FloatingTabBar } from './FloatingTabBar';

import { EmployerHomeScreen } from '@/screens/employer/EmployerHomeScreen';
import { ManageJobsScreen } from '@/screens/employer/ManageJobsScreen';
import { FindWorkersScreen } from '@/screens/employer/FindWorkersScreen';
import { SavedWorkersScreen } from '@/screens/employer/SavedWorkersScreen';
import { EmployerProfileScreen } from '@/screens/employer/EmployerProfileScreen';

export type EmployerTabParamList = {
  HomeTab: undefined;
  JobsTab: undefined;
  FindTab: undefined;
  SavedTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<EmployerTabParamList>();

export const EmployerTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={FloatingTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="HomeTab" component={EmployerHomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="JobsTab" component={ManageJobsScreen} options={{ title: 'Jobs' }} />
      <Tab.Screen name="FindTab" component={FindWorkersScreen} options={{ title: 'Find' }} />
      <Tab.Screen name="SavedTab" component={SavedWorkersScreen} options={{ title: 'Saved' }} />
      <Tab.Screen name="ProfileTab" component={EmployerProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};
