import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

interface QuickActionCardProps {
  title: string;
  iconName: string;
  onPress: () => void;
  color?: string;
}

export const QuickActionCard = ({ title, iconName, onPress, color = colors.primary }: QuickActionCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.iconContainer, { backgroundColor: color + '1A' }]}>
        <Icon name={iconName} size={24} color={color} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.m,
    flex: 1,
    minWidth: 140,
    marginRight: metrics.spacing.m,
    ...metrics.shadows.soft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: metrics.spacing.s,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.textPrimary,
    textAlign: 'center',
  }
});
