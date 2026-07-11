import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { Layout } from 'react-native-reanimated';
import { colors, metrics, typography } from '@/theme';

interface PasswordStrengthProps {
  password: string;
}

const getStrength = (password: string): { level: number; label: string; color: string } => {
  if (!password) return { level: 0, label: '', color: colors.transparent };
  
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Weak', color: colors.error };
  if (score <= 2) return { level: 2, label: 'Fair', color: colors.warning };
  if (score <= 3) return { level: 3, label: 'Good', color: colors.info };
  if (score <= 4) return { level: 4, label: 'Strong', color: colors.success };
  return { level: 5, label: 'Very Strong', color: colors.success };
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { level, label, color } = getStrength(password);
  
  if (!password) return null;

  const segments = 5;
  
  return (
    <Animated.View style={styles.container} layout={Layout.springify()}>
      <View style={styles.barContainer}>
        {Array.from({ length: segments }).map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: i < level ? color : colors.glass,
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.spacing.s,
    marginBottom: metrics.spacing.m,
  },
  barContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: metrics.spacing.xs,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    textAlign: 'right',
  },
});
