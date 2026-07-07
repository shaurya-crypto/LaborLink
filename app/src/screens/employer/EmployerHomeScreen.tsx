import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { ScreenContainer, EmployerStatsCard, QuickActionCard, WorkerCard, LoadingSkeleton } from '@/components';
import { colors, typography, metrics } from '@/theme';
import { useEmployerStore } from '@/store/useEmployerStore';
import { useAuthStore } from '@/store/useAuthStore';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/MainNavigator';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const EmployerHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const { stats, recommendedWorkers, loadingDashboard, fetchDashboardData } = useEmployerStore();
  
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    fetchDashboardData();
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <ScreenContainer backgroundColor={colors.background} style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.greetingHeader}>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.name}>{user?.name || 'Employer'}!</Text>
          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={14} color={colors.primary} />
            <Text style={styles.locationText}>{user?.city || 'Mumbai, Maharashtra'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.notificationBtn} 
          onPress={() => navigation.navigate('EmployerNotifications')}
        >
          <Icon name="bell" size={24} color={colors.textPrimary} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loadingDashboard} onRefresh={fetchDashboardData} colors={[colors.primary]} />
        }
      >
        {/* POST JOB CTA */}
        <TouchableOpacity style={styles.primaryCta} onPress={() => navigation.navigate('PostJob')} activeOpacity={0.9}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Post a New Job</Text>
            <Text style={styles.ctaSubtitle}>Find skilled workers in minutes</Text>
          </View>
          <View style={styles.ctaIconWrapper}>
            <Icon name="plus" size={28} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* QUICK STATS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          {loadingDashboard && !stats ? (
             <View style={styles.statsRow}>
               <LoadingSkeleton width={100} height={80} style={{marginRight: metrics.spacing.m, borderRadius: metrics.radiusCard}} />
               <LoadingSkeleton width={100} height={80} style={{marginRight: metrics.spacing.m, borderRadius: metrics.radiusCard}} />
               <LoadingSkeleton width={100} height={80} style={{borderRadius: metrics.radiusCard}} />
             </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsRow}>
              <EmployerStatsCard label="Open Jobs" value={stats?.openJobs || 0} />
              <EmployerStatsCard label="Applicants" value={stats?.applicationsReceived || 0} />
              <EmployerStatsCard label="Hired" value={stats?.workersHired || 0} />
            </ScrollView>
          )}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
            <QuickActionCard 
              title="Post Job" 
              iconName="edit" 
              color={colors.primary} 
              onPress={() => navigation.navigate('PostJob')} 
            />
            <QuickActionCard 
              title="Find Workers" 
              iconName="users" 
              color={colors.success} 
              onPress={() => navigation.navigate('EmployerTabs' as any, { screen: 'FindTab' })} 
            />
            <QuickActionCard 
              title="Manage Jobs" 
              iconName="briefcase" 
              color={colors.warning} 
              onPress={() => navigation.navigate('EmployerTabs' as any, { screen: 'JobsTab' })} 
            />
            <QuickActionCard 
              title="Saved" 
              iconName="bookmark" 
              color={colors.info} 
              onPress={() => navigation.navigate('EmployerTabs' as any, { screen: 'SavedTab' })} 
            />
          </ScrollView>
        </View>

        {/* RECOMMENDED WORKERS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EmployerTabs' as any, { screen: 'FindTab' })}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loadingDashboard && recommendedWorkers.length === 0 ? (
            <LoadingSkeleton width="100%" height={160} style={{borderRadius: metrics.radiusCard}} />
          ) : (
            recommendedWorkers.slice(0, 3).map((worker, index) => (
              <WorkerCard 
                key={worker.id} 
                worker={worker} 
                onPress={() => navigation.navigate('WorkerProfile', { workerId: worker.id })}
                style={index > 0 ? { marginTop: metrics.spacing.m } : {}}
              />
            ))
          )}
        </View>

      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: metrics.spacing.l,
    paddingTop: Platform.OS === 'ios' ? 0 : metrics.spacing.m,
    marginBottom: metrics.spacing.l,
  },
  greetingHeader: {
    flex: 1,
  },
  greetingText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...metrics.shadows.soft,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  },
  primaryCta: {
    backgroundColor: colors.primaryDark,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
    ...metrics.shadows.medium,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.surface,
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.surface + 'CC',
  },
  ctaIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: metrics.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
  },
  seeAll: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  },
  statsRow: {
    paddingRight: metrics.spacing.m,
  },
  actionsRow: {
    paddingRight: metrics.spacing.m,
  }
});
