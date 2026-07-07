import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenContainer, EmptyState } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useJobStore } from '@/store/useJobStore';
import { AppNotification } from '@/models/Job';
import Icon from 'react-native-vector-icons/Feather';

export const NotificationsScreen = () => {
  const { notifications, fetchNotifications, markAllNotificationsRead, deleteNotification } = useJobStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Applications': return 'briefcase';
      case 'Recommendations': return 'star';
      case 'Messages': return 'message-circle';
      default: return 'bell';
    }
  };

  const renderNotification = (notif: AppNotification) => (
    <View key={notif.id} style={[styles.card, !notif.isRead && styles.cardUnread]}>
      <View style={styles.iconCircle}>
        <Icon name={getIconForCategory(notif.category)} size={20} color={colors.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, !notif.isRead && styles.titleUnread]}>{notif.title}</Text>
        <Text style={styles.message}>{notif.message}</Text>
        <Text style={styles.time}>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteNotification(notif.id)}>
        <Icon name="x" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={markAllNotificationsRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <EmptyState 
            icon="bell-off" 
            title="No Notifications" 
            subtitle="You're all caught up! We will notify you when there are updates on your applications."
          />
        ) : (
          notifications.map(renderNotification)
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  markReadText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body2,
    color: colors.primary,
    marginBottom: 4,
  },
  content: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: metrics.spacing.l,
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.s,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardUnread: {
    borderColor: colors.primary + '33', // 20% opacity
    backgroundColor: colors.primary + '05',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  titleUnread: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primaryDark,
  },
  message: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    color: colors.textSecondary,
  },
  deleteBtn: {
    padding: metrics.spacing.xs,
    marginLeft: metrics.spacing.s,
    alignSelf: 'flex-start',
  }
});
