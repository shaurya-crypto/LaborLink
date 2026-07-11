import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

interface OfflineBannerProps {
  onRetry?: () => Promise<void> | void;
}

export const OfflineBanner = ({ onRetry }: OfflineBannerProps) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    if (onRetry) {
      await onRetry();
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    setRetrying(false);
  };

  return (
    <View style={styles.banner}>
      <Icon name="wifi-off" size={16} color={colors.surface} style={styles.icon} />
      <Text style={styles.text} numberOfLines={1}>
        No internet connection. offline mode active.
      </Text>
      <TouchableOpacity 
        style={styles.retryBtn} 
        onPress={handleRetry}
        disabled={retrying}
      >
        {retrying ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={styles.retryText}>Retry</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.error,
    paddingVertical: 10,
    paddingHorizontal: metrics.spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    marginRight: metrics.spacing.s,
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.surface,
    flex: 1,
  },
  retryBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: metrics.radiusPill,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 56,
    height: 24,
  },
  retryText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 10,
    color: colors.error,
  },
});
