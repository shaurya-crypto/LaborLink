import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.settingsIcon}>
              <Icon name="settings" size={24} color={colors.surface} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfoRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarInner}>
                <Icon name="user" size={48} color={colors.primary} />
              </View>
              <View style={styles.cameraBadge}>
                <Icon name="camera" size={14} color={colors.surface} />
              </View>
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.nameWhite}>{user?.name || 'Worker Name'}</Text>
              <Text style={styles.occupationWhite}>{user?.occupation || 'Occupation Not Set'}</Text>
              <TouchableOpacity style={styles.editBtn}>
                <Icon name="edit-2" size={14} color={colors.surface} />
                <Text style={styles.editTextWhite}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.cardsContainer}>
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
              <View style={[styles.detailIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="map-pin" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>City</Text>
                <Text style={styles.detailValue}>{user?.city || 'Not set'}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="briefcase" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Experience</Text>
                <Text style={styles.detailValue}>{user?.experience || 'Not set'}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="tool" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Skills</Text>
                <Text style={styles.detailValue}>Wiring, Maintenance, Repair</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="globe" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Languages</Text>
                <Text style={styles.detailValue}>Hindi, English, Marathi</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="clock" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Availability & Hours</Text>
                <Text style={styles.detailValue}>Available Today • 9am - 6pm</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="dollar-sign" size={20} color={colors.primary} />
              </View>
              <View style={styles.detailTextWrapper}>
                <Text style={styles.detailLabel}>Expected Salary</Text>
                <Text style={styles.detailValue}>₹25,000 / Monthly</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Portfolio & Resume</Text>
            <TouchableOpacity style={styles.menuRow}>
              <View style={styles.menuIconContainer}>
                <Icon name="file-text" size={20} color={colors.textPrimary} />
              </View>
              <Text style={styles.menuText}>Upload Portfolio / Certifications</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <TouchableOpacity style={styles.menuRow}>
              <View style={styles.menuIconContainer}>
                <Icon name="settings" size={20} color={colors.textPrimary} />
              </View>
              <Text style={styles.menuText}>App Settings</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <View style={styles.menuIconContainer}>
                <Icon name="refresh-cw" size={20} color={colors.textPrimary} />
              </View>
              <Text style={styles.menuText}>Switch to Employer Account</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Button 
            title="Log Out" 
            variant="outlined" 
            onPress={handleLogout} 
            style={styles.logoutBtn} 
            icon={<Icon name="log-out" size={20} color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: metrics.spacing.xxxl,
  },
  headerGradient: {
    paddingTop: 50, // Approx safe area
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: metrics.spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.surface,
  },
  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: metrics.spacing.l,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...metrics.shadows.medium,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  profileTextContainer: {
    flex: 1,
  },
  nameWhite: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.surface,
    marginBottom: 4,
  },
  occupationWhite: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: metrics.spacing.s,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: metrics.radiusPill,
    alignSelf: 'flex-start',
    gap: 6,
  },
  editTextWhite: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.caption,
    color: colors.surface,
  },
  cardsContainer: {
    padding: metrics.spacing.l,
    marginTop: -20, // Overlap the gradient header
  },
  completionCard: {
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.xl,
    ...metrics.shadows.medium,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.m,
  },
  completionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
  },
  completionValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    marginBottom: metrics.spacing.m,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  completionSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    lineHeight: 20,
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
    padding: metrics.spacing.l, // More padding for premium feel
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.s,
    ...metrics.shadows.soft,
  },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.s,
    ...metrics.shadows.soft,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  menuText: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  logoutBtn: {
    marginTop: metrics.spacing.l,
    marginBottom: metrics.spacing.xl,
  }
});

