/* eslint-disable @typescript-eslint/no-unused-vars */
 
 
﻿import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { colors, metrics } from '@/theme';

interface ShimmerPlaceholderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const ShimmerPlaceholder: React.FC<ShimmerPlaceholderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = metrics.radiusS,
  style,
}) => {
  const translateX = useSharedValue(-300);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(300, { duration: 1200, easing: Easing.linear }),
      -1,
      false
    );
  }, [translateX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { width: width as any, height, borderRadius }, style]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', colors.glassDense, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

interface SkeletonCardProps {
  lines?: number;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 3, style }) => {
  return (
    <View style={[styles.skeletonCard, style]}>
      <View style={styles.skeletonHeader}>
        <ShimmerPlaceholder width={48} height={48} borderRadius={24} />
        <View style={styles.skeletonHeaderText}>
          <ShimmerPlaceholder width="60%" height={16} />
          <ShimmerPlaceholder width="40%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      {Array.from({ length: lines }).map((_, i) => (
        <ShimmerPlaceholder
          key={i}
          width={i === lines - 1 ? '75%' : '100%'}
          height={14}
          style={{ marginTop: metrics.spacing.m }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  shimmer: {
    width: 200,
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    flex: 1,
    width: 200,
  },
  skeletonCard: {
    backgroundColor: colors.glass,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonHeaderText: {
    flex: 1,
    marginLeft: metrics.spacing.m,
  },
});
