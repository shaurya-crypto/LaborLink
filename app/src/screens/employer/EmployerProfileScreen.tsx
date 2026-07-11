import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
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

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{title: string; message: string; action: () => void; isDestructive?: boolean} | null>(null);

  const handleLogout = () => {
    setModalConfig({
      title: 'Logout',
      message: 'Are you sure you want to logout of your employer account?',
      isDestructive: true,
      action: () => {
        setModalVisible(false);
        clearAuth();
      }
    });
    setModalVisible(true);
  };

  const handleSwitchAccount = () => {
    setModalConfig({
      title: 'Switch Account',
      message: 'Do you want to switch to a Worker profile?',
      action: () => {
        setModalVisible(false);
        setRole('worker');
        Toast.show({ type: 'success', text1: 'Switched to Worker Profile' });
      }
    });
    setModalVisible(true);
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
    <ScreenContainer backgroundColor={colors.background}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitleWhite}>Employer Profile</Text>
          </View>
          
          <View style={styles.profileCard}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{user?.name.substring(0, 2).toUpperCase() || 'EM'}</Text>
            </View>
            <Text style={styles.nameWhite}>{user?.name || 'Company Owner'}</Text>
            <Text style={styles.companyName}>Tata Projects Ltd</Text>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={14} color={colors.surface} />
              <Text style={styles.locationTextWhite}>{user?.city || 'Mumbai, Maharashtra'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsWrapper}>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem('user', 'Edit Profile', () => Toast.show({ type: 'info', text1: 'Coming Soon' }))}
            {renderSettingItem('briefcase', 'Company Details', () => Toast.show({ type: 'info', text1: 'Coming Soon' }))}
            {renderSettingItem('credit-card', 'Billing & Payments', () => Toast.show({ type: 'info', text1: 'Coming Soon' }))}
            {renderSettingItem('bell', 'Notification Preferences', () => Toast.show({ type: 'info', text1: 'Coming Soon' }))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem('help-circle', 'Help Center', () => Toast.show({ type: 'info', text1: 'Coming Soon' }))}
            {renderSettingItem('file-text', 'Terms & Privacy', () => Toast.show({ type: 'info', text1: 'Coming Soon' }))}
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

      {/* Custom Confirmation Bottom Sheet equivalent */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalConfig?.title}</Text>
            <Text style={styles.modalMessage}>{modalConfig?.message}</Text>
            <View style={styles.modalActions}>
              <Button 
                title="Cancel" 
                variant="outlined" 
                onPress={() => setModalVisible(false)} 
                style={styles.modalBtn} 
              />
              <Button 
                title={modalConfig?.title || 'Confirm'} 
                onPress={() => modalConfig?.action()} 
                style={[styles.modalBtn, modalConfig?.isDestructive ? { backgroundColor: colors.error, borderColor: colors.error } : { backgroundColor: colors.primary, borderColor: colors.primary }]} 
              />
            </View>
          </View>
        </View>
      </Modal>

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: metrics.spacing.xxl,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    paddingHorizontal: metrics.spacing.l,
    marginBottom: metrics.spacing.l,
    alignItems: 'center',
  },
  headerTitleWhite: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.surface,
  },
  profileCard: {
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.l,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
    ...metrics.shadows.medium,
  },
  avatarInitials: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 32,
    color: colors.primary,
  },
  nameWhite: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.surface,
    marginBottom: 4,
  },
  companyName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
  },
  locationTextWhite: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: 'rgba(255,255,255,0.8)',
  },
  statsWrapper: {
    paddingHorizontal: metrics.spacing.l,
    marginTop: -40,
    marginBottom: metrics.spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.m,
    ...metrics.shadows.medium,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
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
    paddingHorizontal: metrics.spacing.l,
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
    paddingHorizontal: metrics.spacing.l,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.l,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.xl,
    width: '100%',
    ...metrics.shadows.medium,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
  },
  modalMessage: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.xl,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: metrics.spacing.m,
  },
  modalBtn: {
    flex: 1,
  }
});


