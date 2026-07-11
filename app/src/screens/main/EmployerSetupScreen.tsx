import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { Briefcase, User, Building, MapPin } from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout, } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

export const EmployerSetupScreen = () => {
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');

  const handleFinish = () => {
    updateProfile({ 
      name, 
      // In a real app we'd save these to a specific employer profile document
    });
    // Setting a flag that setup is complete so they can post jobs
    // For now we just return back to home
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
            <View style={styles.iconWrapper}>
              <Briefcase size={36} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Employer Setup</Text>
            <Text style={styles.subtitle}>Let's set up your business profile before you post your first job.</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(300).duration(600).springify()} layout={Layout.springify()} style={styles.form}>
            <TextInput
              label="Your Name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.textSecondary} strokeWidth={1.5} />}
            />
            <TextInput
              label="Company Name (Optional)"
              value={businessName}
              onChangeText={setBusinessName}
              leftIcon={<Building size={20} color={colors.textSecondary} strokeWidth={1.5} />}
            />
            <TextInput
              label="Business Location (Optional)"
              value={businessLocation}
              onChangeText={setBusinessLocation}
              leftIcon={<MapPin size={20} color={colors.textSecondary} strokeWidth={1.5} />}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).duration(600).springify()} layout={Layout.springify()} style={styles.footer}>
            <Button 
              title="Complete Setup" 
              onPress={handleFinish} 
              disabled={!name.trim()}
            />
          </Animated.View>
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
    paddingTop: height * 0.1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xxl,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...metrics.shadows.glow,
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
    letterSpacing: -0.2,
    lineHeight: 24,
    paddingHorizontal: metrics.spacing.m,
  },
  form: {
    marginBottom: metrics.spacing.xxl,
  },
  footer: {
    paddingBottom: metrics.spacing.xl,
  }
});
