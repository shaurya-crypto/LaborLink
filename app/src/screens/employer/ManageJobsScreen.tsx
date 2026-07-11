import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { ScreenContainer, JobStatusCard, EmptyState, LoadingSkeleton } from '@/components';
import { colors, typography, metrics } from '@/theme';
import { useEmployerStore } from '@/store/useEmployerStore';
import { JobStatus } from '@/models/Job';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/MainNavigator';

const TABS: JobStatus[] = ['Open', 'In Progress', 'Completed', 'Draft', 'Closed'];

export const ManageJobsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { jobs, loading, fetchDashboardData } = useEmployerStore();
  const [activeTab, setActiveTab] = useState<JobStatus>('Open');

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredJobs = jobs.filter(job => job.status === activeTab);

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={TABS}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.tabsList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, activeTab === item && styles.activeTab]}
            onPress={() => setActiveTab(item)}
          >
            <Text style={[styles.tabText, activeTab === item && styles.activeTabText]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <ScreenContainer backgroundColor={colors.background} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
      </View>

      {renderTabs()}

      {loading && jobs.length === 0 ? (
        <View style={styles.listContainer}>
          <LoadingSkeleton type="custom" width="100%" height={160} style={styles.skeletonSpacer} />
          <LoadingSkeleton type="custom" width="100%" height={160} style={styles.skeletonCard} />
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchDashboardData} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <JobStatusCard 
              job={item} 
              onPress={() => navigation.navigate('Applicants', { jobId: item.id })} 
            />
          )}
          ListEmptyComponent={
            <EmptyState 
              icon="inbox" 
              title={`No ${activeTab} Jobs`} 
              subtitle={`You don't have any jobs in the ${activeTab} state.`} 
            />
          }
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  header: {
    paddingHorizontal: metrics.spacing.l,
    paddingTop: Platform.OS === 'ios' ? 0 : metrics.spacing.m,
    paddingBottom: metrics.spacing.m,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
  },
  tabsContainer: {
    marginBottom: metrics.spacing.m,
  },
  tabsList: {
    paddingHorizontal: metrics.spacing.l,
    gap: metrics.spacing.s,
  },
  tab: {
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.s,
    borderRadius: metrics.radiusPill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.surface,
    fontFamily: typography.fontFamily.semiBold,
  },
  listContainer: {
    paddingHorizontal: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
    flexGrow: 1,
  },
  skeletonSpacer: {
    marginBottom: 16,
    borderRadius: metrics.radiusCard,
  },
  skeletonCard: {
    borderRadius: metrics.radiusCard,
  }
});
