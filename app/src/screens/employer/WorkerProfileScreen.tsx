import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { ScreenContainer, StatusBadge, Button, TrustBadge } from '@/components';
import { colors, typography, metrics } from '@/theme';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/Feather';
import { MainStackParamList } from '@/navigation/MainNavigator';
import { WorkerProfile } from '@/models/User';
import { useEmployerStore } from '@/store/useEmployerStore';
import { useChatStore } from '@/store/useChatStore';

type WorkerProfileRouteProp = RouteProp<MainStackParamList, 'WorkerProfile'>;

export const WorkerProfileScreen = () => {
  const route = useRoute<WorkerProfileRouteProp>();
  const navigation = useNavigation();
  const { workerId } = route.params;
  const { savedWorkers, saveWorker, removeSavedWorker } = useEmployerStore();

  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const isSaved = savedWorkers.some(w => w.id === workerId);

  useEffect(() => {
    // In a real app we'd fetch the specific worker.
    
    const loadWorker = async () => {
      const { recommendedWorkers, savedWorkers, applicants } = useEmployerStore.getState();
      
      let foundWorker = recommendedWorkers.find(w => w.id === workerId) || savedWorkers.find(w => w.id === workerId);
      
      if (!foundWorker) {
        for (const jobId in applicants) {
          const app = applicants[jobId].find(a => a.worker.id === workerId);
          if (app) {
            foundWorker = app.worker;
            break;
          }
        }
      }

      if (foundWorker) {
        setWorker(foundWorker);
      } else {
        Toast.show({ type: 'error', text1: 'Not Found', text2: 'Could not load worker details.' });
      }
    };
    loadWorker();
  }, [workerId]);

  const handleToggleSave = () => {
    if (!worker) return;
    if (isSaved) removeSavedWorker(worker.id);
    else saveWorker(worker);
  };

  const handleHire = () => {
    Toast.show({
      type: 'success',
      text1: 'Hire Request Sent',
      text2: `An offer has been sent to ${worker?.name}. You will be notified when they accept.`,
    });
  };

  if (!worker) return <ScreenContainer backgroundColor={colors.background}><View /></ScreenContainer>;

  return (
    <ScreenContainer backgroundColor={colors.background} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Icon name="share-2" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleSave} style={styles.iconBtn}>
            <Icon name="bookmark" size={24} color={isSaved ? colors.primary : colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>{worker.name.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.name}>{worker.name}</Text>
          <Text style={styles.occupation}>{worker.occupation}</Text>
          <View style={styles.locationRow}>
            <Icon name="map-pin" size={14} color={colors.textSecondary} />
            <Text style={styles.locationText}>{worker.city}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{worker.experience}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{worker.expectedSalary}</Text>
            <Text style={styles.statLabel}>Expected Salary</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.chipsRow}>
            {worker.skills.map(skill => (
              <StatusBadge key={skill} label={skill} variant="neutral" style={styles.chip} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Icon name="clock" size={20} color={colors.textSecondary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailTitle}>Working Hours</Text>
              <Text style={styles.detailValue}>{worker.workingHours}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color={colors.textSecondary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailTitle}>Availability</Text>
              <Text style={styles.detailValue}>{worker.availability}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Icon name="globe" size={20} color={colors.textSecondary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailTitle}>Languages</Text>
              <Text style={styles.detailValue}>{worker.languages.join(', ')}</Text>
            </View>
          </View>
        </View>

        {/* Trust Indicators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trust & Verification</Text>
          <View style={styles.trustRow}>
            <TrustBadge variant="verified-phone" />
            <TrustBadge variant="verified-email" />
            <TrustBadge variant="jobs-completed" value={worker.profileCompletion > 80 ? 8 : 3} />
            <TrustBadge variant="response-time" value="<2 hrs" />
          </View>

          {/* Profile Completion */}
          <View style={styles.completionContainer}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionLabel}>Profile Completion</Text>
              <Text style={styles.completionValue}>{worker.profileCompletion}%</Text>
            </View>
            <View style={styles.completionTrack}>
              <View style={[styles.completionFill, { width: `${worker.profileCompletion}%` }]} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Message" 
          variant="outlined" 
          onPress={() => {
            const conversationId = worker?.id ? worker.id.replace('worker-', 'conv-worker') : 'conv-worker1';
            useChatStore.getState().initializeConversations();
            (navigation as any).navigate('EmployerChatRoom', { conversationId });
          }} 
          style={styles.messageBtn}
        />
        <Button title="Hire Worker" onPress={handleHire} style={styles.hireBtn} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.m,
  },
  headerRight: {
    flexDirection: 'row',
    gap: metrics.spacing.m,
  },
  iconBtn: {
    padding: metrics.spacing.xs,
  },
  content: {
    padding: metrics.spacing.l,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.m,
  },
  avatarInitials: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 32,
    color: colors.primaryDark,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  occupation: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.primary,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.xs,
  },
  locationText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: metrics.radiusCard,
    padding: metrics.spacing.m,
    marginBottom: metrics.spacing.xl,
    ...metrics.shadows.soft,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.divider,
  },
  section: {
    marginBottom: metrics.spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: metrics.spacing.s,
    marginBottom: metrics.spacing.s,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: metrics.spacing.l,
  },
  detailIcon: {
    marginTop: 2,
    marginRight: metrics.spacing.m,
  },
  detailTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    flexDirection: 'row',
    gap: metrics.spacing.m,
  },
  messageBtn: {
    flex: 1,
  },
  hireBtn: {
    flex: 2,
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.s,
    marginBottom: metrics.spacing.m,
  },
  completionContainer: {
    marginTop: metrics.spacing.s,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: metrics.spacing.xs,
  },
  completionLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
  },
  completionValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.primary,
  },
  completionTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.divider,
    overflow: 'hidden',
  },
  completionFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
