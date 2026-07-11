import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { colors, typography, metrics } from '@/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: any;
}

const getVariantStyles = (variant: BadgeVariant) => {
  switch (variant) {
    case 'success': return { border: colors.success + '40', bg: colors.success + '15', text: colors.success };
    case 'warning': return { border: colors.warning + '40', bg: colors.warning + '15', text: colors.warning };
    case 'error': return { border: colors.error + '40', bg: colors.error + '15', text: colors.error };
    case 'info': return { border: colors.accent + '40', bg: colors.accent + '15', text: colors.accent };
    case 'primary': return { border: colors.primary + '50', bg: colors.primary + '20', text: colors.primary };
    case 'neutral':
    default: return { border: colors.border, bg: colors.glass, text: colors.textSecondary };
  }
};

export const StatusBadge = ({ label, variant = 'neutral', style }: StatusBadgeProps) => {
  const vs = getVariantStyles(variant);
  
  return (
    <View style={[styles.container, { backgroundColor: vs.bg, borderColor: vs.border }, style]}>
      <Text style={[styles.label, { color: vs.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: 6,
    borderRadius: metrics.radiusPill,
    borderWidth: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 11,
    letterSpacing: 0.5,
  }
});
