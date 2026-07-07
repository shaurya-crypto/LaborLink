import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { Job } from '@/models/Job';
import { StatusBadge } from './StatusBadge';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  style?: any;
}

export const JobCard = ({ job, onPress, onBookmark, isBookmarked, style }: JobCardProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  return (
    <Animated.View style={[styles.container, style, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.header}>
          <View style={styles.companyIconPlaceholder}>
            <Text style={styles.companyInitials}>{job.company.substring(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
            <Text style={styles.company} numberOfLines={1}>{job.company}</Text>
          </View>
          {onBookmark && (
            <TouchableOpacity onPress={onBookmark} style={styles.bookmarkBtn} hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Icon 
                name="bookmark" 
                size={22} 
                color={isBookmarked ? colors.primary : colors.icons} 
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.badgesRow}>
          {job.matchLabels?.map((label, idx) => (
            <StatusBadge key={idx} label={label} variant="info" style={styles.badge} />
          ))}
          {job.isUrgent && <StatusBadge label="Urgent" variant="warning" style={styles.badge} />}
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="map-pin" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>{job.location} • {job.distanceKm} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="briefcase" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{job.experienceRequired}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.salary}>{formatSalary(job.salaryMin, job.salaryMax)}</Text>
            <Text style={styles.salaryType}>/ {job.salaryType}</Text>
          </View>
          <View style={styles.applyBtn}>
            <Text style={styles.applyBtnText}>View Details</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: metrics.spacing.m,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.l,
    ...metrics.shadows.soft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.s,
  },
  companyIconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: metrics.radiusS,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  companyInitials: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  headerText: {
    flex: 1,
    marginRight: metrics.spacing.s,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  company: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  bookmarkBtn: {
    padding: metrics.spacing.xs,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: metrics.spacing.m,
  },
  badge: {
    marginRight: metrics.spacing.s,
    marginBottom: metrics.spacing.xs,
  },
  detailsRow: {
    marginBottom: metrics.spacing.m,
    gap: metrics.spacing.s,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.s,
  },
  detailText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: metrics.spacing.m,
  },
  salary: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
  },
  salaryType: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  applyBtn: {
    backgroundColor: colors.primary + '1A', // Light primary
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.s,
    borderRadius: metrics.radiusPill,
  },
  applyBtnText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.primaryDark,
  }
});
