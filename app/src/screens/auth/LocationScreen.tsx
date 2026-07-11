import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { ScreenContainer, Button } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

export const LocationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleAllow = () => {
    // In real app, prompt OS permission dialog here
    navigation.navigate('Welcome');
  };

  const handleSkip = () => {
    navigation.navigate('Welcome');
  };

  return (
    <ScreenContainer backgroundColor={colors.surface} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Icon name="map-pin" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>Allow Location Access</Text>
        <Text style={styles.subtitle}>
          We use your location to show nearby jobs and speed up your job discovery.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Allow Location Access" 
          onPress={handleAllow} 
          icon={<Icon name="navigation" size={20} color={colors.surface} />}
          style={styles.primaryBtn}
        />
        <Button 
          title="Skip for now" 
          variant="text" 
          onPress={handleSkip} 
          style={styles.skipBtn}
        />
        <Text style={styles.footerText}>You can change it later in Settings</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: metrics.spacing.l,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: metrics.spacing.xxl * 1.5,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.l,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: metrics.spacing.m,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: metrics.spacing.l,
  },
  primaryBtn: {
    width: '100%',
    marginBottom: metrics.spacing.s,
  },
  skipBtn: {
    width: '100%',
    marginBottom: metrics.spacing.m,
  },
  footerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  }
});
