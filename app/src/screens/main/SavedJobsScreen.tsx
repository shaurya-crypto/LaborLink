import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, JobCard, EmptyState } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useJobStore } from '@/store/useJobStore';
import { MainStackParamList } from '@/navigation/MainNavigator';

export const SavedJobsScreen = () => {
  const { bookmarkedJobs, bookmarkedJobIds, toggleBookmark } = useJobStore();
  const mainNav = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Jobs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {bookmarkedJobs.length === 0 ? (
          <EmptyState 
            icon="bookmark" 
            title="No Saved Jobs" 
            subtitle="Jobs you bookmark will appear here so you can easily find and apply to them later."
            actionTitle="Browse Jobs"
            onAction={() => mainNav.navigate('WorkerTabs' as any)}
          />
        ) : (
          bookmarkedJobs.map(job => (
            <JobCard 
              key={job.id}
              job={job}
              onPress={() => mainNav.navigate('JobDetails', { jobId: job.id })}
              onBookmark={() => toggleBookmark(job)}
              isBookmarked={bookmarkedJobIds.includes(job.id)}
            />
          ))
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
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
  },
  content: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  }
});
