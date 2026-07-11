import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { Button, TextInput } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { MapPin, Navigation2, Shield, Zap, Eye } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import Geolocation from '@react-native-community/geolocation';
import { locationService } from '@/services/LocationService';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout, SlideInRight } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Map Preview ───────────────────────────────────────────
const MapPreview = () => (
  <Animated.View entering={FadeInDown.delay(100).duration(600).springify()} style={styles.mapContainer}>
    <LinearGradient
      colors={[colors.primaryGlow, colors.glass, colors.primaryGlow]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mapGradient}
    />
    {/* Grid lines to simulate a map */}
    {Array.from({ length: 5 }).map((_, i) => (
      <View
        key={`h-${i}`}
        style={[styles.mapLine, styles.mapLineH, { top: `${(i + 1) * 16.6}%` }]}
      />
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <View
        key={`v-${i}`}
        style={[styles.mapLine, styles.mapLineV, { left: `${(i + 1) * 16.6}%` }]}
      />
    ))}
    {/* Center pin */}
    <View style={styles.mapPinWrapper}>
      <View style={styles.mapPin}>
        <MapPin size={24} color={colors.primary} strokeWidth={2} />
      </View>
      <View style={styles.mapPinShadow} />
    </View>
  </Animated.View>
);

// ─── Benefit Item ────────────────────────────────────────────────────────
const BenefitItem = ({ icon: Icon, title, description, delay }: {
  icon: any; title: string; description: string; delay: number;
}) => (
  <Animated.View entering={FadeInUp.delay(delay).duration(500).springify()} style={styles.benefitItem}>
    <View style={styles.benefitIcon}>
      <Icon size={18} color={colors.primary} strokeWidth={1.5} />
    </View>
    <View style={styles.benefitContent}>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDesc}>{description}</Text>
    </View>
  </Animated.View>
);

export const LocationPermissionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
  const { setLocation, role, completeOnboarding } = useAppStore();
  
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [cityInput, setCityInput] = useState('');

  const locationPermission = Platform.OS === 'ios' 
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;


  const navigateNext = useCallback(() => {
    if (role === 'worker') {
      navigation.navigate('WorkerOnboarding');
    } else {
      completeOnboarding();
    }
  }, [role, navigation, completeOnboarding]);

  const fetchLocationAndProceed = useCallback(() => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const city = await locationService.getCityFromCoordinates({ latitude, longitude });
          if (city) {
            await setLocation(true, city);
            Toast.show({ type: 'success', text1: 'Location updated automatically!' });
            navigateNext();
          } else {
            setManualMode(true);
          }
        } catch {
          setManualMode(true);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.warn('Geolocation Error', error);
        Toast.show({ type: 'error', text1: 'Could not fetch location. Please enter manually.' });
        setManualMode(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [navigateNext, setLocation]);

  useEffect(() => {
    check(locationPermission).then((result) => {
      if (result === RESULTS.GRANTED) {
        fetchLocationAndProceed();
      }
    });
  }, [locationPermission, fetchLocationAndProceed]);

  const handleAllow = async () => {
    setLoading(true);
    try {
      const result = await request(locationPermission);
      if (result === RESULTS.GRANTED) {
        fetchLocationAndProceed();
      } else if (result === RESULTS.BLOCKED) {
        setLoading(false);
        Toast.show({ 
          type: 'error', 
          text1: 'Permission Denied',
          text2: 'Please enable location in Settings.' 
        });
        openSettings();
        setManualMode(true);
      } else {
        setLoading(false);
        setManualMode(true);
      }
    } catch {
      setLoading(false);
      setManualMode(true);
    }
  };

  const handleManualSubmit = async () => {
    if (cityInput.trim()) {
      await setLocation(false, cityInput.trim());
      navigateNext();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={StyleSheet.absoluteFill}
      />
      
      {!manualMode ? (
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Map Preview */}
          <MapPreview />

          {/* Header */}
          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.headerCentered}>
            <Text style={styles.titleCentered}>Find Opportunities Nearby</Text>
            <Text style={styles.subtitleCentered}>
              We use your location to connect you with nearby {role === 'worker' ? 'jobs' : 'workers'} in real time.
            </Text>
          </Animated.View>

          {/* Educational Benefits */}
          <View style={styles.benefitsSection}>
            <BenefitItem
              icon={Zap}
              title="Instant Matching"
              description={`Get matched with ${role === 'worker' ? 'jobs' : 'skilled workers'} within your area automatically.`}
              delay={500}
            />
            <BenefitItem
              icon={Navigation2}
              title="Distance-Based Results"
              description="See how far opportunities are so you can plan your day efficiently."
              delay={600}
            />
            <BenefitItem
              icon={Eye}
              title="Visibility Boost"
              description={`${role === 'worker' ? 'Employers' : 'Workers'} nearby will discover your profile first.`}
              delay={700}
            />
          </View>

          {/* Privacy Notice */}
          <Animated.View entering={FadeInUp.delay(800).duration(500)} style={styles.privacyCard}>
            <Shield size={16} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.privacyText}>
              Your location is encrypted and never shared publicly. We only use it to improve your experience.
            </Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View entering={FadeInUp.delay(900).duration(600).springify()} style={styles.footer}>
            <Button 
              title="Allow Location Access" 
              onPress={handleAllow} 
              loading={loading}
              icon={<Navigation2 size={20} color={colors.textPrimary} />}
              style={styles.primaryBtn}
            />
            <Button 
              title="Enter manually instead" 
              variant="text" 
              onPress={() => setManualMode(true)} 
              style={styles.skipBtn}
            />
          </Animated.View>
        </Animated.ScrollView>
      ) : (
        <Animated.View layout={Layout.springify()} style={styles.content} entering={SlideInRight.duration(400)}>
          <View style={styles.header}>
            <Text style={styles.title}>Where are you located?</Text>
            <Text style={styles.subtitle}>Enter your city so we can show you relevant opportunities.</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              label="City"
              value={cityInput}
              onChangeText={setCityInput}
              leftIcon={<MapPin size={20} color={colors.textSecondary} strokeWidth={1.5} />}
            />
            <Button title="Continue" onPress={handleManualSubmit} disabled={!cityInput.trim()} style={styles.submitBtn} />
          </View>
        </Animated.View>
      )}
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
    paddingTop: SCREEN_HEIGHT * 0.06,
    paddingBottom: metrics.spacing.xxl,
  },
  content: {
    flex: 1,
    padding: metrics.spacing.l,
    paddingTop: SCREEN_HEIGHT * 0.1,
  },

  // ─── Map Preview ──────────────────────────────────────
  mapContainer: {
    height: 180,
    borderRadius: metrics.radiusCard,
    overflow: 'hidden',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: metrics.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapGradient: {
    ...StyleSheet.absoluteFill,
  },
  mapLine: {
    position: 'absolute',
    backgroundColor: colors.border,
  },
  mapLineH: {
    left: 0,
    right: 0,
    height: 1,
  },
  mapLineV: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  mapPinWrapper: {
    alignItems: 'center',
  },
  mapPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    ...metrics.shadows.glow,
  },
  mapPinShadow: {
    width: 12,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryGlowStrong,
    marginTop: 4,
  },

  // ─── Header ───────────────────────────────────────────
  headerCentered: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
  },
  header: {
    marginBottom: metrics.spacing.xl,
  },
  titleCentered: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
    textAlign: 'center',
    letterSpacing: -1,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
    letterSpacing: -1,
  },
  subtitleCentered: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: metrics.spacing.s,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // ─── Benefits ─────────────────────────────────────────
  benefitsSection: {
    marginBottom: metrics.spacing.xl,
    gap: metrics.spacing.m,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.glass,
    borderRadius: metrics.radiusS,
    padding: metrics.spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  benefitDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // ─── Privacy ──────────────────────────────────────────
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.glass,
    borderRadius: metrics.radiusS,
    padding: metrics.spacing.m,
    marginBottom: metrics.spacing.xl,
    gap: metrics.spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
  },
  privacyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    flex: 1,
    lineHeight: 18,
  },

  // ─── Footer / Actions ────────────────────────────────
  form: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
  },
  primaryBtn: {
    width: '100%',
    marginBottom: metrics.spacing.m,
  },
  submitBtn: {
    marginTop: metrics.spacing.m,
  },
  skipBtn: {
    width: '100%',
  }
});
