import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput as RNTextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer, JobCard, LoadingSkeleton, EmptyState, FilterSheet } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useJobStore } from '@/store/useJobStore';
import { useAuthStore } from '@/store/useAuthStore';
import { mockDataService } from '@/services/MockDataService';
import { Job } from '@/models/Job';
import { MainStackParamList } from '@/navigation/MainNavigator';

export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const { recentSearches, addRecentSearch, clearRecentSearches, toggleBookmark, bookmarkedJobIds } = useJobStore();
  const { user } = useAuthStore();
  const mainNav = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const TRENDING = ['Electrician in Mumbai', 'Plumber', 'Tata Projects', 'Helper'];

  // Debounce search
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const res = await mockDataService.searchJobs(query, user);
      setResults(res);
      setIsSearching(false);
      setHasSearched(true);
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearchSubmit = () => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
  };

  const handleSelectRecent = (q: string) => {
    setQuery(q);
    handleSearchSubmit();
  };

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.textSecondary} />
          <RNTextInput
            style={styles.input}
            placeholder="Search for jobs, skills..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Icon name="x-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Icon name="mic" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <Icon name="sliders" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!query && !hasSearched && (
          <>
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.chips}>
                  {recentSearches.map((s, idx) => (
                    <TouchableOpacity key={idx} style={styles.chip} onPress={() => handleSelectRecent(s)}>
                      <Icon name="clock" size={14} color={colors.textSecondary} />
                      <Text style={styles.chipText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Searches</Text>
              </View>
              <View style={styles.chips}>
                {TRENDING.map((s, idx) => (
                  <TouchableOpacity key={idx} style={styles.chip} onPress={() => handleSelectRecent(s)}>
                    <Icon name="trending-up" size={14} color={colors.primary} />
                    <Text style={styles.chipText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {isSearching && (
          <View style={styles.resultsContainer}>
            <LoadingSkeleton type="jobCard" />
          </View>
        )}

        {!isSearching && hasSearched && results.length === 0 && (
          <EmptyState 
            icon="search" 
            title="No jobs found" 
            subtitle={`We couldn't find any jobs matching "${query}". Try different keywords or adjust filters.`} 
          />
        )}

        {!isSearching && hasSearched && results.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsCount}>{results.length} jobs found</Text>
            {results.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onPress={() => mainNav.navigate('JobDetails', { jobId: job.id })}
                onBookmark={() => toggleBookmark(job)}
                isBookmarked={bookmarkedJobIds.includes(job.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <FilterSheet 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)} 
        onApply={(filters) => {
          setFilterVisible(false);
          setHasSearched(true);
        }}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: metrics.spacing.l,
    paddingTop: metrics.spacing.xl,
    backgroundColor: colors.background,
    gap: metrics.spacing.m,
  },
  searchBar: {
    flex: 1,
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
  input: {
    flex: 1,
    marginLeft: metrics.spacing.s,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    height: '100%',
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: metrics.radiusCard,
    backgroundColor: colors.primary + '1A', // Light primary
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: metrics.spacing.xxl,
  },
  section: {
    padding: metrics.spacing.l,
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
  },
  clearText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.s,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.spacing.m,
    paddingVertical: 10,
    borderRadius: metrics.radiusPill,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  chipText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textPrimary,
  },
  resultsContainer: {
    padding: metrics.spacing.l,
  },
  resultsCount: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.m,
  }
});
