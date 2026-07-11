import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

interface QuickActionCardProps {
  title: string;
  iconName: string;
  onPress: () => void;
  color?: string;
  badge?: number;
}

export const QuickActionCard = ({ title, iconName, onPress, color = colors.primary, badge }: QuickActionCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.iconContainer, { backgroundColor: color + '1A' }]}>
        <Icon name={iconName} size={24} color={color} />
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
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
    position: 'relative',
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  badgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.surface,
  },
});
