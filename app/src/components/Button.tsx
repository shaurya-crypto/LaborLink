import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, metrics, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutlined = variant === 'outlined';
  const isText = variant === 'text';

  const containerStyles = [
    styles.container,
    isPrimary && styles.primaryContainer,
    isSecondary && styles.secondaryContainer,
    isOutlined && styles.outlinedContainer,
    isText && styles.textContainer,
    disabled && styles.disabledContainer,
    style,
  ];

  const labelStyles = [
    styles.label,
    isPrimary && styles.primaryLabel,
    isSecondary && styles.secondaryLabel,
    isOutlined && styles.outlinedLabel,
    isText && styles.textLabel,
    disabled && styles.disabledLabel,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.surface : colors.primary} />
      ) : (
        <>
          {icon && icon}
          <Text style={labelStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: metrics.radiusButton,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.l,
    gap: metrics.spacing.s,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
  },
  
  // Primary
  primaryContainer: {
    backgroundColor: colors.primary,
    ...metrics.shadows.soft,
  },
  primaryLabel: {
    color: colors.surface,
  },
  
  // Secondary
  secondaryContainer: {
    backgroundColor: colors.secondaryBackground,
  },
  secondaryLabel: {
    color: colors.primaryDark,
  },

  // Outlined
  outlinedContainer: {
    backgroundColor: colors.transparent,
    borderWidth: 1.5,
    borderColor: colors.divider,
  },
  outlinedLabel: {
    color: colors.textPrimary,
  },

  // Text
  textContainer: {
    backgroundColor: colors.transparent,
    height: 'auto',
    paddingHorizontal: 0,
  },
  textLabel: {
    color: colors.primary,
  },

  // Disabled
  disabledContainer: {
    backgroundColor: colors.divider,
    borderColor: colors.transparent,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledLabel: {
    color: colors.textSecondary,
  },
});
