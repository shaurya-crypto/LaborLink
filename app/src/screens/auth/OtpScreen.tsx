/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-return-assign */
﻿import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { Button, ScreenContainer } from '@/components';
import { colors, metrics, typography } from '@/theme';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { authService } from '@/services/AuthService';
import { useAuthStore } from '@/store/useAuthStore';

type OtpRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

export const OtpScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<OtpRouteProp>();
  const { email, mode } = route.params; // mode: 'register' | 'forgot'
  
  const { setAuth } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<RNTextInput | null>>([]);
  const shakeOffset = useSharedValue(0);

  const focusNext = (index: number, value: string) => {
    if (index < 5 && value) {
      inputs.current[index + 1]?.focus();
    }
  };

  const focusPrev = (key: string, index: number) => {
    if (key === 'Backspace' && index > 0 && !code[index]) {
      inputs.current[index - 1]?.focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    focusNext(index, value);
  };

  const shakeAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }]
  }));

  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleVerify = async () => {
    const otp = code.join('');
    if (otp.length < 6) {
      triggerShake();
      Toast.show({ type: 'error', text1: 'Invalid Code', text2: 'Please enter all 6 digits.' });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const response = await authService.verifyEmail(email, otp);
        await setAuth(response.user, response.token);
        // App will automatically switch to Onboarding or Main via AppNavigator
      } else {
        const resetToken = await authService.verifyResetOtp(email, otp);
        // Assuming we would pass this token to a ResetPassword screen, but since we don't have one, we just show success.
        Toast.show({ type: 'success', text1: 'OTP Verified', text2: 'You can now reset your password.' });
        // navigation.navigate('ResetPassword', { resetToken }); // Needs implementation
        navigation.goBack();
      }
    } catch (e: any) {
      triggerShake();
      Toast.show({ type: 'error', text1: 'Verification Failed', text2: e.message || 'Invalid OTP' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{'\n'}
            <Text style={{ color: colors.primary }}>{email}</Text>
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={[styles.form, shakeAnimation]}>
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <View key={index} style={[styles.otpBox, digit ? styles.otpBoxActive : null]}>
                <RNTextInput
                  ref={(ref: any) => { inputs.current[index] = ref; }}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => handleChange(val, index)}
                  onKeyPress={({ nativeEvent }) => focusPrev(nativeEvent.key, index)}
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>
          
          <Button 
            title="Verify Code" 
            onPress={handleVerify} 
            loading={loading}
            style={styles.submitBtn} 
          />

          <Button 
            title="Resend Code" 
            variant="text" 
            onPress={() => {
              Toast.show({ type: 'info', text1: 'Code Resent', text2: 'Please check your email.' });
            }} 
            style={styles.resendBtn} 
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: metrics.spacing.l,
    justifyContent: 'center',
  },
  header: {
    marginBottom: metrics.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    backgroundColor: colors.glass,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...metrics.shadows.glass,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.xl,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderRadius: metrics.radiusS,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryGlow,
    ...metrics.shadows.glow,
  },
  otpInput: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  submitBtn: {
    width: '100%',
    marginBottom: metrics.spacing.m,
  },
  resendBtn: {
    width: '100%',
  }
});
