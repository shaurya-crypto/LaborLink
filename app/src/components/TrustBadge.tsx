import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

export type TrustBadgeVariant = 
  | 'verified-profile'
  | 'verified-phone'
  | 'verified-email'
  | 'response-time'
  | 'jobs-completed'
  | 'hiring-success';

interface TrustBadgeProps {
  variant: TrustBadgeVariant;
  value?: string | number;
  style?: ViewStyle;
}

export const TrustBadge = ({ variant, value, style }: TrustBadgeProps) => {
  const getBadgeConfig = () => {
    switch (variant) {
      case 'verified-profile':
        return {
          icon: 'check-circle',
          color: colors.success,
          bgColor: colors.success + '10',
          text: 'Verified Profile',
        };
      case 'verified-phone':
        return {
          icon: 'phone-call',
          color: colors.primary,
          bgColor: colors.primary + '10',
          text: 'Phone Verified',
        };
      case 'verified-email':
        return {
          icon: 'mail',
          color: colors.info,
          bgColor: colors.info + '10',
          text: 'Email Verified',
        };
      case 'response-time':
        return {
          icon: 'zap',
          color: colors.warning,
          bgColor: colors.warning + '10',
          text: value ? `Replies in ${value}` : 'Replies in <1 hr',
        };
      case 'jobs-completed':
        return {
          icon: 'award',
          color: colors.primaryDark,
          bgColor: colors.primaryDark + '10',
          text: value ? `${value} Jobs Done` : '12 Jobs Done',
        };
      case 'hiring-success':
        return {
          icon: 'trending-up',
          color: colors.success,
          bgColor: colors.success + '10',
          text: value ? `${value} Success` : '98% Hiring Success',
        };
      default:
        return {
          icon: 'shield',
          color: colors.textSecondary,
          bgColor: colors.secondaryBackground,
          text: 'Trusted',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View 
      style={[
        styles.badge, 
        { backgroundColor: config.bgColor, borderColor: config.color + '33' },
        style
      ]}
    >
      <Icon name={config.icon} size={13} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{config.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: metrics.radiusPill,
    borderWidth: 1,
    gap: 5,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 11,
  },
});
