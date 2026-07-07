import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer, Button } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/AuthService';
import Icon from 'react-native-vector-icons/Feather';

export const ProfileScreen = () => {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
    useAuthStore.getState().clearAuth();
  };

  const getCompletionPercentage = () => {
    let score = 50;
    if (user?.occupation) score += 15;
    if (user?.experience) score += 15;
    if (user?.city) score += 10;
    if (user?.photo) score += 10;
    return score;
  };

  const completion = getCompletionPercentage();

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Icon name="user" size={40} color={colors.textSecondary} />
          </View>
          <Text style={styles.name}>{user?.name || 'Worker Name'}</Text>
          <Text style={styles.occupation}>{user?.occupation || 'Occupation Not Set'}</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Icon name="edit-2" size={14} color={colors.primary} />
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {completion < 100 && (
          <View style={styles.completionCard}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionTitle}>Profile Completion</Text>
              <Text style={styles.completionValue}>{completion}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${completion}%` }]} />
            </View>
            <Text style={styles.completionSub}>Complete your profile to receive better job recommendations.</Text>
          </View>
        )}

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Icon name="map-pin" size={18} color={colors.textSecondary} /></View>
            <View><Text style={styles.detailLabel}>City</Text><Text style={styles.detailValue}>{user?.city || 'Not set'}</Text></View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Icon name="briefcase" size={18} color={colors.textSecondary} /></View>
            <View><Text style={styles.detailLabel}>Experience</Text><Text style={styles.detailValue}>{user?.experience || 'Not set'}</Text></View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Icon name="tool" size={18} color={colors.textSecondary} /></View>
            <View><Text style={styles.detailLabel}>Skills</Text><Text style={styles.detailValue}>Wiring, Maintenance, Repair</Text></View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Icon name="globe" size={18} color={colors.textSecondary} /></View>
            <View><Text style={styles.detailLabel}>Languages</Text><Text style={styles.detailValue}>Hindi, English, Marathi</Text></View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Icon name="clock" size={18} color={colors.textSecondary} /></View>
            <View><Text style={styles.detailLabel}>Availability & Hours</Text><Text style={styles.detailValue}>Available Today • 9am - 6pm</Text></View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}><Icon name="dollar-sign" size={18} color={colors.textSecondary} /></View>
            <View><Text style={styles.detailLabel}>Expected Salary</Text><Text style={styles.detailValue}>₹25,000 / Monthly</Text></View>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Portfolio & Resume</Text>
          <TouchableOpacity style={styles.menuRow}>
            <Icon name="file-text" size={20} color={colors.textPrimary} />
            <Text style={styles.menuText}>Upload Portfolio / Certifications</Text>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.menuRow}>
            <Icon name="settings" size={20} color={colors.textPrimary} />
            <Text style={styles.menuText}>App Settings</Text>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow}>
            <Icon name="refresh-cw" size={20} color={colors.textPrimary} />
            <Text style={styles.menuText}>Switch to Employer Account</Text>
            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <Button title="Log Out" variant="outlined" onPress={handleLogout} style={styles.logoutBtn} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: metrics.spacing.l,
    paddingTop: metrics.spacing.xl,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
  },
  content: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: metrics.spacing.xl,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.m,
    ...metrics.shadows.soft,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  occupation: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.m,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: metrics.radiusPill,
    gap: 8,
  },
  editText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.primaryDark,
  },
  completionCard: {
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.l,
    borderWidth: 1,
    borderColor: colors.primary + '4D',
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.s,
  },
  completionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  completionValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    marginBottom: metrics.spacing.s,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  completionSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  detailsSection: {
    marginBottom: metrics.spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
    marginLeft: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: metrics.spacing.m,
    borderRadius: metrics.radiusCard,
    marginBottom: 8,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  detailLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    marginBottom: 8,
  },
  menuText: {
    flex: 1,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    marginLeft: metrics.spacing.m,
  },
  logoutBtn: {
    marginTop: metrics.spacing.m,
  }
});
