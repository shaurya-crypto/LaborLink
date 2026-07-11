 
/* eslint-disable react-hooks/exhaustive-deps */
 
﻿import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { colors, metrics } from '@/theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ShimmerBlock = ({ width, height, borderRadius = metrics.radiusS, style }: any) => {
  const translateX = useSharedValue(-200);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width + 200, { duration: 1200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      -1,
      false
    );
  }, [width]);

  const animatedStyle = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFill,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[{ width, height, borderRadius, backgroundColor: colors.glass, overflow: 'hidden' }, style]}>
      <AnimatedLinearGradient
        colors={['transparent', colors.glassDense, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, animatedStyle]}
      />
    </View>
  );
};

export const LoadingSkeleton = ({ type = 'jobCard', width, height, style }: { type?: 'jobCard' | 'category' | 'profile' | 'custom', width?: number | string, height?: number | string, style?: any }) => {
  
  if (type === 'category') {
    return (
      <View style={{ flexDirection: 'row', gap: metrics.spacing.m }}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={{ alignItems: 'center' }}>
            <ShimmerBlock width={60} height={60} borderRadius={30} />
            <ShimmerBlock width={50} height={10} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>
    );
  }

  if (type === 'custom') {
    return (
      <ShimmerBlock width={width || '100%'} height={height || 100} style={style} />
    );
  }

  // default: jobCard
  return (
    <View>
      {[1, 2, 3].map(i => (
        <View key={i} style={styles.card}>
          <View style={styles.row}>
            <ShimmerBlock width={48} height={48} borderRadius={24} />
            <View style={{ flex: 1, marginLeft: 12, gap: 10 }}>
              <ShimmerBlock width={'80%'} height={16} />
              <ShimmerBlock width={'50%'} height={12} />
            </View>
          </View>
          <View style={[styles.row, { marginTop: 20, gap: 10 }]}>
            <ShimmerBlock width={80} height={28} borderRadius={14} />
            <ShimmerBlock width={70} height={28} borderRadius={14} />
          </View>
          <View style={[styles.row, { marginTop: 20, justifyContent: 'space-between' }]}>
            <ShimmerBlock width={100} height={20} />
            <ShimmerBlock width={100} height={40} borderRadius={20} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.m,
    ...metrics.shadows.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
