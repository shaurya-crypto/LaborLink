import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, metrics } from '@/theme';

export const LoadingSkeleton = ({ type = 'jobCard' }: { type?: 'jobCard' | 'category' | 'profile' }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  if (type === 'category') {
    return (
      <View style={{ flexDirection: 'row', gap: metrics.spacing.m }}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={{ alignItems: 'center' }}>
            <Animated.View style={[styles.skeletonBlock, { width: 60, height: 60, borderRadius: 30, opacity }]} />
            <Animated.View style={[styles.skeletonBlock, { width: 50, height: 10, marginTop: 8, opacity }]} />
          </View>
        ))}
      </View>
    );
  }

  // default: jobCard
  return (
    <View>
      {[1, 2].map(i => (
        <View key={i} style={styles.card}>
          <View style={styles.row}>
            <Animated.View style={[styles.skeletonBlock, { width: 44, height: 44, opacity }]} />
            <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
              <Animated.View style={[styles.skeletonBlock, { width: '70%', height: 14, opacity }]} />
              <Animated.View style={[styles.skeletonBlock, { width: '40%', height: 10, opacity }]} />
            </View>
          </View>
          <View style={[styles.row, { marginTop: 16, gap: 8 }]}>
            <Animated.View style={[styles.skeletonBlock, { width: 80, height: 24, borderRadius: 12, opacity }]} />
            <Animated.View style={[styles.skeletonBlock, { width: 60, height: 24, borderRadius: 12, opacity }]} />
          </View>
          <View style={[styles.row, { marginTop: 16, justifyContent: 'space-between' }]}>
            <Animated.View style={[styles.skeletonBlock, { width: 100, height: 20, opacity }]} />
            <Animated.View style={[styles.skeletonBlock, { width: 80, height: 32, borderRadius: 16, opacity }]} />
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonBlock: {
    backgroundColor: colors.divider,
    borderRadius: metrics.radiusS,
  }
});
