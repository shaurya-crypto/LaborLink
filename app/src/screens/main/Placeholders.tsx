import React from 'react';
import { View, StyleSheet } from 'react-native';
import { EmptyState, ScreenContainer } from '@/components';
import { colors } from '@/theme';

export const ApplicationsScreen = () => {
  return (
    <ScreenContainer backgroundColor={colors.background}>
      <EmptyState title="Applications Coming Soon" icon="file-text" />
    </ScreenContainer>
  );
};

export const SavedJobsScreen = () => {
  return (
    <ScreenContainer backgroundColor={colors.background}>
      <EmptyState title="Saved Jobs Coming Soon" icon="bookmark" />
    </ScreenContainer>
  );
};

export const NotificationsScreen = () => {
  return (
    <ScreenContainer backgroundColor={colors.background}>
      <EmptyState title="Notifications Coming Soon" icon="bell" />
    </ScreenContainer>
  );
};

export const ProfileScreen = () => {
  return (
    <ScreenContainer backgroundColor={colors.background}>
      <EmptyState title="Profile Coming Soon" icon="user" />
    </ScreenContainer>
  );
};

export const ChatScreen = () => {
  return (
    <ScreenContainer backgroundColor={colors.background}>
      <EmptyState title="Chat Coming Soon" icon="message-circle" />
    </ScreenContainer>
  );
};
