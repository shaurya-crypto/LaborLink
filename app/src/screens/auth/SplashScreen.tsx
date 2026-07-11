import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';
import { Link2 } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      ),
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(0.95, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
          )
        }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View style={[styles.logoContainer, pulseStyle]}>
        <Animated.View entering={FadeInDown.duration(800).springify()}>
          <View style={styles.iconWrapper}>
            <Link2 size={48} color={colors.primary} strokeWidth={2} />
          </View>
        </Animated.View>
        
        <Animated.Text entering={FadeInDown.delay(200).duration(800).springify()} style={styles.brand}>
          Labor<Text style={styles.brandHighlight}>Link</Text>
        </Animated.Text>
        
        <Animated.Text entering={FadeIn.delay(600).duration(800)} style={styles.tagline}>
          The premium network for modern work.
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  brand: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 42,
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  brandHighlight: {
    color: colors.primary,
  },
  tagline: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginTop: 12,
    letterSpacing: -0.2,
  },
});
