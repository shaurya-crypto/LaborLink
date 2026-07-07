import React, { useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '@/navigation/OnboardingNavigator';
import { ScreenContainer, Button, TextInput } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAppStore } from '@/store/useAppStore';
import Geolocation from '@react-native-community/geolocation';
import { locationService } from '@/services/LocationService';

export const LocationPermissionScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<OnboardingStackParamList>>();
  const { setLocation, role, completeOnboarding } = useAppStore();
  
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [cityInput, setCityInput] = useState('');

  const navigateNext = () => {
    if (role === 'worker') {
      navigation.navigate('WorkerOnboarding');
    } else {
      // Employers skip onboarding in phase 1.1 until they post a job
      completeOnboarding();
    }
  };

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'LaborLink needs access to your location to find nearby jobs and workers.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS is handled automatically by Geolocation.requestAuthorization
    return true; // Simplification for bare RN without proper iOS bridging check in this phase
  };

  const handleAllow = async () => {
    setLoading(true);
    try {
      const granted = await requestPermission();
      if (!granted) {
        setManualMode(true);
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const city = await locationService.getCityFromCoordinates({ latitude, longitude });
          if (city) {
            await setLocation(true, city);
            navigateNext();
          } else {
            // Geocoding failed, ask manually
            setManualMode(true);
          }
          setLoading(false);
        },
        (error) => {
          console.warn('Geolocation Error', error);
          setManualMode(true);
          setLoading(false);
        },
        { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
      );
    } catch (err) {
      setManualMode(true);
      setLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    if (cityInput.trim()) {
      await setLocation(false, cityInput.trim());
      navigateNext();
    }
  };

  if (manualMode) {
    return (
      <ScreenContainer backgroundColor={colors.surface} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Where are you located?</Text>
          <Text style={styles.subtitle}>Enter your city so we can show you relevant opportunities.</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            label="City"
            placeholder="e.g. Mumbai, New York"
            value={cityInput}
            onChangeText={setCityInput}
            rightIcon={<Icon name="map-pin" size={20} color={colors.textSecondary} />}
          />
          <Button title="Continue" onPress={handleManualSubmit} disabled={!cityInput.trim()} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={colors.surface} style={styles.container}>
      <View style={styles.headerCentered}>
        <View style={styles.iconWrapper}>
          <Icon name="map-pin" size={40} color={colors.primary} />
        </View>
        <Text style={styles.titleCentered}>Allow Location Access</Text>
        <Text style={styles.subtitleCentered}>
          We use your location to automatically connect you with nearby {role === 'worker' ? 'jobs' : 'workers'}.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Allow Location Access" 
          onPress={handleAllow} 
          loading={loading}
          icon={<Icon name="navigation" size={20} color={colors.surface} />}
          style={styles.primaryBtn}
        />
        <Button 
          title="Enter manually" 
          variant="text" 
          onPress={() => setManualMode(true)} 
          style={styles.skipBtn}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: metrics.spacing.l,
    justifyContent: 'space-between',
  },
  headerCentered: {
    alignItems: 'center',
    marginTop: metrics.spacing.xxl * 1.5,
  },
  header: {
    marginTop: metrics.spacing.xxl,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.l,
  },
  titleCentered: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
    textAlign: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xs,
  },
  subtitleCentered: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: metrics.spacing.m,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.xl,
  },
  form: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: metrics.spacing.l,
  },
  primaryBtn: {
    width: '100%',
    marginBottom: metrics.spacing.s,
  },
  skipBtn: {
    width: '100%',
    marginBottom: metrics.spacing.m,
  }
});
