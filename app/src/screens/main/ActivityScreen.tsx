import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer, ActivityCard, EmptyState } from '@/components';
import { colors, typography, metrics } from '@/theme';
import { useActivityStore, ActivityItem } from '@/store/useActivityStore';
import { useAppStore } from '@/store/useAppStore';

export const ActivityScreen = () => {
  const navigation = useNavigation<any>();
  const role = useAppStore((state) => state.role);
  const { activities, loadingActivities, fetchActivities } = useActivityStore();

  useEffect(() => {
    fetchActivities();
  },
 [fetchActivities]);

  // Filter activities by current role
  const roleActivities = activities.filter((act) => act.role === role);

  // Grouping function
  const getGroupedActivities = () => {
    const today: ActivityItem[] = [];
    const yesterday: ActivityItem[] = [];
    const thisWeek: ActivityItem[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 1000 * 60 * 60 * 24;
    const weekStart = todayStart - 1000 * 60 * 60 * 24 * 7;

    roleActivities.forEach((act) => {
      const actTime = new Date(act.timestamp).getTime();
      if (actTime >= todayStart) {
        today.push(act);
      } else if (actTime >= yesterdayStart) {
        yesterday.push(act);
      } else if (actTime >= weekStart) {
        thisWeek.push(act);
      }
    });

    return { today, yesterday, thisWeek };
  };

  const { today, yesterday, thisWeek } = getGroupedActivities();

  const handleRefresh = () => {
    fetchActivities();
  };

  const handleCta = () => {
    if (role === 'worker') {
      navigation.navigate('WorkerTabs', { screen: 'SearchTab' } as any);
    } else {
      navigation.navigate('EmployerTabs', { screen: 'FindTab' } as any);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.background}>
      {/* Premium Header without border line */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Feed</Text>
        <View style={styles.headerSpacer} /> 
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={loadingActivities} 
            onRefresh={handleRefresh} 
            colors={[colors.primary]} 
          />
        }
      >
        {roleActivities.length === 0 ? (
          <EmptyState
            icon="activity"
            title="No Activity Yet"
            subtitle="Any updates on jobs, applications, or messages will appear in this feed."
            actionTitle={role === 'worker' ? 'Find Jobs' : 'Find Workers'}
            onAction={handleCta}
            gradient={colors.gradients.success}
          />
        ) : (
          <View style={styles.feedContainer}>
            {/* Today Group */}
            {today.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today</Text>
                {today.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </View>
            )}

            {/* Yesterday Group */}
            {yesterday.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Yesterday</Text>
                {yesterday.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </View>
            )}

            {/* This Week Group */}
            {thisWeek.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>This Week</Text>
                {thisWeek.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.l,
    paddingTop: metrics.spacing.xl, // Push down into safe area gracefully
    paddingBottom: metrics.spacing.m,
    backgroundColor: colors.background, // Match background for seamless flow
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...metrics.shadows.soft,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
  },
  content: {
    paddingBottom: metrics.spacing.xxxl,
    flexGrow: 1,
  },
  feedContainer: {
    paddingHorizontal: metrics.spacing.l,
    paddingTop: metrics.spacing.m,
  },
  section: {
    marginBottom: metrics.spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: metrics.spacing.m,
    marginLeft: metrics.spacing.xs,
  },
  headerSpacer: {
    width: 44,
  }
});
