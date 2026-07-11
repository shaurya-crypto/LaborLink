import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, View, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors, metrics, typography } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text' | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  gradient?: string[];
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  gradient = colors.gradients.primary,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutlined = variant === 'outlined';
  const isText = variant === 'text';
  const isDanger = variant === 'danger';

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    // Premium spring physics: scale down to 0.97 on press
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    if (isSecondary || isOutlined || isText) {
      opacity.value = withTiming(0.6, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    if (isSecondary || isOutlined || isText) {
      opacity.value = withTiming(1, { duration: 250 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  const containerStyles: any = [
    styles.container,
    isSecondary && styles.secondaryContainer,
    isOutlined && styles.outlinedContainer,
    isText && styles.textContainer,
    isDanger && styles.dangerContainer,
    style,
  ];

  const labelStyles: any = [
    styles.label,
    isPrimary && styles.primaryLabel,
    isSecondary && styles.secondaryLabel,
    isOutlined && styles.outlinedLabel,
    isText && styles.textLabel,
    isDanger && styles.dangerLabel,
    textStyle,
  ];

  const content = (
    <>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : colors.primary} />
      ) : (
        <Text style={labelStyles}>{title}</Text>
      )}
    </>
  );

  if (isPrimary) {
    return (
      <AnimatedPressable
        style={[animatedStyle, style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={loading || disabled}
        android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.container, styles.primaryContainer]}
        >
          {content}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      style={[containerStyles, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      android_ripple={{ color: isDanger ? colors.error + '40' : colors.primary + '20', borderless: false }}
    >
      {content}
    </AnimatedPressable>
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
    minWidth: metrics.touchTarget,
  },
  iconContainer: {
    marginRight: metrics.spacing.s,
  },
  label: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    letterSpacing: -0.3, // Modern tight tracking for premium feel
  },
  
  // Primary Gradient Button
  primaryContainer: {
    borderWidth: 0,
    ...metrics.shadows.glow, // Uses the new Electric Blue glow shadow
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  
  // Secondary Glassmorphic Button
  secondaryContainer: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryLabel: {
    color: colors.textPrimary,
  },

  // Outlined
  outlinedContainer: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.border,
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

  // Danger
  dangerContainer: {
    backgroundColor: colors.error + '20',
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  dangerLabel: {
    color: colors.error,
  },
});
