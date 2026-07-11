 
﻿import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { TimelineStep } from '@/store/useTimelineStore';

interface TimelineCardProps {
  steps: TimelineStep[];
}

export const TimelineCard = ({ steps }: TimelineCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Application Progress</Text>
      
      <View style={styles.timelineList}>
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          
          
          let dotWidget = <View style={styles.pendingDot} />;
          
          if (step.isCompleted) {
            colors.primary = colors.success;
            dotWidget = (
              <View style={[styles.completedDot, { backgroundColor: colors.success }]}>
                <Icon name="check" size={10} color={colors.surface} />
              </View>
            );
          } else if (step.isActive) {
            colors.primary = colors.primary;
            dotWidget = (
              <View style={[styles.activeDotContainer, { borderColor: colors.primary }]}>
                <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
              </View>
            );
          }

          return (
            <View key={idx} style={styles.stepRow}>
              {/* Left Column: Indicator Dots & Lines */}
              <View style={styles.indicatorContainer}>
                {dotWidget}
                {!isLast && (
                  <View 
                    style={[
                      styles.line, 
                      { 
                        backgroundColor: step.isCompleted && steps[idx + 1]?.isCompleted ? colors.success : colors.divider 
                      }
                    ]} 
                  />
                )}
              </View>

              {/* Right Column: Step Label & Timestamp */}
              <View style={styles.labelContainer}>
                <Text 
                  style={[
                    styles.stepTitle, 
                    step.isCompleted && styles.textCompleted,
                    step.isActive && styles.textActive
                  ]}
                >
                  {step.status}
                </Text>
                {step.timestamp && (
                  <Text style={styles.timestamp}>{step.timestamp}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.l,
    marginVertical: metrics.spacing.m,
    ...metrics.shadows.soft,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.l,
  },
  timelineList: {
    paddingLeft: metrics.spacing.s,
  },
  stepRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  indicatorContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: metrics.spacing.m,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  pendingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.divider,
    marginTop: 6,
  },
  completedDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  activeDotContainer: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: colors.surface,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelContainer: {
    flex: 1,
    paddingBottom: metrics.spacing.l,
  },
  stepTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  textCompleted: {
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  textActive: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primaryDark,
  },
  timestamp: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
});
