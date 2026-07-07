import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenContainer, EmptyState, LoadingSkeleton } from '@/components';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { mockDataService } from '@/services/MockDataService';
import { AppNotification } from '@/models/Job';

export const EmployerNotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await mockDataService.getEmployerNotifications();
    setNotifications(data);
    setLoading(false);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Applications': return 'file-text';
      case 'Hiring': return 'check-circle';
      case 'System': return 'info';
      case 'Job Updates': return 'briefcase';
      default: return 'bell';
    }
  };

  const getColor = (category: string) => {
    switch (category) {
      case 'Applications': return colors.primary;
      case 'Hiring': return colors.success;
      case 'System': return colors.info;
      case 'Job Updates': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead}>
          <Icon name="check-square" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.listContainer}>
          <LoadingSkeleton type="custom" width="100%" height={80} style={{marginBottom: 16, borderRadius: metrics.radiusS}} />
          <LoadingSkeleton type="custom" width="100%" height={80} style={{borderRadius: metrics.radiusS}} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
              <View style={[styles.iconContainer, { backgroundColor: getColor(item.category) + '1A' }]}>
                <Icon name={getIcon(item.category)} size={20} color={getColor(item.category)} />
              </View>
              <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <EmptyState 
              icon="bell" 
              title="No Notifications" 
              subtitle="You're all caught up!" 
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
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: metrics.spacing.m,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.m,
    ...metrics.shadows.soft,
  },
  unreadCard: {
    backgroundColor: colors.primary + '0A', // very light primary
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  message: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  time: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  }
});
