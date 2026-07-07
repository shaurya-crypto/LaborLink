import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer, Button, JobCard, CategoryCard, LoadingSkeleton } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { useJobStore } from '@/store/useJobStore';
import { authService } from '@/services/AuthService';
import { mockDataService } from '@/services/MockDataService';
import { MainStackParamList } from '@/navigation/MainNavigator';

export const HomeScreen = () => {
  const { role } = useAppStore();
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  const mainNav = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const { recommendedJobs, nearbyJobs, loadingJobs, fetchHomeData, toggleBookmark, bookmarkedJobIds } = useJobStore();
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (role === 'worker') {
      fetchHomeData();
      mockDataService.getCategories().then(setCategories);
    }
  }, [role]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHomeData();
    setRefreshing(false);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const handleLogout = async () => {
    await authService.logout();
    useAuthStore.getState().clearAuth();
  };

  if (role === 'employer') {
    return (
      <ScreenContainer backgroundColor={colors.background} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'Employer'}!</Text>
        </View>
        <View style={styles.employerContent}>
          <View style={styles.emptyState}>
            <Icon name="briefcase" size={48} color={colors.divider} />
            <Text style={styles.emptyTitle}>No Jobs Yet</Text>
            <Text style={styles.emptySubtitle}>Post a job to start finding workers.</Text>
            <Button 
              title="Post a Job" 
              onPress={() => navigation.navigate('EmployerSetup')} 
              style={styles.postJobBtn} 
              icon={<Icon name="plus" size={20} color={colors.surface} />}
            />
          </View>
        </View>
        <Button title="Logout" variant="text" onPress={handleLogout} />
      </ScreenContainer>
    );
  }

  // WORKER DASHBOARD
  return (
    <ScreenContainer backgroundColor={colors.background}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.topBar}>
          <Text style={styles.logoText}>LaborLink</Text>
          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('SearchTab')}>
              <Icon name="search" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => mainNav.navigate('Notifications')}>
              <Icon name="bell" size={24} color={colors.textPrimary} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>{getGreeting()} {user?.name?.split(' ')[0] || 'Worker'} 👋</Text>
          <Text style={styles.greetingSub}>Ready to find today's work?</Text>
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchPlaceholder}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('SearchTab')}
          >
            <Icon name="search" size={20} color={colors.textSecondary} />
            <Text style={styles.searchText}>Search jobs, electricians, plumbers...</Text>
            <View style={styles.filterBtn}>
              <Icon name="sliders" size={16} color={colors.surface} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {categories.length === 0 ? (
              <LoadingSkeleton type="category" />
            ) : (
              categories.map(cat => (
                <CategoryCard key={cat.id} name={cat.name} iconName={cat.icon} onPress={() => {}} />
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          {loadingJobs && !refreshing ? (
            <LoadingSkeleton type="jobCard" />
          ) : (
            recommendedJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onPress={() => mainNav.navigate('JobDetails', { jobId: job.id })}
                onBookmark={() => toggleBookmark(job)}
                isBookmarked={bookmarkedJobIds.includes(job.id)}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Jobs</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
          </View>
          {loadingJobs && !refreshing ? (
            <LoadingSkeleton type="jobCard" />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
              {nearbyJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  style={styles.horizontalCard}
                  onPress={() => mainNav.navigate('JobDetails', { jobId: job.id })}
                  onBookmark={() => toggleBookmark(job)}
                  isBookmarked={bookmarkedJobIds.includes(job.id)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: metrics.spacing.l,
  },
  scrollContent: {
    paddingBottom: metrics.spacing.xxl,
  },
  header: {
    marginTop: metrics.spacing.l,
    marginBottom: metrics.spacing.xl,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.l,
    paddingTop: metrics.spacing.l,
  },
  logoText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.primary,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: metrics.spacing.m,
  },
  iconBtn: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.background,
  },
  greetingSection: {
    paddingHorizontal: metrics.spacing.l,
    paddingTop: metrics.spacing.l,
    marginBottom: metrics.spacing.l,
  },
  greetingText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  greetingSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: metrics.spacing.l,
    marginBottom: metrics.spacing.xl,
  },
  searchPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.spacing.m,
    height: 52,
    borderRadius: metrics.radiusCard,
    borderWidth: 1,
    borderColor: colors.divider,
    ...metrics.shadows.soft,
  },
  searchText: {
    flex: 1,
    marginLeft: metrics.spacing.s,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: metrics.radiusS,
    backgroundColor: colors.primary,
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
    paddingHorizontal: metrics.spacing.l,
    marginBottom: metrics.spacing.m,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
  },
  seeAll: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  },
  horizontalScroll: {
    paddingHorizontal: metrics.spacing.l,
    gap: metrics.spacing.m,
  },
  horizontalCard: {
    width: 280,
  },
  employerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: metrics.spacing.xxl,
    borderRadius: metrics.radiusCard,
    ...metrics.shadows.soft,
  },
  emptyTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginTop: metrics.spacing.m,
  },
  emptySubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: metrics.spacing.s,
    marginBottom: metrics.spacing.l,
  },
  postJobBtn: {
    paddingHorizontal: metrics.spacing.xl,
  }
});
