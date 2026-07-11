import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

interface CategoryCardProps {
  name: string;
  iconName: string;
  onPress: () => void;
  selected?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const CategoryCard = ({ name, iconName, onPress, selected = false }: CategoryCardProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable 
      style={[styles.container, selected && styles.containerSelected, animatedStyle]} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View style={[styles.iconWrapper, selected && styles.iconWrapperSelected]}>
        <Icon name={iconName} size={28} color={selected ? colors.primary : colors.textPrimary} />
      </View>
      <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={1}>
        {name}
      </Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 84, // Slightly wider
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  containerSelected: {
    // Optional container styles for selection
  },
  iconWrapper: {
    width: 64, // Larger touch target
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.s,
    ...metrics.shadows.soft,
  },
  iconWrapperSelected: {
    backgroundColor: colors.primary + '15',
    ...metrics.shadows.medium, // Glowing shadow for selected
  },
  name: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2, // Larger font
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameSelected: {
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.bold,
  }
});
