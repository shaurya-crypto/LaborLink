import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer, Button, StatusBadge, BottomSheet, TimelineCard, TrustBadge } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useJobStore } from '@/store/useJobStore';
import { useTimelineStore } from '@/store/useTimelineStore';
import { jobService } from '@/services/JobService';
import { Job } from '@/models/Job';

export const JobDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { jobId } = route.params;

  
  const { bookmarkedJobIds, toggleBookmark, applyForJob, applications } = useJobStore();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applySheetVisible, setApplySheetVisible] = useState(false);
  const [applying, setApplying] = useState(false);

  const isBookmarked = bookmarkedJobIds.includes(jobId);
  const hasApplied = applications.some(a => a.jobId === jobId);
  const app = applications.find(a => a.jobId === jobId);
  const getTimelineForJob = useTimelineStore(state => state.getTimelineForJob);
  const timelineSteps = getTimelineForJob(jobId, app?.status, app?.appliedAt);

  useEffect(() => {
    setLoading(true);
    jobService.getJobById(jobId, true).then(res => {
      setJob(res);
      setLoading(false);
    });
  }, [jobId]);

  const handleApplyConfirm = async () => {
    setApplying(true);
    await applyForJob(jobId);
    setApplying(false);
    setApplySheetVisible(false);
    
    Toast.show({
      type: 'success',
      text1: 'Application Submitted',
      text2: 'Your application has been submitted successfully!',
      onPress: () => {
        Toast.hide();
        navigation.navigate('WorkerTabs', { screen: 'ApplicationsTab' });
      }
    });
  };

  if (loading) {
    return (
      <ScreenContainer backgroundColor={colors.background} style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  if (!job) {
    return (
      <ScreenContainer backgroundColor={colors.background} style={styles.center}>
        <Text style={styles.errorText}>Job not found.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
            <Icon name="share-2" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => toggleBookmark(job)}>
            <Icon 
              name="bookmark" 
              size={20} 
              color={isBookmarked ? colors.primary : colors.textPrimary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.companyLogo}>
            <Text style={styles.companyInitials}>{job.company.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Icon name="map-pin" size={14} color={colors.textSecondary} />
              <Text style={styles.tagText}>{job.location}</Text>
            </View>
            <View style={styles.tag}>
              <Icon name="clock" size={14} color={colors.textSecondary} />
              <Text style={styles.tagText}>{job.workingHours}</Text>
            </View>
            <View style={styles.tag}>
              <Icon name="briefcase" size={14} color={colors.textSecondary} />
              <Text style={styles.tagText}>{job.experienceRequired}</Text>
            </View>
          </View>

          <View style={styles.badgesRow}>
            {job.matchLabels?.map((lbl, i) => <StatusBadge key={i} label={lbl} variant="info" style={styles.badge} />)}
            {job.isUrgent && <StatusBadge label="Urgent Hiring" variant="warning" style={styles.badge} />}
          </View>
        </View>

        {/* Application Timeline – shown when user has applied */}
        {hasApplied && (
          <TimelineCard steps={timelineSteps} />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salary</Text>
          <Text style={styles.salaryText}>
            ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()} <Text style={styles.salarySub}>/ {job.salaryType}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this job</Text>
          <Text style={styles.paragraph}>{job.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsibilities</Text>
          {job.responsibilities.map((res, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.paragraph}>{res}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements.map((req, idx) => (
            <View key={idx} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.paragraph}>{req}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.badgesRow}>
            {job.benefits.map((ben, idx) => (
              <StatusBadge key={idx} label={ben} variant="success" style={styles.badge} />
            ))}
          </View>
        </View>

        {/* Employer Trust Indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employer Trust</Text>
          <View style={styles.trustRow}>
            {job.isVerified && <TrustBadge variant="verified-profile" />}
            <TrustBadge variant="response-time" value="<1 hr" />
            <TrustBadge variant="jobs-completed" value={12} />
            <TrustBadge variant="hiring-success" value="96%" />
          </View>
        </View>

        <TouchableOpacity style={styles.reportBtn}>
          <Icon name="flag" size={16} color={colors.error} />
          <Text style={styles.reportText}>Report this job</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title={isBookmarked ? "Saved" : "Save"} 
          variant="outlined" 
          onPress={() => toggleBookmark(job)} 
          style={styles.saveBtn} 
          icon={<Icon name="bookmark" size={18} color={colors.primary} />}
        />
        {hasApplied ? (
          <Button title="Applied" onPress={() => {}} disabled style={styles.applyBtn} />
        ) : (
          <Button title="Apply Now" onPress={() => setApplySheetVisible(true)} style={styles.applyBtn} />
        )}
      </View>

      <BottomSheet 
        visible={applySheetVisible} 
        onClose={() => !applying && setApplySheetVisible(false)}
        title="Confirm Application"
        description="Are you sure you want to apply for this position?"
      >
        <View style={styles.sheetContent}>
          <View style={styles.sheetRow}>
            <Text style={styles.sheetLabel}>Job:</Text>
            <Text style={styles.sheetValue}>{job.title}</Text>
          </View>
          <View style={styles.sheetRow}>
            <Text style={styles.sheetLabel}>Company:</Text>
            <Text style={styles.sheetValue}>{job.company}</Text>
          </View>
          
          <Button 
            title="Confirm Application" 
            onPress={handleApplyConfirm} 
            loading={applying}
            style={styles.sheetBtn}
          />
        </View>
      </BottomSheet>

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.l,
  },
  errorText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: metrics.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: metrics.spacing.s,
  },
  content: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  },
  heroCard: {
    alignItems: 'center',
    padding: metrics.spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.l,
    ...metrics.shadows.soft,
  },
  companyLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
  },
  companyInitials: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textSecondary,
  },
  jobTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  companyName: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.primary,
    marginBottom: metrics.spacing.l,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: metrics.spacing.m,
    marginBottom: metrics.spacing.l,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    marginHorizontal: 4,
    marginBottom: 8,
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
  salaryText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.primaryDark,
  },
  salarySub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  paragraph: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    lineHeight: 24,
    flex: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 10,
    marginRight: 12,
  },
  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.spacing.m,
    gap: 8,
    marginTop: metrics.spacing.xl,
  },
  reportText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.error,
  },
  footer: {
    flexDirection: 'row',
    padding: metrics.spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.surface,
    gap: metrics.spacing.m,
  },
  saveBtn: {
    flex: 1,
  },
  applyBtn: {
    flex: 2,
  },
  sheetContent: {
    marginTop: metrics.spacing.m,
  },
  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.m,
    paddingBottom: metrics.spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sheetLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  sheetValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  sheetBtn: {
    marginTop: metrics.spacing.l,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.s,
  },
});
