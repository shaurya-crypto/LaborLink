import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { colors, typography } from '@/theme';

// Import employer screens
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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'home';
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'JobsTab') iconName = 'briefcase';
          else if (route.name === 'FindTab') iconName = 'search';
          else if (route.name === 'SavedTab') iconName = 'bookmark';
          else if (route.name === 'ProfileTab') iconName = 'user';

          return <Icon name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          backgroundColor: colors.surface,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.medium,
          fontSize: 10,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={EmployerHomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="JobsTab" component={ManageJobsScreen} options={{ tabBarLabel: 'Jobs' }} />
      <Tab.Screen name="FindTab" component={FindWorkersScreen} options={{ tabBarLabel: 'Find' }} />
      <Tab.Screen name="SavedTab" component={SavedWorkersScreen} options={{ tabBarLabel: 'Saved' }} />
      <Tab.Screen name="ProfileTab" component={EmployerProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};
