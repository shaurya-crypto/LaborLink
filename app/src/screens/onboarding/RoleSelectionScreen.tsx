import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ScreenContainer, Button } from '@/components';
import { colors, metrics, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAppStore } from '@/store/useAppStore';

export const RoleSelectionScreen = () => {
  const [selectedRole, setSelectedRole] = useState<'worker' | 'employer' | null>(null);
  const { setRole } = useAppStore();

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
    }
  };

  const RoleCard = ({ role, title, description, icon }: any) => {
    const isSelected = selectedRole === role;
    return (
      <TouchableOpacity 
        style={[styles.card, isSelected && styles.cardSelected]} 
        onPress={() => setSelectedRole(role)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconWrapper, isSelected && styles.iconWrapperSelected]}>
          <Icon name={icon} size={32} color={isSelected ? colors.primary : colors.icons} />
        </View>
        <Text style={[styles.cardTitle, isSelected && styles.textSelected]}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
        
        {isSelected && (
          <View style={styles.checkBadge}>
            <Icon name="check" size={16} color={colors.surface} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer backgroundColor={colors.surface} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Path</Text>
        <Text style={styles.subtitle}>Are you looking for work or looking to hire?</Text>
      </View>

      <View style={styles.content}>
        <RoleCard 
          role="worker"
          title="I am a Worker"
          description="Find jobs, create a work profile, and apply to employers instantly."
          icon="tool"
        />
        <RoleCard 
          role="employer"
          title="I am an Employer"
          description="Hire skilled workers, post jobs, and manage applicants easily."
          icon="briefcase"
        />
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue} 
          disabled={!selectedRole}
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
  header: {
    marginTop: metrics.spacing.xxl,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.xl,
  },
  content: {
    flex: 1,
    gap: metrics.spacing.l,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.xl,
    borderWidth: 2,
    borderColor: colors.divider,
    alignItems: 'center',
    position: 'relative',
    ...metrics.shadows.soft,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.secondaryBackground,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
  },
  iconWrapperSelected: {
    backgroundColor: colors.primary + '1A', // 10% opacity
  },
  cardTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
  },
  cardDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  textSelected: {
    color: colors.primaryDark,
  },
  checkBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingBottom: metrics.spacing.l,
  }
});
