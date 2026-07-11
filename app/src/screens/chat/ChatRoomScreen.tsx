import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Modal 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { ScreenContainer, MessageBubble, TypingIndicator, OfflineBanner, Button } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { MainStackParamList } from '@/navigation/MainNavigator';

type ChatRoomRouteProp = RouteProp<MainStackParamList, 'ChatRoom' | 'EmployerChatRoom'>;

export const ChatRoomScreen = () => {
  const route = useRoute<ChatRoomRouteProp>();
  const navigation = useNavigation();
  const { conversationId } = route.params;
  const role = useAppStore((state) => state.role);
  
  const { 
    conversations, 
    sendMessage, 
    isOffline, 
    setActiveConversationId 
  } = useChatStore();

  const [inputVal, setInputVal] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [attachModalVisible, setAttachModalVisible] = useState(false);

  const conversation = conversations.find((c) => c.id === conversationId);

  useEffect(() => {
    setActiveConversationId(conversationId);
    return () => {
      setActiveConversationId(null);
    };
  }, [conversationId, setActiveConversationId]);

  // Auto-scroll to bottom when messages or typing status updates
  useEffect(() => {
    if (flatListRef.current && conversation?.messages) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [conversation?.messages, conversation?.messages?.length, conversation?.isTyping]);

  if (!conversation) {
    return (
      <ScreenContainer backgroundColor={colors.background}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Conversation not found.</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </ScreenContainer>
    );
  }

  const handleSend = () => {
    if (!inputVal.trim()) return;
    sendMessage(inputVal.trim(), 'text');
    setInputVal('');
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text, 'text');
  };

  const handleAttachment = (type: string) => {
    setAttachModalVisible(false);
    switch (type) {
      case 'photo':
        sendMessage('Sent a photo', 'image');
        break;
      case 'document':
        sendMessage('Sent a document', 'document', { mediaSize: '1.4 MB' });
        break;
      case 'location':
        sendMessage('Location shared', 'location', {
          location: {
            name: 'Vaishali Nagar, Jaipur',
            distance: '2.1 km away'
          }
        });
        break;
      case 'voice':
        sendMessage('Voice message', 'voice', { mediaDuration: '0:08' });
        break;
    }
  };

  const getQuickReplies = () => {
    if (conversation.name === 'Sharma Electricals') {
      return ['Yes, I am available.', 'What is the timing?', 'Share location link.'];
    }
    return ['Great!', 'Sure, thank you.', 'I will call you.'];
  };

  const isEmployer = role === 'employer';
  const gradientColors = isEmployer ? colors.gradients.primary : colors.gradients.primary;

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScreenContainer backgroundColor={colors.secondaryBackground}>
        {isOffline && <OfflineBanner />}

        {/* Custom Header */}
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="arrow-left" size={24} color={colors.surface} />
            </TouchableOpacity>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{conversation.name.substring(0, 2).toUpperCase()}</Text>
            </View>

            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle} numberOfLines={1}>{conversation.name}</Text>
              <Text style={styles.headerSub}>
                {conversation.isTyping ? 'Typing...' : conversation.isOnline ? 'Active now' : 'Offline'}
              </Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity 
                onPress={() => Toast.show({ type: 'info', text1: 'Voice calling is out of scope.' })} 
                style={styles.headerBtn}
              >
                <Icon name="phone" size={20} color={colors.surface} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => Toast.show({ type: 'info', text1: 'Video calling is out of scope.' })} 
                style={styles.headerBtn}
              >
                <Icon name="video" size={20} color={colors.surface} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Message Thread */}
        <FlatList
          ref={flatListRef}
          data={conversation.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} isMe={item.senderId === undefined} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            conversation.isTyping ? (
              <View style={styles.typingIndicatorRow}>
                <View style={styles.typingIndicatorBubble}>
                  <TypingIndicator />
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick Replies Bar */}
        {!isOffline && (
          <View style={styles.quickRepliesContainer}>
            <FlatList
              horizontal
              data={getQuickReplies()}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickRepliesScroll}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.quickReplyChip}
                  onPress={() => handleQuickReply(item)}
                >
                  <Text style={styles.quickReplyText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Composer Bar */}
        <View style={styles.composer}>
          <TouchableOpacity 
            style={styles.composerBtn} 
            onPress={() => Toast.show({ type: 'info', text1: 'Emojis keyboard coming soon.' })}
          >
            <Icon name="smile" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.composerInput}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={inputVal}
            onChangeText={setInputVal}
            editable={!isOffline}
          />

          <TouchableOpacity style={styles.composerBtn} onPress={() => setAttachModalVisible(true)}>
            <Icon name="paperclip" size={22} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.sendBtn, 
              { backgroundColor: isOffline ? colors.divider : colors.primary }
            ]} 
            onPress={inputVal.trim() ? handleSend : () => sendMessage('Voice note', 'voice', { mediaDuration: '0:05' })}
            disabled={isOffline}
          >
            <Icon 
              name={inputVal.trim() ? 'send' : 'mic'} 
              size={18} 
              color={isOffline ? colors.textSecondary : colors.surface} 
            />
          </TouchableOpacity>
        </View>

        {/* Attachment Action Sheet */}
        <Modal visible={attachModalVisible} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setAttachModalVisible(false)}>
            <View style={styles.actionSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Attach File</Text>
              
              <TouchableOpacity style={styles.sheetItem} onPress={() => handleAttachment('photo')}>
                <Icon name="image" size={20} color={colors.textPrimary} />
                <Text style={styles.sheetItemText}>Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.sheetItem} onPress={() => handleAttachment('document')}>
                <Icon name="file-text" size={20} color={colors.textPrimary} />
                <Text style={styles.sheetItemText}>Document</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sheetItem} onPress={() => handleAttachment('location')}>
                <Icon name="map-pin" size={20} color={colors.textPrimary} />
                <Text style={styles.sheetItemText}>Share Location</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.sheetItem, styles.sheetItemLast]} onPress={() => handleAttachment('voice')}>
                <Icon name="mic" size={20} color={colors.textPrimary} />
                <Text style={styles.sheetItemText}>Voice Note</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.spacing.l,
  },
  errorText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textSecondary,
    marginBottom: metrics.spacing.l,
  },
  // Header styles
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.m,
    marginBottom: metrics.spacing.s,
  },
  headerBtn: {
    padding: metrics.spacing.s,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: metrics.spacing.xs,
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.primaryDark,
  },
  headerInfo: {
    flex: 1,
    marginLeft: metrics.spacing.m,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.surface,
  },
  headerSub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: metrics.spacing.xs,
  },
  // Message Thread
  listContent: {
    padding: metrics.spacing.m,
    paddingTop: metrics.spacing.l,
    paddingBottom: metrics.spacing.xl,
    flexGrow: 1,
  },
  typingIndicatorRow: {
    flexDirection: 'row',
    marginBottom: metrics.spacing.m,
    justifyContent: 'flex-start',
  },
  typingIndicatorBubble: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.divider,
    ...metrics.shadows.soft,
  },
  // Quick Replies
  quickRepliesContainer: {
    backgroundColor: 'transparent',
    paddingVertical: metrics.spacing.s,
  },
  quickRepliesScroll: {
    paddingHorizontal: metrics.spacing.m,
    gap: metrics.spacing.s,
  },
  quickReplyChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary + '33',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: metrics.radiusPill,
    ...metrics.shadows.soft,
  },
  quickReplyText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.caption,
    color: colors.primaryDark,
  },
  // Composer
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.spacing.s,
    paddingVertical: metrics.spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  composerBtn: {
    padding: metrics.spacing.m,
  },
  composerInput: {
    flex: 1,
    backgroundColor: colors.secondaryBackground,
    borderRadius: metrics.radiusInput,
    paddingHorizontal: metrics.spacing.m,
    height: 40,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: metrics.spacing.s,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: metrics.spacing.l,
    paddingBottom: metrics.spacing.xxl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    alignSelf: 'center',
    marginBottom: metrics.spacing.l,
  },
  sheetTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h3,
    color: colors.textPrimary,
    marginBottom: metrics.spacing.m,
    textAlign: 'center',
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: metrics.spacing.m,
  },
  sheetItemLast: {
    borderBottomWidth: 0,
  },
  sheetItemText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  }
});

