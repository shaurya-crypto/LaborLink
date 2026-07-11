import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, } from 'react-native-reanimated';
import { colors, metrics } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'glowing';
  padding?: keyof typeof metrics.spacing | number;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  onPress, 
  variant = 'default',
  padding = 'm'
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const paddingValue = typeof padding === 'number' ? padding : metrics.spacing[padding];

  const cardStyle = [
    styles.base,
    { padding: paddingValue },
    variant === 'default' && styles.default,
    variant === 'glass' && styles.glass,
    variant === 'glowing' && styles.glowing,
    style,
  ];

  if (onPress) {
    return (
      <TouchableWithoutFeedback 
        onPress={onPress} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut}
      >
        <Animated.View style={[animatedStyle, cardStyle]}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: metrics.radiusCard,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: colors.surface,
    ...metrics.shadows.card,
  },
  glass: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    ...metrics.shadows.glass,
  },
  glowing: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    ...metrics.shadows.glow,
  }
});
