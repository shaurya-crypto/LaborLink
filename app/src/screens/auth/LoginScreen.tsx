import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { Button, TextInput, LightRays } from '@/components';
import { PasswordStrength } from '@/components/PasswordStrength';
import { colors, metrics, typography } from '@/theme';
import { ChevronLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { authService } from '@/services/AuthService';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [isLogin, setIsLogin] = useState(false); 
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  
  const { setAuth } = useAuthStore();
  const role = useAppStore((s) => s.role);

  const validate = () => {
    const newErrors: any = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    
    if (!isForgotPassword) {
      if (!password) newErrors.password = 'Password is required';
      else if (!isLogin && password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      
      if (!isLogin && !name) newErrors.name = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (!text) setErrors(prev => ({...prev, email: 'Email is required'}));
    else if (!/\S+@\S+\.\S+/.test(text)) setErrors(prev => ({...prev, email: 'Invalid email address'}));
    else setErrors(prev => ({...prev, email: undefined}));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!isForgotPassword) {
      if (!text) setErrors(prev => ({...prev, password: 'Password is required'}));
      else if (!isLogin && text.length < 6) setErrors(prev => ({...prev, password: 'Password must be at least 6 characters'}));
      else setErrors(prev => ({...prev, password: undefined}));
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (!isLogin && !isForgotPassword) {
      if (!text) setErrors(prev => ({...prev, name: 'Full name is required'}));
      else setErrors(prev => ({...prev, name: undefined}));
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      if (isForgotPassword) {
        await authService.forgotPassword(email);
        Toast.show({ type: 'success', text1: 'Email Sent', text2: 'Password reset instructions sent.' });
        navigation.navigate('Otp', { email, mode: 'forgot' });
      } else if (isLogin) {
        const response = await authService.login(email, password);
        await setAuth(response.user, response.token);
      } else {
        await authService.register(email, password, name, role || 'worker');
        Toast.show({ type: 'info', text1: 'Verify Email', text2: 'Please verify your email to continue.' });
        navigation.navigate('Otp', { email, mode: 'register' });
      }
    } catch (error: any) {
      const msg = typeof error === 'string' ? error : (error?.message || 'Authentication failed');
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isForgotPassword) return 'Reset Password';
    return isLogin ? 'Welcome Back' : 'Create Account';
  };

  const getSubtitle = () => {
    if (isForgotPassword) return 'Enter your email to receive reset instructions.';
    return isLogin ? 'Enter your details to sign in.' : 'Join the premium network today.';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={StyleSheet.absoluteFill}
      />
      <LightRays />
      
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => {
                if (isForgotPassword) setIsForgotPassword(false);
                else navigation.goBack();
              }}
              activeOpacity={0.7}
            >
              <ChevronLeft size={28} color={colors.textPrimary} strokeWidth={2} />
            </TouchableOpacity>
            
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{getTitle()}</Text>
              <Text style={styles.subtitle}>{getSubtitle()}</Text>
            </View>
          </Animated.View>

          <Animated.View 
            layout={Layout.springify()} 
            entering={FadeInUp.delay(200).duration(500)} 
            style={styles.form}
          >
            {!isLogin && !isForgotPassword && (
              <Animated.View entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(300)}>
                <TextInput
                  label="Full Name"
                  value={name}
                  onChangeText={handleNameChange}
                  leftIcon={<User size={20} color={colors.textSecondary} strokeWidth={1.5} />}
                  error={errors.name}
                />
              </Animated.View>
            )}

            <TextInput
              label="Email Address"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.textSecondary} strokeWidth={1.5} />}
              error={errors.email}
            />

            {!isForgotPassword && (
              <Animated.View layout={Layout.springify()}>
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  leftIcon={<Lock size={20} color={colors.textSecondary} strokeWidth={1.5} />}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      {showPassword ? (
                        <EyeOff size={20} color={colors.textSecondary} strokeWidth={1.5} />
                      ) : (
                        <Eye size={20} color={colors.textSecondary} strokeWidth={1.5} />
                      )}
                    </TouchableOpacity>
                  }
                  error={errors.password}
                />
                {!isLogin && password.length > 0 && (
                  <PasswordStrength password={password} />
                )}
              </Animated.View>
            )}

            {isLogin && !isForgotPassword && (
              <Animated.View layout={Layout.springify()}>
                <TouchableOpacity onPress={() => setIsForgotPassword(true)} style={styles.forgotPasswordContainer}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            <Animated.View layout={Layout.springify()}>
              <Button 
                title={isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')} 
                onPress={handleSubmit} 
                style={styles.submitBtn} 
                loading={loading}
              />
            </Animated.View>
          </Animated.View>

          {!isForgotPassword && (
            <Animated.View layout={Layout.springify()} style={styles.footer}>
              <Text style={styles.footerText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={styles.linkText} onPress={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setEmail('');
                  setPassword('');
                }}>
                  {isLogin ? 'Sign Up' : 'Log In'}
                </Text>
              </Text>
            </Animated.View>
          )}

        </KeyboardAvoidingView>
      </Animated.ScrollView>
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
    padding: metrics.spacing.l,
    paddingTop: height * 0.08, // Adjust for top safe area
  },
  header: {
    marginBottom: metrics.spacing.xxl,
  },
  backBtn: {
    marginBottom: metrics.spacing.l,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
  },
  headerTextContainer: {
    marginTop: metrics.spacing.s,
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
    letterSpacing: -0.2,
  },
  form: {
    marginTop: metrics.spacing.m,
  },
  eyeBtn: {
    padding: metrics.spacing.xs,
  },
  submitBtn: {
    marginTop: metrics.spacing.l,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: metrics.spacing.m,
    marginTop: metrics.spacing.xs,
  },
  forgotPasswordText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  },
  footer: {
    marginTop: metrics.spacing.xxxl,
    paddingVertical: metrics.spacing.l,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  }
});
