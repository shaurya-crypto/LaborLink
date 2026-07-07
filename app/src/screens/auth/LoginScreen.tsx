import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/AuthNavigator';
import { ScreenContainer, Button, TextInput } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/AuthService';

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

  const validate = () => {
    const newErrors: any = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
    
    if (!isForgotPassword) {
      if (!password) newErrors.password = 'Password is required';
      else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      
      if (!isLogin && !name) newErrors.name = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      if (isForgotPassword) {
        await authService.forgotPassword(email);
        Alert.alert('Success', 'Password reset instructions sent to your email.');
        setIsForgotPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        const response = await authService.login(email, password);
        await setAuth(response.user, response.token);
      } else {
        await authService.register(email, password, name);
        Alert.alert('Success', 'Account created successfully! Please verify your email.');
        setIsLogin(true);
      }
    } catch (error: any) {
      setErrors({ email: error.message || 'Authentication failed' });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (isForgotPassword) return 'Reset Password';
    return isLogin ? 'Welcome Back' : 'Create Account';
  };

  const getSubtitle = () => {
    if (isForgotPassword) return 'Enter your email to receive reset instructions';
    return isLogin ? 'Sign in with your email' : 'Sign up with your email';
  };

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          if (isForgotPassword) setIsForgotPassword(false);
          else navigation.goBack();
        }}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      <View style={styles.form}>
        {!isLogin && !isForgotPassword && (
          <TextInput
            label=""
            placeholder="Full Name"
            value={name}
            onChangeText={(text) => { setName(text); setErrors(prev => ({...prev, name: ''})); }}
            rightIcon={<Icon name="user" size={20} color={colors.textSecondary} />}
            error={errors.name}
          />
        )}
        <TextInput
          label=""
          placeholder="Email"
          value={email}
          onChangeText={(text) => { setEmail(text); setErrors(prev => ({...prev, email: ''})); }}
          keyboardType="email-address"
          autoCapitalize="none"
          rightIcon={<Icon name="mail" size={20} color={colors.textSecondary} />}
          error={errors.email}
        />
        {!isForgotPassword && (
          <TextInput
            label=""
            placeholder="Password"
            value={password}
            onChangeText={(text) => { setPassword(text); setErrors(prev => ({...prev, password: ''})); }}
            secureTextEntry={!showPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            }
            error={errors.password}
          />
        )}

        {isLogin && !isForgotPassword && (
          <TouchableOpacity onPress={() => setIsForgotPassword(true)} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <Button 
          title={isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Login' : 'Sign Up')} 
          onPress={handleSubmit} 
          style={styles.submitBtn} 
          loading={loading}
        />
      </View>

      {!isForgotPassword && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={styles.linkText} onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </Text>
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: metrics.spacing.l,
  },
  header: {
    marginTop: metrics.spacing.m,
    marginBottom: metrics.spacing.xl,
  },
  backBtn: {
    marginBottom: metrics.spacing.l,
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: -8,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  submitBtn: {
    marginTop: metrics.spacing.m,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: metrics.spacing.m,
    marginTop: metrics.spacing.s,
  },
  forgotPasswordText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  },
  footer: {
    paddingVertical: metrics.spacing.l,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  linkText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.semiBold,
  }
});
