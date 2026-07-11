import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { Button, BottomSheet } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { Globe, Mail, Smartphone, Users, Briefcase, MapPin, Shield } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { authService } from '@/services/AuthService';
import { LightRays } from '@/components';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
  cancelAnimation,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Typing animation hook ────────────────────────────────────────────────
const useTypingAnimation = (texts: string[], typingSpeed = 60, pauseMs = 2200) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[currentIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < current.length) {
          setDisplayText(current.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseMs);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(current.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts, typingSpeed, pauseMs]);

  return displayText;
};


// ─── Stat Card ────────────────────────────────────────────────────────────
const StatItem = ({ icon: IconComponent, value, label, delay }: {
  icon: any; value: string; label: string; delay: number;
}) => (
  <Animated.View entering={FadeInUp.delay(delay).duration(500).springify()} style={styles.statItem}>
    <View style={styles.statIconWrapper}>
      <IconComponent size={18} color={colors.primary} strokeWidth={1.5} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Animated.View>
);

// ─── Social proof avatar row ─────────────────────────────────────────────
const SocialProof = () => {
  const avatarColors = [colors.primary, colors.accent, colors.secondaryBrand, colors.success, '#A78BFA'];
  return (
    <Animated.View entering={FadeIn.delay(1200).duration(600)} style={styles.socialProofContainer}>
      <View style={styles.avatarStack}>
        {avatarColors.map((c, i) => (
          <View key={i} style={[styles.avatar, i > 0 && { marginLeft: -12 }, { backgroundColor: c, zIndex: 5 - i }]}>
            <Text style={styles.avatarInitial}>{String.fromCharCode(65 + i)}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.socialProofText}>
        <Text style={styles.socialProofBold}>2,400+ </Text>
        workers joined this month
      </Text>
    </Animated.View>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────
export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [phoneSheetVisible, setPhoneSheetVisible] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { setAuth } = useAuthStore();
  const role = useAppStore((s) => s.role);

  const marketingMessages = [
    'Find skilled workers instantly',
    'Post jobs in under 60 seconds',
    'Trusted by 10,000+ employers',
    'Get hired near your location',
    'Verified profiles, real reviews',
  ];
  const typedText = useTypingAnimation(marketingMessages, 55, 2000);


  const handleGoogle = async () => {
    setLoadingGoogle(true);
    try {
      const response = await authService.loginWithGoogle(role || 'worker');
      await setAuth(response.user, response.token);
    } catch (error: any) {
      const msg = typeof error === 'string' ? error : (error?.message || 'Google login failed');
      Toast.show({ type: 'error', text1: 'Google Login Failed', text2: msg });
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleEmail = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Layered Gradient Background */}
      <LinearGradient
        colors={colors.gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={colors.gradients.heroGlow as string[]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Light Rays Background */}
      <LightRays />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ─── Hero Section ─────────────────────────────────── */}
        <Animated.View entering={FadeInDown.duration(700).springify()} style={styles.heroSection}>
          <Text style={styles.title}>
            Labor<Text style={styles.titleHighlight}>Link</Text>
          </Text>
          <Text style={styles.tagline}>The premium network for modern work.</Text>

          {/* Typing Animation */}
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>
              {typedText}
              <Text style={styles.cursor}>|</Text>
            </Text>
          </View>
        </Animated.View>

        {/* ─── Statistics Section ──────────────────────────── */}
        <View style={styles.statsRow}>
          <StatItem icon={Users} value="10K+" label="Workers" delay={600} />
          <StatItem icon={Briefcase} value="5K+" label="Jobs" delay={700} />
          <StatItem icon={MapPin} value="120+" label="Cities" delay={800} />
          <StatItem icon={Shield} value="99.9%" label="Uptime" delay={900} />
        </View>

        {/* ─── Social Proof ───────────────────────────────── */}
        <SocialProof />

        {/* ─── CTA Card ───────────────────────────────────── */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(700).springify()}
          style={styles.actionContainer}
        >
          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>Get Started</Text>

            <View style={styles.buttonGroup}>
              <Button
                title="Continue with Google"
                variant="secondary"
                onPress={handleGoogle}
                loading={loadingGoogle}
                icon={<Globe size={20} color={colors.textPrimary} />}
              />
              <Button
                title="Continue with Email"
                variant="secondary"
                onPress={handleEmail}
                icon={<Mail size={20} color={colors.textPrimary} />}
              />
              <Button
                title="Continue with Phone"
                variant="secondary"
                onPress={() => setPhoneSheetVisible(true)}
                icon={<Smartphone size={20} color={colors.textPrimary} />}
              />
            </View>

            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      <BottomSheet
        visible={phoneSheetVisible}
        onClose={() => setPhoneSheetVisible(false)}
        title="Phone Verification"
        description="We're working hard to bring you a secure and seamless phone verification experience in a future update. Stay tuned!"
        primaryAction={{
          title: 'Got it',
          onPress: () => setPhoneSheetVisible(false),
        }}
      >
        <View style={styles.sheetIconWrapper}>
          <Smartphone size={40} color={colors.primary} />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: metrics.spacing.l,
    paddingTop: SCREEN_HEIGHT * 0.1,
    paddingBottom: metrics.spacing.xxl,
  },

  // ─── Hero ──────────────────────────────────────────────
  heroSection: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: 52,
    color: colors.textPrimary,
    letterSpacing: -2,
  },
  titleHighlight: {
    color: colors.primary,
  },
  tagline: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.l,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  typingContainer: {
    height: 32,
    marginTop: metrics.spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.primary,
    letterSpacing: -0.3,
  },
  cursor: {
    color: colors.primary,
    fontFamily: typography.fontFamily.regular,
  },

  // ─── Stats ─────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.l,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: metrics.spacing.m,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.s,
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ─── Social Proof ─────────────────────────────────────
  socialProofContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: metrics.spacing.xl,
    gap: metrics.spacing.m,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  avatarInitial: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: colors.textPrimary,
  },
  socialProofText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  socialProofBold: {
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },

  // ─── CTA Card ──────────────────────────────────────────
  actionContainer: {
    width: '100%',
  },
  glassCard: {
    backgroundColor: colors.glass,
    borderRadius: metrics.radiusBottomSheet,
    padding: metrics.spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...metrics.shadows.glass,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.l,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  buttonGroup: {
    gap: metrics.spacing.m,
  },
  footerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: metrics.spacing.xl,
    lineHeight: 20,
  },
  linkText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semiBold,
  },
  sheetIconWrapper: {
    alignItems: 'center',
    marginBottom: metrics.spacing.l,
  },
});
