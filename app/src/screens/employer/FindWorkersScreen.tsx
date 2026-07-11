/* eslint-disable @typescript-eslint/no-unused-vars */
 
 
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { ScreenContainer, TextInput, WorkerCard, FilterSheet, EmptyState, LoadingSkeleton } from '@/components';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { WorkerProfile } from '@/models/User';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { useEmployerStore } from '@/store/useEmployerStore';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const TRENDING = ['Electrician', 'Plumber', 'Carpenter', 'Driver'];

export const FindWorkersScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { savedWorkers, saveWorker, removeSavedWorker } = useEmployerStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    loadNearbyWorkers();
  }, []);

  const loadNearbyWorkers = async () => {
    setLoading(true);
    const data: any[] = [];
    setWorkers(data);
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setLoading(true);
      const results: any[] = [];
      setWorkers(results);
      setLoading(false);
    } else if (query.length === 0) {
      loadNearbyWorkers();
    }
  };

  const handleToggleSave = (worker: WorkerProfile) => {
    const isSaved = savedWorkers.some(w => w.id === worker.id);
    if (isSaved) {
      removeSavedWorker(worker.id);
    } else {
      saveWorker(worker);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.background} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Workers</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            label=""
            placeholder="Search skills, occupations..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearBtn}>
              <Icon name="x-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterVisible(true)}>
          <Icon name="sliders" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {!searchQuery && (
        <View style={styles.trendingContainer}>
          <Text style={styles.sectionTitle}>Trending</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TRENDING}
            keyExtractor={item => item}
            contentContainerStyle={styles.trendingList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.trendingChip} onPress={() => handleSearch(item)}>
                <Text style={styles.trendingText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {loading ? (
        <View style={styles.listContainer}>
          <LoadingSkeleton type="custom" width="100%" height={160} style={{marginBottom: 16, borderRadius: metrics.radiusCard}} />
          <LoadingSkeleton type="custom" width="100%" height={160} style={{marginBottom: 16, borderRadius: metrics.radiusCard}} />
          <LoadingSkeleton type="custom" width="100%" height={160} style={{borderRadius: metrics.radiusCard}} />
        </View>
      ) : (
        <FlatList
          data={workers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <WorkerCard 
              worker={item} 
              onPress={() => navigation.navigate('WorkerProfile', { workerId: item.id })}
              onSave={() => handleToggleSave(item)}
              isSaved={savedWorkers.some(w => w.id === item.id)}
            />
          )}
          ListEmptyComponent={
            <EmptyState 
              icon="search" 
              title="No Workers Found" 
              subtitle="Try adjusting your search query or filters." 
            />
          }
        />
      )}

      <FilterSheet 
        visible={isFilterVisible} 
        onClose={() => setIsFilterVisible(false)} 
        onApply={(filters) => {
          setIsFilterVisible(false);
          // Apply filters
        }} 
      />
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: metrics.spacing.l,
    marginBottom: metrics.spacing.l,
    gap: metrics.spacing.m,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusS,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: metrics.spacing.m,
  },
  searchIcon: {
    marginRight: metrics.spacing.s,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 0,
  },
  clearBtn: {
    padding: metrics.spacing.xs,
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusS,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingContainer: {
    marginBottom: metrics.spacing.m,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    paddingHorizontal: metrics.spacing.l,
    marginBottom: metrics.spacing.s,
  },
  trendingList: {
    paddingHorizontal: metrics.spacing.l,
    gap: metrics.spacing.s,
  },
  trendingChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.s,
    borderRadius: metrics.radiusPill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendingText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
    flexGrow: 1,
  }
});
