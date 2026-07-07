import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { ScreenContainer, Button } from '@/components';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { useEmployerStore } from '@/store/useEmployerStore';

export const EmployerProfileScreen = () => {
  const { user, clearAuth } = useAuthStore();
  const { setRole } = useAppStore();
  const { stats } = useEmployerStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: clearAuth }
    ]);
  };

  const handleSwitchAccount = () => {
    Alert.alert('Switch Account', 'Do you want to switch to a Worker profile?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Switch to Worker', onPress: () => setRole('worker') }
    ]);
  };

  const renderSettingItem = (icon: string, title: string, onPress: () => void, isDestructive = false) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingIconWrapper}>
        <Icon name={icon} size={20} color={isDestructive ? colors.error : colors.textSecondary} />
      </View>
      <Text style={[styles.settingTitle, isDestructive && { color: colors.error }]}>{title}</Text>
      <Icon name="chevron-right" size={20} color={colors.divider} />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer backgroundColor={colors.background} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{user?.name.substring(0, 2).toUpperCase() || 'EM'}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Company Owner'}</Text>
          <Text style={styles.companyName}>Tata Projects Ltd</Text>
          <View style={styles.locationRow}>
            <Icon name="map-pin" size={14} color={colors.textSecondary} />
            <Text style={styles.locationText}>{user?.city || 'Mumbai, Maharashtra'}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.completedJobs || 12}</Text>
            <Text style={styles.statLabel}>Jobs Posted</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.workersHired || 4}</Text>
            <Text style={styles.statLabel}>Workers Hired</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem('user', 'Edit Profile', () => {})}
            {renderSettingItem('briefcase', 'Company Details', () => {})}
            {renderSettingItem('credit-card', 'Billing & Payments', () => {})}
            {renderSettingItem('bell', 'Notification Preferences', () => {})}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem('help-circle', 'Help Center', () => {})}
            {renderSettingItem('file-text', 'Terms & Privacy', () => {})}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button 
            title="Switch to Worker" 
            variant="outlined" 
            onPress={handleSwitchAccount} 
            style={styles.switchBtn} 
          />
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Icon name="log-out" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: metrics.spacing.l,
    paddingTop: Platform.OS === 'ios' ? 0 : metrics.spacing.m,
    paddingBottom: metrics.spacing.m,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
  },
  avatarInitials: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 32,
    color: colors.primaryDark,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  companyName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.primary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
  },
  locationText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.m,
    marginBottom: metrics.spacing.xl,
    ...metrics.shadows.soft,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  section: {
    marginBottom: metrics.spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    overflow: 'hidden',
    ...metrics.shadows.soft,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: metrics.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingIconWrapper: {
    width: 32,
    alignItems: 'flex-start',
  },
  settingTitle: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  actionButtons: {
    marginTop: metrics.spacing.m,
    gap: metrics.spacing.l,
  },
  switchBtn: {
    width: '100%',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.m,
    gap: metrics.spacing.s,
  },
  logoutText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.error,
  }
});
