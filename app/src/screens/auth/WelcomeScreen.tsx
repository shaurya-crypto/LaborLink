import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { ScreenContainer, Button, BottomSheet } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/AuthService';

export const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [phoneSheetVisible, setPhoneSheetVisible] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const { setAuth } = useAuthStore();

  const handleGoogle = async () => {
    setLoadingGoogle(true);
    try {
      const response = await authService.loginWithGoogle();
      await setAuth(response.user, response.token);
    } catch (error) {
      console.log('Google login failed', error);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleEmail = () => {
    navigation.navigate('Login');
  };

  return (
    <ScreenContainer backgroundColor={colors.surface} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.brandTitle}>LaborLink</Text>
        <Text style={styles.subtitle}>Get started by signing in to your account</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button 
          title="Continue with Google" 
          variant="outlined" 
          onPress={handleGoogle} 
          style={styles.socialBtn}
          loading={loadingGoogle}
          icon={<Icon name="chrome" size={20} color={colors.textPrimary} />}
        />
        <Button 
          title="Continue with Email" 
          variant="outlined" 
          onPress={handleEmail} 
          style={styles.socialBtn}
          icon={<Icon name="mail" size={20} color={colors.textPrimary} />}
        />
        <Button 
          title="Phone Number (Coming Soon)" 
          variant="outlined" 
          onPress={() => setPhoneSheetVisible(true)} 
          style={styles.socialBtn}
          icon={<Icon name="smartphone" size={20} color={colors.textPrimary} />}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{'\n'}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>

      <BottomSheet
        visible={phoneSheetVisible}
        onClose={() => setPhoneSheetVisible(false)}
        title="Phone Verification Coming Soon"
        description="We're working hard to bring you a secure and seamless phone verification experience in a future update. Stay tuned!"
        primaryAction={{
          title: "Got it",
          onPress: () => setPhoneSheetVisible(false)
        }}
      >
        <View style={styles.sheetIconWrapper}>
          <Icon name="smartphone" size={40} color={colors.primary} />
        </View>
      </BottomSheet>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: metrics.spacing.l,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: metrics.spacing.xxl * 1.5,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
  },
  brandTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.primary,
    marginBottom: metrics.spacing.s,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginTop: metrics.spacing.s,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'center',
    gap: metrics.spacing.m,
  },
  socialBtn: {
    justifyContent: 'flex-start',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: metrics.spacing.l,
  },
  footerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
  sheetIconWrapper: {
    alignItems: 'center',
    marginBottom: metrics.spacing.l,
  },
});
