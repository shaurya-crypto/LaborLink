import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, EmptyState, StatusBadge, LoadingSkeleton } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useJobStore } from '@/store/useJobStore';
import { ApplicationStatus, Application } from '@/models/Job';
import { MainStackParamList } from '@/navigation/MainNavigator';
import Icon from 'react-native-vector-icons/Feather';

const TABS: ApplicationStatus[] = ['Pending', 'Interview', 'Accepted', 'Rejected', 'Completed'];

export const ApplicationsScreen = () => {
  const [activeTab, setActiveTab] = useState<ApplicationStatus>('Pending');
  const { applications, loadingApplications, fetchApplications } = useJobStore();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const filteredApps = applications.filter(app => app.status === activeTab);

  const getStatusVariant = (status: ApplicationStatus) => {
    switch (status) {
      case 'Pending': return 'info';
      case 'Interview': return 'warning';
      case 'Accepted': return 'success';
      case 'Completed': return 'primary';
      case 'Rejected': return 'error';
      default: return 'neutral';
    }
  };

  const renderCard = (app: Application) => (
    <View key={app.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.companyIconPlaceholder}>
          <Text style={styles.companyInitials}>{app.job.company.substring(0, 2).toUpperCase()}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>{app.job.title}</Text>
          <Text style={styles.company} numberOfLines={1}>{app.job.company}</Text>
        </View>
        <StatusBadge label={app.status} variant={getStatusVariant(app.status)} />
      </View>
      
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Icon name="calendar" size={14} color={colors.textSecondary} />
          <Text style={styles.detailText}>Applied: {new Date(app.appliedAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="dollar-sign" size={14} color={colors.textSecondary} />
          <Text style={styles.detailText}>₹{app.job.salaryMin.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionTextError}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.primaryBtn]} 
          onPress={() => navigation.navigate('JobDetails', { jobId: app.jobId })}
        >
          <Text style={styles.actionTextPrimary}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applications</Text>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {loadingApplications && !refreshing ? (
          <LoadingSkeleton type="jobCard" />
        ) : filteredApps.length === 0 ? (
          <EmptyState 
            icon="file-text" 
            title={`No ${activeTab} Applications`} 
            subtitle={`You do not have any applications in the ${activeTab.toLowerCase()} stage right now.`}
            actionTitle={activeTab === 'Pending' ? "Find Jobs" : undefined}
            onAction={activeTab === 'Pending' ? () => navigation.navigate('WorkerTabs' as any) : undefined}
          />
        ) : (
          filteredApps.map(renderCard)
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: metrics.spacing.l,
    paddingTop: metrics.spacing.xl,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
  },
  tabsContainer: {
    backgroundColor: colors.surface,
    paddingBottom: metrics.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tabsScroll: {
    paddingHorizontal: metrics.spacing.l,
    gap: metrics.spacing.m,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: metrics.radiusPill,
  },
  tabActive: {
    backgroundColor: colors.textPrimary,
  },
  tabText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.surface,
  },
  content: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.m,
    ...metrics.shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
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
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.l,
    backgroundColor: colors.background,
    padding: metrics.spacing.m,
    borderRadius: metrics.radiusS,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: metrics.spacing.m,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: metrics.radiusPill,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  primaryBtn: {
    backgroundColor: colors.primary + '1A',
    borderColor: 'transparent',
  },
  actionTextError: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.error,
  },
  actionTextPrimary: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.primaryDark,
  }
});
