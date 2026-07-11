/* eslint-disable @typescript-eslint/no-unused-vars */
 
 
﻿import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Text,
} from 'react-native';
import { colors, metrics, typography } from '@/theme';
import { Button } from './Button';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  primaryAction?: {
    title: string;
    onPress: () => void;
  };
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  description,
  children,
  primaryAction,
}) => {
  // Simple custom bottom sheet implementation
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />
          
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
          
          {children && <View style={styles.content}>{children}</View>}
          
          {primaryAction && (
            <Button
              title={primaryAction.title}
              onPress={primaryAction.onPress}
              style={styles.actionButton}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.4)', // Ink Dark with opacity
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: metrics.radiusBottomSheet,
    borderTopRightRadius: metrics.radiusBottomSheet,
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
    ...metrics.shadows.medium,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: metrics.spacing.l,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.s,
    textAlign: 'center',
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: metrics.spacing.l,
  },
  content: {
    marginBottom: metrics.spacing.l,
  },
  actionButton: {
    marginTop: metrics.spacing.s,
  },
});
