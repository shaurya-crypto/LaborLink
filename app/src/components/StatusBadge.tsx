import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, metrics } from '@/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: any;
}

const getVariantStyles = (variant: BadgeVariant) => {
  switch (variant) {
    case 'success': return { bg: '#E8F5E9', text: '#2E7D32' };
    case 'warning': return { bg: '#FFF8E1', text: '#F57F17' };
    case 'error': return { bg: '#FFEBEE', text: '#C62828' };
    case 'info': return { bg: '#E3F2FD', text: '#1565C0' };
    case 'primary': return { bg: colors.primary + '1A', text: colors.primaryDark };
    case 'neutral':
    default: return { bg: colors.secondaryBackground, text: colors.textSecondary };
  }
};

export const StatusBadge = ({ label, variant = 'neutral', style }: StatusBadgeProps) => {
  const vs = getVariantStyles(variant);
  
  return (
    <View style={[styles.container, { backgroundColor: vs.bg }, style]}>
      <Text style={[styles.label, { color: vs.text }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.spacing.s,
    paddingVertical: 4,
    borderRadius: metrics.radiusS,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
