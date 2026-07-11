import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, EmptyState, LoadingSkeleton } from '@/components';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { AppNotification, NotificationCategory } from '@/models/Job';
import { notificationService } from '@/services/NotificationService';

const TABS: (NotificationCategory | 'All')[] = ['All', 'Applications', 'Messages', 'Hiring', 'Job Updates', 'System'];

export const EmployerNotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NotificationCategory | 'All'>('All');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load notifications' });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      Toast.show({ type: 'success', text1: 'Marked Read', text2: 'All notifications have been marked as read.' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to mark all as read' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete notification' });
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'Applications': return 'file-text';
      case 'Hiring': return 'check-circle';
      case 'System': return 'info';
      case 'Job Updates': return 'briefcase';
      case 'Messages': return 'message-circle';
      default: return 'bell';
    }
  };

  const getColor = (category: string) => {
    switch (category) {
      case 'Applications': return colors.primary;
      case 'Hiring': return colors.success;
      case 'System': return colors.error;
      case 'Job Updates': return colors.warning;
      case 'Messages': return colors.info;
      default: return colors.textSecondary;
    }
  };

  const getUnreadCount = (category: NotificationCategory | 'All') => {
    if (category === 'All') {
      return notifications.filter(n => !n.isRead).length;
    }
    return notifications.filter(n => n.category === category && !n.isRead).length;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'All') return true;
    return notif.category === activeTab;
  });

  const renderNotification = (item: AppNotification) => (
    <View key={item.id} style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
      <View style={[styles.iconContainer, { backgroundColor: getColor(item.category) + '1A' }]}>
        <Icon name={getIcon(item.category)} size={20} color={getColor(item.category)} />
      </View>
      <View style={styles.content}>
        <View style={styles.cardHeader}>
          <Text style={[styles.title, !item.isRead && styles.titleUnread]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>
            {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
        
        {/* Category Label */}
        <View style={styles.categoryRow}>
          <Text style={[styles.categoryLabel, { color: getColor(item.category) }]}>
            {item.category === 'Job Updates' ? 'Jobs' : item.category}
          </Text>
          {!item.isRead && <View style={styles.unreadIndicator} />}
        </View>
      </View>
      
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
        <Icon name="x" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer backgroundColor={colors.background}>
      <LinearGradient
        colors={colors.gradients.primary} // Orange theme for notifications
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color={colors.surface} />
          </TouchableOpacity>
          <Text style={styles.headerTitleWhite}>Notifications</Text>
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markBtn}>
            <Icon name="check-square" size={22} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map(tab => {
            const unread = getUnreadCount(tab);
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab === 'Job Updates' ? 'Jobs' : tab}
                </Text>
                {unread > 0 && (
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                      {unread}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingSkeleton type="custom" width="100%" height={80} style={{marginBottom: 16, borderRadius: metrics.radiusS}} />
          <LoadingSkeleton type="custom" width="100%" height={80} style={{borderRadius: metrics.radiusS}} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredNotifications.length === 0 ? (
            <EmptyState 
              icon="bell" 
              title="No Notifications" 
              subtitle="You are all caught up!" 
            />
          ) : (
            filteredNotifications.map(renderNotification)
          )}
        </ScrollView>
      )}
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
  markBtn: {
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
  tabsContainer: {
    backgroundColor: colors.surface,
    paddingVertical: metrics.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    marginTop: -20,
  },
  tabsScroll: {
    paddingHorizontal: metrics.spacing.l,
    gap: metrics.spacing.s,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: metrics.radiusPill,
    backgroundColor: colors.secondaryBackground,
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.surface,
  },
  tabBadge: {
    backgroundColor: colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeActive: {
    backgroundColor: colors.surface,
  },
  tabBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 9,
    color: colors.surface,
  },
  tabBadgeTextActive: {
    color: colors.primary,
  },
  listContainer: {
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
    flexGrow: 1,
  },
  loadingContainer: {
    padding: metrics.spacing.l,
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
    backgroundColor: colors.primary + '08',
    borderWidth: 1,
    borderColor: colors.primary + '22',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  content: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    flex: 1,
    marginRight: metrics.spacing.s,
  },
  titleUnread: {
    color: colors.primary,
  },
  time: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  message: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  unreadIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  deleteBtn: {
    padding: metrics.spacing.xs,
    marginLeft: metrics.spacing.s,
    alignSelf: 'flex-start',
  }
});

