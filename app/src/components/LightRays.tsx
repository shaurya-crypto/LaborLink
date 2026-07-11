import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme';

const { width, height } = Dimensions.get('window');

// Number of rays to render
const RAYS_COUNT = 8;
// Angles spread from -45 to +45 degrees
const angles = Array.from({ length: RAYS_COUNT }).map((_, i) => -45 + i * (90 / (RAYS_COUNT - 1)));

const Ray = ({ angle, delay }: { angle: number; delay: number }) => {
  const opacity = useSharedValue(0.1);

  useEffect(() => {
    // A pulsing effect that breathes opacity in and out smoothly
    opacity.value = withSequence(
      withTiming(0.1, { duration: delay }), // initial delay offset
      withRepeat(
        withTiming(0.4, { duration: 3000 + Math.random() * 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.rayContainer,
        animatedStyle,
        {
          transform: [
            { translateX: -40 }, // half of width to center
            { rotate: `${angle}deg` },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={[colors.primary, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />
    </Animated.View>
  );
};

export const LightRays = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Origin glow at top center */}
      <View style={styles.originGlow} />

      <View style={styles.raysWrapper}>
        {angles.map((angle, i) => (
          <Ray key={i} angle={angle} delay={i * 300} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  raysWrapper: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center', // centers children horizontally
    overflow: 'hidden',
  },
  rayContainer: {
    position: 'absolute',
    top: -height * 0.1, // slightly above the screen
    left: '50%',
    width: 80, // width of the beam
    height: height * 0.8, // length of the beam
    // Pivot from top center
    transformOrigin: 'top center',
  },
  gradient: {
    flex: 1,
  },
  originGlow: {
    position: 'absolute',
    top: -60,
    left: width / 2 - 100,
    width: 200,
    height: 120,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.4,
    transform: [{ scaleX: 2 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 20,
  }
});
