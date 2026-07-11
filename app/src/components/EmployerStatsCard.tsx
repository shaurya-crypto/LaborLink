import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, metrics } from '@/theme';

interface EmployerStatsCardProps {
  label: string;
  value: number;
}

export const EmployerStatsCard = ({ label, value }: EmployerStatsCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.m,
    flex: 1,
    minWidth: 100,
    marginRight: metrics.spacing.m,
    ...metrics.shadows.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.primary,
    marginBottom: 4,
  },
  label: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  }
});
