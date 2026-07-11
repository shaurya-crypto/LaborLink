import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { ScreenContainer, JobCard, CategoryCard, LoadingSkeleton, ActivityCard, EmptyState } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { useJobStore } from '@/store/useJobStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useChatStore } from '@/store/useChatStore';
import { authService } from '@/services/AuthService';
import { MainStackParamList } from '@/navigation/MainNavigator';

export const HomeScreen = () => {
  const { role } = useAppStore();
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  const mainNav = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const { recommendedJobs, nearbyJobs, loadingJobs, fetchHomeData, toggleBookmark, bookmarkedJobIds } = useJobStore();
  const { todayActivities, initializeActivities } = useActivityStore();
  const { totalUnread, initializeConversations } = useChatStore();
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (role === 'worker') {
      fetchHomeData();
      setCategories([
        { id: 'cat-1', name: 'Electrician', icon: 'zap' },
        { id: 'cat-2', name: 'Plumber', icon: 'tool' },
        { id: 'cat-3', name: 'Carpenter', icon: 'home' },
        { id: 'cat-4', name: 'Painter', icon: 'pen-tool' },
        { id: 'cat-5', name: 'Mason', icon: 'grid' },
      ]);
      initializeActivities();
      initializeConversations();
    }
  }, [role, fetchHomeData, initializeActivities, initializeConversations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHomeData();
    setRefreshing(false);
  }, [fetchHomeData]);

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
      <ScreenContainer backgroundColor={colors.background}>
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.employerHeaderGradient}
        >
          <View style={styles.topBar}>
            <Text style={styles.logoTextWhite}>LaborLink</Text>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
               <Icon name="log-out" size={20} color={colors.surface} />
            </TouchableOpacity>
          </View>
          <View style={styles.employerHeaderContent}>
            <Text style={styles.greetingTextWhite}>Welcome back,</Text>
            <Text style={styles.nameWhite}>{user?.name || 'Employer'}!</Text>
          </View>
        </LinearGradient>
        <View style={styles.employerContent}>
          <EmptyState 
            icon="briefcase" 
            title="No Jobs Yet" 
            subtitle="Post a job to start finding workers." 
            actionTitle="Post a Job" 
            onAction={() => navigation.navigate('EmployerSetup')}
            gradient={colors.gradients.primary}
          />
        </View>
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
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.topBar}>
            <Text style={styles.logoTextWhite}>LaborLink</Text>
            <View style={styles.topBarRight}>
              <TouchableOpacity style={styles.iconBtnWhite} onPress={() => navigation.navigate('SearchTab')}>
                <Icon name="search" size={24} color={colors.surface} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtnWhite} onPress={() => mainNav.navigate('Notifications')}>
                <Icon name="bell" size={24} color={colors.surface} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.greetingSection}>
            <Text style={styles.greetingTextWhite}>{getGreeting()}</Text>
            <Text style={styles.nameWhite}>{user?.name?.split(' ')[0] || 'Worker'} 👋</Text>
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
        </LinearGradient>

        {/* QUICK ACTIONS */}
        <View style={[styles.section, styles.quickActionsSection]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickAction} onPress={() => mainNav.navigate('ConversationList')}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="message-circle" size={24} color={colors.primary} />
                {totalUnread > 0 && (
                  <View style={styles.quickActionBadge}>
                    <Text style={styles.quickActionBadgeText}>{totalUnread > 9 ? '9+' : totalUnread}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.quickActionLabel}>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => mainNav.navigate('Activity')}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="activity" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => mainNav.navigate('Notifications')}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="bell" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Alerts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => mainNav.navigate('SavedJobs')}>
              <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="bookmark" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionLabel}>Saved</Text>
            </TouchableOpacity>
          </ScrollView>
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
            <View style={{ paddingHorizontal: metrics.spacing.l }}>
              {recommendedJobs.length === 0 ? (
                 <EmptyState title="No Jobs Found" subtitle="Check back later." />
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

        {/* RECENT ACTIVITY */}
        {todayActivities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => mainNav.navigate('Activity')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: metrics.spacing.l }}>
              {todayActivities.slice(0, 3).map(activity => (
                <ActivityCard key={activity.id} activity={activity} onPress={() => mainNav.navigate('Activity')} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: metrics.spacing.xxl,
  },
  headerGradient: {
    paddingTop: 50, // Safe area approx
    paddingBottom: metrics.spacing.xxl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: metrics.spacing.m,
  },
  employerHeaderGradient: {
    paddingTop: 50,
    paddingBottom: metrics.spacing.xxxl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.l,
    marginBottom: metrics.spacing.xl,
  },
  logoTextWhite: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.surface,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: metrics.spacing.m,
  },
  iconBtnWhite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  employerHeaderContent: {
    paddingHorizontal: metrics.spacing.l,
  },
  greetingSection: {
    paddingHorizontal: metrics.spacing.l,
    marginBottom: metrics.spacing.xl,
  },
  greetingTextWhite: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  nameWhite: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.surface,
  },
  searchContainer: {
    paddingHorizontal: metrics.spacing.l,
    transform: [{ translateY: 26 }],
    zIndex: 10,
  },
  searchPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.spacing.m,
    height: 60, // Taller touch target
    borderRadius: metrics.radiusCard,
    ...metrics.shadows.medium,
  },
  searchText: {
    flex: 1,
    marginLeft: metrics.spacing.s,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: metrics.radiusS,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionsSection: {
    marginTop: 16,
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
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  },
  horizontalScroll: {
    paddingHorizontal: metrics.spacing.l,
    gap: metrics.spacing.m,
    paddingBottom: metrics.spacing.m,
  },
  horizontalCard: {
    width: 300,
  },
  employerContent: {
    flex: 1,
    marginTop: -40,
  },
  quickActionsRow: {
    paddingHorizontal: metrics.spacing.l,
    gap: metrics.spacing.l,
    paddingBottom: metrics.spacing.m,
  },
  quickAction: {
    alignItems: 'center',
    width: 72,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.s,
    ...metrics.shadows.soft,
  },
  quickActionLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActionBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  quickActionBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.surface,
  },
});


