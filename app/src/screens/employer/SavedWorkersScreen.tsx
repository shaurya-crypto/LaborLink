import React from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { ScreenContainer, WorkerCard, EmptyState } from '@/components';
import { colors, typography, metrics } from '@/theme';
import { useEmployerStore } from '@/store/useEmployerStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { WorkerProfile } from '@/models/User';

export const SavedWorkersScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { savedWorkers, removeSavedWorker } = useEmployerStore();

  const handleToggleSave = (worker: WorkerProfile) => {
    removeSavedWorker(worker.id);
  };

  return (
    <ScreenContainer backgroundColor={colors.background} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
      </View>

      <FlatList
        data={savedWorkers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <WorkerCard 
            worker={item} 
            onPress={() => navigation.navigate('WorkerProfile', { workerId: item.id })}
            onSave={() => handleToggleSave(item)}
            isSaved={true}
          />
        )}
        ListEmptyComponent={
          <EmptyState 
            icon="bookmark" 
            title="No Saved Workers" 
            subtitle="Workers you save for later will appear here." 
          />
        }
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
  listContainer: {
    paddingHorizontal: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
    flexGrow: 1,
  }
});
