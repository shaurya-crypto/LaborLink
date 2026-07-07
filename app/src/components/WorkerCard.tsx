import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { WorkerProfile } from '@/models/User';
import { StatusBadge } from './StatusBadge';

interface WorkerCardProps {
  worker: WorkerProfile;
  onPress: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  style?: any;
}

export const WorkerCard = ({ worker, onPress, onSave, isSaved, style }: WorkerCardProps) => {
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
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{worker.name.substring(0, 2).toUpperCase()}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name} numberOfLines={1}>{worker.name}</Text>
            <Text style={styles.occupation} numberOfLines={1}>{worker.occupation}</Text>
          </View>
          {onSave && (
            <TouchableOpacity onPress={onSave} style={styles.saveBtn} hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Icon 
                name="bookmark" 
                size={22} 
                color={isSaved ? colors.primary : colors.icons} 
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.badgesRow}>
          {worker.matchLabels?.map((label, idx) => (
            <StatusBadge key={idx} label={label} variant="info" style={styles.badge} />
          ))}
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="map-pin" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>{worker.city?.split(',')[0]} • {worker.distanceKm} km</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="briefcase" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{worker.experience}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.salary}>{worker.expectedSalary}</Text>
          </View>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View Profile</Text>
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
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  avatarInitials: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.primaryDark,
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
  saveBtn: {
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
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  viewBtn: {
    backgroundColor: colors.secondaryBackground,
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.s,
    borderRadius: metrics.radiusPill,
  },
  viewBtnText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.textPrimary,
  }
});
