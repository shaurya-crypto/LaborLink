import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { ScreenContainer, ApplicantCard, EmptyState, LoadingSkeleton, Button } from '@/components';
import { colors, typography, metrics } from '@/theme';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Applicant } from '@/models/Job';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEmployerStore } from '@/store/useEmployerStore';


type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ApplicantsScreen = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'Applicants'>>();
  const { jobId } = route.params;
  const { applicants: storeApplicants, hireWorker, rejectWorker, shortlistWorker, fetchJobApplicants, saveWorker } = useEmployerStore();
  const applicants = storeApplicants[jobId] || [];
  const loading = useEmployerStore(state => state.loading);
  const navigation = useNavigation<NavigationProp>();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{title: string; message: string; action: () => void} | null>(null);

  useEffect(() => {
    fetchJobApplicants(jobId);
  }, [jobId, fetchJobApplicants]);

  const handleHire = (applicant: Applicant) => {
    setModalConfig({
      title: 'Hire Worker',
      message: `Are you sure you want to hire ${applicant.worker.name}?`,
      action: async () => {
        setModalVisible(false);
        await hireWorker(jobId, applicant.id);
        Toast.show({ type: 'success', text1: 'Success', text2: `${applicant.worker.name} has been hired!` });
      }
    });
    setModalVisible(true);
  };

  const handleReject = async (applicantId: string) => {
    await rejectWorker(jobId, applicantId);
    Toast.show({ type: 'info', text1: 'Applicant Rejected' });
  };

  const handleShortlist = async (applicant: Applicant) => {
    saveWorker(applicant.worker);
    await shortlistWorker(jobId, applicant.id);
    Toast.show({ type: 'success', text1: 'Shortlisted', text2: `${applicant.worker.name} has been added to your Saved Workers.` });
  };

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <LinearGradient
        colors={colors.gradients.primary} // Purple theme for employer actions
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitleWhite}>Applicants</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerSubtitleWhite}>{loading ? 'Loading...' : `${applicants.length} Total Applicants`}</Text>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingSkeleton type="custom" width="100%" height={200} style={styles.skeletonSpacer} />
          <LoadingSkeleton type="custom" width="100%" height={200} style={styles.skeletonCard} />
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

      {/* Confirmation Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalConfig?.title}</Text>
            <Text style={styles.modalMessage}>{modalConfig?.message}</Text>
            <View style={styles.modalActions}>
              <Button 
                title="Cancel" 
                variant="outlined" 
                onPress={() => setModalVisible(false)} 
                style={styles.modalBtn} 
              />
              <Button 
                title="Confirm" 
                onPress={() => modalConfig?.action()} 
                style={[styles.modalBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]} 
              />
            </View>
          </View>
        </View>
      </Modal>

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.l,
    marginBottom: metrics.spacing.m,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWhite: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.surface,
  },
  headerContent: {
    paddingHorizontal: metrics.spacing.l,
    alignItems: 'center',
    marginBottom: metrics.spacing.s,
  },
  headerSubtitleWhite: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: 'rgba(255,255,255,0.9)',
  },
  listContainer: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
    flexGrow: 1,
  },
  loadingContainer: {
    padding: metrics.spacing.l,
    paddingTop: metrics.spacing.l,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.l,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.xl,
    width: '100%',
    ...metrics.shadows.medium,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
  },
  modalMessage: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.xl,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: metrics.spacing.m,
  },
  modalBtn: {
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
  skeletonSpacer: {
    marginBottom: 16, 
    borderRadius: metrics.radiusCard,
  },
  skeletonCard: {
    borderRadius: metrics.radiusCard,
  },
});


