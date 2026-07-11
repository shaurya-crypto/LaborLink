/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
 
﻿import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import { Message } from '@/store/useChatStore';
import { colors, typography, metrics } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = width * 0.75;

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe }) => {
  const opacityAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.9);

  useEffect(() => {
    opacityAnim.value = withTiming(1, { duration: 300 });
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 200 });
     
  }, []);

  const renderStatus = () => {
    if (!isMe) return null;
    let iconColor = colors.textSecondary;
    if (message.status === 'seen') iconColor = colors.primary;
    else if (message.status === 'delivered') iconColor = colors.textSecondary;

    return (
      <View style={styles.statusContainer}>
        {message.status === 'seen' ? (
          <View style={styles.doubleCheck}>
            <Icon name="check" size={12} color={iconColor} style={styles.checkIcon} />
            <Icon name="check" size={12} color={iconColor} />
          </View>
        ) : (
          <Icon name="check" size={12} color={iconColor} />
        )}
      </View>
    );
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <View style={styles.mediaContainer}>
            {message.mediaUrl ? (
              <Image source={{ uri: message.mediaUrl }} style={styles.imageContent} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Icon name="image" size={32} color={isMe ? colors.surface + '80' : colors.textSecondary} />
                <Text style={[styles.mediaText, { color: isMe ? colors.surface : colors.textPrimary }]}>Photo attachment</Text>
              </View>
            )}
          </View>
        );

      case 'document':
        return (
          <View style={[styles.docContainer, isMe ? styles.docContainerMe : styles.docContainerOther]}>
            <Icon name="file-text" size={24} color={isMe ? colors.surface : colors.primary} />
            <View style={styles.docTextContainer}>
              <Text style={[styles.docTitle, { color: isMe ? colors.surface : colors.textPrimary }]} numberOfLines={1}>
                {message.fileName || 'Document'}
              </Text>
              <Text style={[styles.docSubtitle, { color: isMe ? colors.surface + 'B3' : colors.textSecondary }]}>
                {message.mediaSize || 'Unknown Size'} • PDF
              </Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Icon name="download" size={16} color={isMe ? colors.surface : colors.textPrimary} />
            </TouchableOpacity>
          </View>
        );

      case 'voice':
        return (
          <View style={styles.voiceContainer}>
            <Icon name="play" size={16} color={isMe ? colors.surface : colors.primary} />
            <View style={styles.waveformContainer}>
              {[0.4, 0.7, 0.5, 0.9, 0.3, 0.6, 0.8, 0.4, 0.7, 0.5].map((h, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.waveBar, 
                    { 
                      height: 16 * h,
                      backgroundColor: isMe ? colors.surface + '99' : colors.divider 
                    }
                  ]} 
                />
              ))}
            </View>
            <Text style={[styles.voiceTime, { color: isMe ? colors.surface + 'B3' : colors.textSecondary }]}>
              {message.mediaDuration || '0:00'}
            </Text>
          </View>
        );

      case 'location':
        return (
          <View style={styles.mapCard}>
            <View style={styles.mapPlaceholder}>
              <View style={styles.mapPinContainer}>
                <Icon name="map-pin" size={24} color={colors.error} />
                <View style={styles.pinPulse} />
              </View>
              <Text style={styles.mapLabelText}>hyperlocal match</Text>
            </View>
            <View style={styles.mapInfo}>
              <Text style={styles.locationName} numberOfLines={1}>
                {message.location?.name || 'Shared Location'}
              </Text>
              <Text style={styles.locationDist}>
                {message.location?.distance || ''}
              </Text>
              <TouchableOpacity style={styles.mapLinkBtn}>
                <Text style={styles.mapLinkText}>View on map</Text>
                <Icon name="arrow-right" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return (
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {message.text}
          </Text>
        );
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityAnim.value,
      transform: [{ scale: scaleAnim.value }]
    };
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        isMe ? styles.containerMe : styles.containerOther,
        animatedStyle
      ]}
    >
      <View 
        style={[
          styles.bubble, 
          isMe ? styles.bubbleMe : styles.bubbleOther,
          message.type === 'location' && styles.bubbleLocation
        ]}
      >
        {renderContent()}
        <View style={styles.infoRow}>
          <Text style={[styles.timeText, { color: isMe ? colors.surface + '99' : colors.textSecondary }]}>
            {message.timestamp}
          </Text>
          {renderStatus()}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    flexDirection: 'row',
    width: '100%',
  },
  containerMe: {
    justifyContent: 'flex-end',
  },
  containerOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: MAX_BUBBLE_WIDTH,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 1,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleLocation: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
  },
  messageText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  messageTextMe: {
    color: colors.surface,
  },
  messageTextOther: {
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 11,
  },
  statusContainer: {
    marginLeft: 4,
  },
  doubleCheck: {
    flexDirection: 'row',
    width: 10,
  },
  checkIcon: {
    marginRight: -6,
  },
  mediaContainer: {
    width: 220,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginBottom: 4,
  },
  imageContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    marginTop: 8,
  },
  docContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
    width: 240,
  },
  docContainerMe: {
    backgroundColor: colors.surface + '20',
  },
  docContainerOther: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  docTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  docTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    marginBottom: 2,
  },
  docSubtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
  },
  downloadBtn: {
    padding: 8,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    marginHorizontal: 12,
    gap: 2,
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
  },
  voiceTime: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
  },
  mapCard: {
    width: 240,
    backgroundColor: colors.surface,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error,
    opacity: 0.2,
  },
  mapLabelText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mapInfo: {
    padding: 12,
  },
  locationName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  locationDist: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  mapLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mapLinkText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.primary,
  },
});
