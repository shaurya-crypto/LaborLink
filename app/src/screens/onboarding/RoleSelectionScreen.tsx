import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Button } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { Wrench, Briefcase, CheckCircle2 } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withSpring, useSharedValue, Layout } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const RoleCard = ({ role, title, description, icon: IconComponent, delay, selectedRole, onSelect }: any) => {
  const isSelected = selectedRole === role;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: withSpring(isSelected ? colors.primary : colors.border),
    backgroundColor: withSpring(isSelected ? colors.primaryGlow : colors.glass),
  }));

  const handlePressIn = () => { scale.value = withSpring(0.97); };
  const handlePressOut = () => { scale.value = withSpring(1); };
  const handlePress = () => { onSelect(role); };

  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(600).springify()} layout={Layout.springify()}>
      <TouchableOpacity 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconWrapper, isSelected && styles.iconWrapperSelected]}>
              <IconComponent size={28} color={isSelected ? colors.primary : colors.textSecondary} strokeWidth={isSelected ? 2 : 1.5} />
            </View>
            {isSelected && (
              <Animated.View entering={FadeInUp.springify()}>
                <CheckCircle2 size={24} color={colors.primary} />
              </Animated.View>
            )}
          </View>
          <Text style={[styles.cardTitle, isSelected && styles.textSelected]}>{title}</Text>
          <Text style={styles.cardDesc}>{description}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const RoleSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState<'worker' | 'employer' | null>(null);
  const { setRole } = useAppStore();

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
    }
  };



  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradients.surface}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.title}>Choose Your Path</Text>
          <Text style={styles.subtitle}>Are you looking for work or looking to hire?</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          <RoleCard 
            role="worker"
            title="I am a Worker"
            description="Find jobs, create a work profile, and apply to employers instantly."
            icon={Wrench}
            delay={200}
            selectedRole={selectedRole}
            onSelect={setSelectedRole}
          />
          <RoleCard 
            role="employer"
            title="I am an Employer"
            description="Hire skilled workers, post jobs, and manage applicants effortlessly."
            icon={Briefcase}
            delay={400}
            selectedRole={selectedRole}
            onSelect={setSelectedRole}
          />
        </View>

        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.footer}>
          <Button 
            title="Continue" 
            onPress={handleContinue} 
            disabled={!selectedRole}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: metrics.spacing.l,
    paddingTop: height * 0.12,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: metrics.spacing.xxl,
  },
  title: {
    fontFamily: typography.fontFamily.extraBold,
    fontSize: typography.sizes.hero,
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
  cardsContainer: {
    flex: 1,
    gap: metrics.spacing.l,
  },
  card: {
    backgroundColor: colors.glass,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...metrics.shadows.glass,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrapperSelected: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
    letterSpacing: -0.5,
  },
  cardDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  textSelected: {
    color: colors.primary,
  },
  footer: {
    paddingBottom: metrics.spacing.xl,
  }
});
