import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
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

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const JobCard = ({ job, onPress, onBookmark, isBookmarked, style }: JobCardProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatSalary = (min: number, max: number) => {
    return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  };

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.companyIconPlaceholder, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.companyInitials, { color: colors.primary }]}>
              {job.company.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
            <Text style={styles.company} numberOfLines={1}>{job.company}</Text>
          </View>
          {onBookmark && (
            <TouchableOpacity onPress={onBookmark} style={styles.bookmarkBtn} hitSlop={{top:15, bottom:15, left:15, right:15}}>
              <Icon 
                name="bookmark" 
                size={24} 
                color={isBookmarked ? colors.primary : colors.textSecondary} 
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
            <Icon name="map-pin" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>{job.location} • {job.distanceKm} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="briefcase" size={16} color={colors.textSecondary} />
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
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: metrics.spacing.l, // Increased for breathing space
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.l,
    ...metrics.shadows.medium, // Upgraded shadow
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
  },
  companyIconPlaceholder: {
    width: 52, // Bigger icon
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  companyInitials: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
  },
  headerText: {
    flex: 1,
    marginRight: metrics.spacing.s,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  company: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
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
    marginBottom: metrics.spacing.s,
  },
  detailsRow: {
    marginBottom: metrics.spacing.l,
    gap: metrics.spacing.s,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.s,
  },
  detailText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1, // Larger readable font
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
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  applyBtn: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.s,
    borderRadius: metrics.radiusPill,
  },
  applyBtnText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  }
});
