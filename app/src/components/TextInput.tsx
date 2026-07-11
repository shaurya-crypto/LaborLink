/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
 
﻿import React, { useState, useEffect } from 'react';
import { View, TextInput as RNTextInput, StyleSheet, TextInputProps, ViewStyle, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, interpolateColor } from 'react-native-reanimated';
import { colors, metrics, typography } from '@/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export const TextInput: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  rightIcon,
  leftIcon,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value && value.length > 0);
  
  // Reanimated values
  const floatAnim = useSharedValue(isFloating ? 1 : 0);

  useEffect(() => {
    floatAnim.value = withTiming(isFloating ? 1 : 0, { duration: 200 });
  }, [isFloating]);

  const labelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: floatAnim.value * -14 },
        { scale: 1 - floatAnim.value * 0.15 }
      ],
      color: error 
        ? colors.error 
        : isFocused ? colors.primary : colors.textMuted,
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor: error
        ? colors.error
        : isFocused
        ? colors.primary
        : colors.border,
      backgroundColor: isFocused ? colors.surface : colors.glass,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.inputContainer, borderStyle]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        
        <View style={styles.inputWrapper}>
          <Animated.Text 
            style={[styles.floatingLabel, labelStyle]}
            pointerEvents="none"
          >
            {label}
          </Animated.Text>
          
          <RNTextInput
            style={[
              styles.input, 
              // Push text down slightly when floating
              { paddingTop: isFloating ? 16 : 0, paddingBottom: isFloating ? 0 : 0 }
            ]}
            placeholderTextColor={colors.transparent} // Use floating label instead
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}
            {...props}
          />
        </View>

        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </Animated.View>
      
      {error && (
        <Animated.Text style={styles.errorText}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: metrics.spacing.m,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 1,
    borderRadius: metrics.radiusInput,
    paddingHorizontal: metrics.spacing.m,
  },
  leftIconContainer: {
    marginRight: metrics.spacing.s,
  },
  rightIconContainer: {
    marginLeft: metrics.spacing.s,
  },
  inputWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  floatingLabel: {
    position: 'absolute',
    left: 0,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    height: '100%',
  },
  errorText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.error,
    marginTop: metrics.spacing.xs,
    marginLeft: metrics.spacing.xs,
  },
});
