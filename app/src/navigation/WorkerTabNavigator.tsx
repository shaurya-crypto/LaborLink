import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { colors, typography, metrics } from '@/theme';

import { HomeScreen } from '@/screens/main/HomeScreen';
import { SearchScreen } from '@/screens/main/SearchScreen';
import { ApplicationsScreen } from '@/screens/main/ApplicationsScreen';
import { ProfileScreen } from '@/screens/main/ProfileScreen';
import { ChatScreen } from '@/screens/main/Placeholders';

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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'SearchTab') iconName = 'search';
          else if (route.name === 'ApplicationsTab') iconName = 'briefcase';
          else if (route.name === 'ChatTab') iconName = 'message-circle';
          else if (route.name === 'ProfileTab') iconName = 'user';

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.medium,
          fontSize: 10,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="ApplicationsTab" component={ApplicationsScreen} options={{ title: 'Applications' }} />
      <Tab.Screen name="ChatTab" component={ChatScreen} options={{ title: 'Chat' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};
