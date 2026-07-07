import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { colors } from '@/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  lightStatus?: boolean;
  noSafeArea?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  backgroundColor = colors.background,
  lightStatus = false,
  noSafeArea = false,
}) => {
  const content = (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, style]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, style]}>{children}</View>
      )}
    </KeyboardAvoidingView>
  );

  const Container = noSafeArea ? View : SafeAreaView;

  return (
    <Container style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={lightStatus ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundColor}
      />
      {content}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
