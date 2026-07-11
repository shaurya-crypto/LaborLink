import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme';

interface OnlineBadgeProps {
  size?: number;
  hasBorder?: boolean;
}

export const OnlineBadge = ({ size = 12, hasBorder = true }: OnlineBadgeProps) => {
  return (
    <View 
      style={[
        styles.badge, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderWidth: hasBorder ? 1.5 : 0,
        }
      ]} 
    />
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.success,
    borderColor: colors.surface,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
