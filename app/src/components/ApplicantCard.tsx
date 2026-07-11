import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { Applicant } from '@/models/Job';
import { StatusBadge } from './StatusBadge';

interface ApplicantCardProps {
  applicant: Applicant;
  onPress: () => void;
  onHire: () => void;
  onReject: () => void;
  onShortlist: () => void;
}

export const ApplicantCard = ({ applicant, onPress, onHire, onReject, onShortlist }: ApplicantCardProps) => {
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'info';
      case 'Interview': return 'warning';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{applicant.worker.name.substring(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name} numberOfLines={1}>{applicant.worker.name}</Text>
            <Text style={styles.occupation} numberOfLines={1}>{applicant.worker.occupation}</Text>
          </View>
          <StatusBadge label={applicant.status} variant={getStatusVariant(applicant.status)} />
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="briefcase" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{applicant.worker.experience}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="dollar-sign" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{applicant.worker.expectedSalary}</Text>
          </View>
        </View>

        <View style={styles.matchRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${applicant.matchScore}%`, backgroundColor: applicant.matchScore > 80 ? colors.success : colors.warning }]} />
          </View>
          <Text style={styles.matchText}>{applicant.matchScore}% Match</Text>
        </View>

        {applicant.status === 'Pending' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={onReject}>
              <Text style={[styles.actionBtnText, { color: colors.error }]}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.shortlistBtn]} onPress={onShortlist}>
              <Text style={[styles.actionBtnText, { color: colors.primary }]}>Shortlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.hireBtn]} onPress={onHire}>
              <Text style={[styles.actionBtnText, { color: colors.surface }]}>Hire</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: metrics.spacing.m,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  avatarInitials: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  headerText: {
    flex: 1,
    marginRight: metrics.spacing.s,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  occupation: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.m,
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
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.m,
    marginBottom: metrics.spacing.l,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  matchText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.caption,
    color: colors.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: metrics.spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: metrics.spacing.m,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: metrics.spacing.s,
    borderRadius: metrics.radiusPill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  rejectBtn: {
    borderColor: colors.error + '40',
    backgroundColor: colors.surface,
  },
  shortlistBtn: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  hireBtn: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  actionBtnText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
  }
});
