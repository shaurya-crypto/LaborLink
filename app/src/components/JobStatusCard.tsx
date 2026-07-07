import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { EmployerJob } from '@/models/Job';
import { StatusBadge } from './StatusBadge';

interface JobStatusCardProps {
  job: EmployerJob;
  onPress: () => void;
}

export const JobStatusCard = ({ job, onPress }: JobStatusCardProps) => {
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Open': return 'success';
      case 'Draft': return 'neutral';
      case 'In Progress': return 'primary';
      case 'Completed': return 'info';
      case 'Closed': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
        <StatusBadge label={job.status} variant={getStatusVariant(job.status)} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{job.applicantsCount}</Text>
          <Text style={styles.statLabel}>Applicants</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{job.views}</Text>
          <Text style={styles.statLabel}>Views</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{job.salaryMax.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Max Salary</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.dateText}>Posted {new Date(job.postedAt).toLocaleDateString()}</Text>
        <Icon name="chevron-right" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.l,
    marginBottom: metrics.spacing.m,
    ...metrics.shadows.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: metrics.spacing.m,
  },
  title: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginRight: metrics.spacing.s,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: metrics.radiusS,
    padding: metrics.spacing.m,
    marginBottom: metrics.spacing.m,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
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
    height: '100%',
    backgroundColor: colors.divider,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  }
});
