import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';
import { ActivityItem } from '@/store/useActivityStore';

interface ActivityCardProps {
  activity: ActivityItem;
  onPress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ActivityCard = ({ activity, onPress }: ActivityCardProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (onPress) scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (onPress) scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getIconName = (category: ActivityItem['category']) => {
    switch (category) {
      case 'Applications': return 'briefcase';
      case 'Messages': return 'message-circle';
      case 'Hiring': return 'check-circle';
      case 'Jobs': return 'file-text';
      case 'System': return 'info';
      default: return 'bell';
    }
  };

  const getIconColor = (category: ActivityItem['category']) => {
    switch (category) {
      case 'Applications': return colors.primary;
      case 'Messages': return colors.primary; // Chats are usually blue
      case 'Hiring': return colors.primary;
      case 'Jobs': return colors.primary;
      case 'System': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const formattedTime = new Date(activity.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AnimatedTouchable 
      style={[styles.card, animatedStyle]} 
      onPress={onPress} 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: getIconColor(activity.category) + '15' }
        ]}
      >
        <Icon name={getIconName(activity.category)} size={22} color={getIconColor(activity.category)} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
        <Text style={styles.description}>{activity.description}</Text>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: metrics.spacing.l, // More breathing room
    borderRadius: metrics.radiusCard,
    marginBottom: metrics.spacing.m,
    alignItems: 'center',
    ...metrics.shadows.medium, // Upgraded shadow
  },
  iconContainer: {
    width: 52, // Larger icon
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  header: {
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
  time: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
