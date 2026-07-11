import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { OnlineBadge } from './OnlineBadge';
import { Conversation } from '@/store/useChatStore';

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
  onLongPress?: () => void;
}

export const ConversationCard = ({ conversation, onPress, onLongPress }: ConversationCardProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const initials = conversation.name.substring(0, 2).toUpperCase();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, conversation.isPinned && styles.pinnedCard]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`${conversation.name}, ${conversation.occupation}. ${conversation.isTyping ? 'Typing...' : `Last message: ${conversation.lastMessage}`}. ${conversation.unreadCount > 0 ? `${conversation.unreadCount} unread messages.` : ''}`}
        accessibilityHint="Double tap to open this conversation"
      >
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {conversation.isOnline && <OnlineBadge size={14} />}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {conversation.name}
            </Text>
            <Text style={styles.time}>{conversation.time}</Text>
          </View>

          <Text style={styles.occupation} numberOfLines={1}>
            {conversation.occupation}
          </Text>

          <View style={styles.footer}>
            {conversation.isTyping ? (
              <View style={styles.typingContainer}>
                <Text style={styles.typingText}>Typing...</Text>
              </View>
            ) : (
              <Text style={styles.lastMessage} numberOfLines={1}>
                {conversation.lastMessage}
              </Text>
            )}

            <View style={styles.badgeRow}>
              {conversation.isPinned && (
                <Icon name="pin" size={14} color={colors.textSecondary} style={styles.pinIcon} />
              )}
              {conversation.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: metrics.spacing.m,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    alignItems: 'center',
  },
  pinnedCard: {
    backgroundColor: colors.secondaryBackground,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: metrics.spacing.m,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary + '1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.primaryDark,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
    flex: 1,
    marginRight: metrics.spacing.s,
  },
  time: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  occupation: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    flex: 1,
    marginRight: metrics.spacing.s,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  typingText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.body2,
    color: colors.success,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinIcon: {
    transform: [{ rotate: '45deg' }],
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.surface,
  },
});
