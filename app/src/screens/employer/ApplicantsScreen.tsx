import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer, ApplicantCard, EmptyState, LoadingSkeleton } from '@/components';
import { colors, typography, metrics } from '@/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { mockDataService } from '@/services/MockDataService';
import { Applicant } from '@/models/Job';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEmployerStore } from '@/store/useEmployerStore';

type ApplicantsRouteProp = RouteProp<MainStackParamList, 'Applicants'>;
type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ApplicantsScreen = () => {
  const route = useRoute<ApplicantsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { jobId } = route.params;
  const { saveWorker } = useEmployerStore();

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  const loadApplicants = async () => {
    setLoading(true);
    const data = await mockDataService.getJobApplicants(jobId);
    setApplicants(data);
    setLoading(false);
  };

  const handleHire = (applicant: Applicant) => {
    Alert.alert(
      'Hire Worker',
      `Are you sure you want to hire ${applicant.worker.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Hire', 
          style: 'default',
          onPress: async () => {
            await mockDataService.hireApplicant(applicant.id);
            setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, status: 'Accepted' } : a));
            Alert.alert('Success', `${applicant.worker.name} has been hired!`);
          }
        }
      ]
    );
  };

  const handleReject = (applicantId: string) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'Rejected' } : a));
  };

  const handleShortlist = (applicant: Applicant) => {
    saveWorker(applicant.worker);
    setApplicants(prev => prev.map(a => a.id === applicant.id ? { ...a, status: 'Interview' } : a));
    Alert.alert('Shortlisted', `${applicant.worker.name} has been added to your Saved Workers.`);
  };

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applicants</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.listContainer}>
          <LoadingSkeleton type="custom" width="100%" height={200} style={{marginBottom: 16, borderRadius: metrics.radiusCard}} />
          <LoadingSkeleton type="custom" width="100%" height={200} style={{borderRadius: metrics.radiusCard}} />
        </View>
      ) : (
        <FlatList
          data={applicants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ApplicantCard 
              applicant={item} 
              onPress={() => navigation.navigate('WorkerProfile', { workerId: item.worker.id })}
              onHire={() => handleHire(item)}
              onReject={() => handleReject(item.id)}
              onShortlist={() => handleShortlist(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState 
              icon="users" 
              title="No Applicants Yet" 
              subtitle="When workers apply to this job, they will appear here." 
            />
          }
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.m,
  },
  backBtn: {
    padding: metrics.spacing.xs,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
  },
  listContainer: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
    flexGrow: 1,
  }
});
