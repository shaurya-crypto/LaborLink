import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox, Briefcase, Bell, Search, MapPin, User, AlertCircle } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, typography, metrics } from '@/theme';
import { Button } from './Button';

// Map generic string icons to Lucide components
const IconMap: Record<string, React.FC<any>> = {
  inbox: Inbox,
  briefcase: Briefcase,
  bell: Bell,
  search: Search,
  map: MapPin,
  user: User,
  alert: AlertCircle
};

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
  gradient?: string[];
}

export const EmptyState = ({ 
  icon = 'inbox', 
  title, 
  subtitle, 
  actionTitle, 
  onAction,
  gradient = colors.gradients.primary
}: EmptyStateProps) => {
  const IconComponent = IconMap[icon] || Inbox;

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeInDown.duration(400).springify().damping(15)}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconCircle}
      >
        <View style={styles.iconInner}>
          <IconComponent size={36} color={gradient[0]} strokeWidth={1.5} />
        </View>
      </LinearGradient>
      
      <Text style={styles.title}>{title}</Text>
      
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      {actionTitle && onAction && (
        <View style={styles.actionContainer}>
          <Button 
            title={actionTitle} 
            onPress={onAction} 
            variant="primary" 
            style={styles.actionBtn}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.xxxl,
    backgroundColor: colors.transparent,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.spacing.xl,
    ...metrics.shadows.glow,
  },
  iconInner: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.sizes.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: metrics.spacing.m,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: metrics.spacing.xl,
    lineHeight: 26,
    paddingHorizontal: metrics.spacing.m,
  },
  actionContainer: {
    width: '100%',
    paddingHorizontal: metrics.spacing.xl,
  },
  actionBtn: {
    width: '100%',
  }
});
