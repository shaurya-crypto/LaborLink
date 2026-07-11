import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer, ConversationCard, EmptyState, OfflineBanner } from '@/components';
import { colors, metrics, typography } from '@/theme';
import { useChatStore, Conversation } from '@/store/useChatStore';
import { useAppStore } from '@/store/useAppStore';
import { MainStackParamList } from '@/navigation/MainNavigator';
import Icon from 'react-native-vector-icons/Feather';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

export const ConversationListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const role = useAppStore((state) => state.role);
  const { 
    conversations, 
    initializeConversations, 
    togglePin, 
    isOffline, 
    toggleOffline, 
    setActiveConversationId 
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Action Sheet Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);

  useEffect(() => {
    initializeConversations();
  }, [initializeConversations, role]);

  const handleConversationPress = (conv: Conversation) => {
    setActiveConversationId(conv.id);
    navigation.navigate('ChatRoom', { conversationId: conv.id });
  };

  const handleLongPress = (conv: Conversation) => {
    setSelectedConv(conv);
    setModalVisible(true);
  };

  const handlePin = () => {
    if (selectedConv) togglePin(selectedConv.id);
    setModalVisible(false);
  };

  const handleArchive = () => {
    Toast.show({ type: 'info', text1: 'Archived', text2: 'Chat archived successfully!' });
    setModalVisible(false);
  };

  const handleDelete = () => {
    Toast.show({ type: 'error', text1: 'Delete', text2: 'Delete functionality is out of scope for this frontend demo.' });
    setModalVisible(false);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchQuery = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(matchQuery) ||
      c.occupation.toLowerCase().includes(matchQuery) ||
      c.lastMessage.toLowerCase().includes(matchQuery)
    );
  });

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const recentConversations = filteredConversations.filter((c) => !c.isPinned);

  const handleEmptyAction = () => {
    if (role === 'worker') {
      navigation.navigate('WorkerTabs', { screen: 'SearchTab' } as any);
    } else {
      navigation.navigate('EmployerTabs', { screen: 'FindTab' } as any);
    }
  };

  const isEmployer = role === 'employer';
  const gradientColors = isEmployer ? colors.gradients.primary : colors.gradients.primary;

  return (
    <ScreenContainer backgroundColor={colors.background}>
      {isOffline && <OfflineBanner />}

      {/* Header Section */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <Text style={styles.titleWhite}>Chats</Text>
          <TouchableOpacity onPress={toggleOffline} style={styles.wifiBtn}>
            <Icon 
              name={isOffline ? 'wifi-off' : 'wifi'} 
              size={20} 
              color={isOffline ? colors.error : colors.surface} 
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search messages or occupations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Main List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredConversations.length === 0 ? (
          <EmptyState
            icon="message-square"
            title="No Conversations"
            subtitle={
              searchQuery 
                ? `No results match "${searchQuery}". Try different keywords.`
                : 'You do not have any messages yet. Start communicating with local users.'
            }
            actionTitle={searchQuery ? undefined : role === 'worker' ? 'Search Jobs' : 'Find Workers'}
            onAction={searchQuery ? undefined : handleEmptyAction}
          />
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedConversations.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Icon name="pin" size={12} color={colors.textSecondary} style={styles.pinIcon} />
                  <Text style={styles.sectionTitle}>Pinned Chats</Text>
                </View>
                {pinnedConversations.map((conv) => (
                  <ConversationCard
                    key={conv.id}
                    conversation={conv}
                    onPress={() => handleConversationPress(conv)}
                    onLongPress={() => handleLongPress(conv)}
                  />
                ))}
              </View>
            )}

            {/* Recent Section */}
            {recentConversations.length > 0 && (
              <View style={styles.section}>
                {pinnedConversations.length > 0 && (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Chats</Text>
                  </View>
                )}
                {recentConversations.map((conv) => (
                  <ConversationCard
                    key={conv.id}
                    conversation={conv}
                    onPress={() => handleConversationPress(conv)}
                    onLongPress={() => handleLongPress(conv)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Action Sheet Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.actionSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{selectedConv?.name}</Text>
            
            <TouchableOpacity style={styles.sheetItem} onPress={handlePin}>
              <Icon name="pin" size={20} color={colors.textPrimary} />
              <Text style={styles.sheetItemText}>{selectedConv?.isPinned ? 'Unpin Chat' : 'Pin Chat'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sheetItem} onPress={handleArchive}>
              <Icon name="archive" size={20} color={colors.textPrimary} />
              <Text style={styles.sheetItemText}>Archive Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.sheetItem, styles.sheetItemDestructive]} onPress={handleDelete}>
              <Icon name="trash-2" size={20} color={colors.error} />
              <Text style={styles.sheetItemTextDestructive}>Delete Chat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    padding: metrics.spacing.l,
    paddingTop: metrics.spacing.xxl,
    paddingBottom: metrics.spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.spacing.l,
  },
  titleWhite: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.h1,
    color: colors.surface,
  },
  wifiBtn: {
    padding: metrics.spacing.s,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.spacing.m,
    height: 48,
    borderRadius: metrics.radiusInput,
    ...metrics.shadows.soft,
  },
  input: {
    flex: 1,
    marginLeft: metrics.spacing.s,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.body2,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingTop: metrics.spacing.m,
    paddingBottom: metrics.spacing.xxl,
    flexGrow: 1,
  },
  section: {
    marginTop: metrics.spacing.s,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.l,
    paddingVertical: metrics.spacing.s,
    gap: 4,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pinIcon: {
    transform: [{ rotate: '45deg' }],
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
    borderBottomColor: colors.divider,
    gap: metrics.spacing.m,
  },
  sheetItemDestructive: {
    borderBottomWidth: 0,
    marginTop: metrics.spacing.s,
  },
  sheetItemText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.sizes.body1,
    color: colors.textPrimary,
  },
  sheetItemTextDestructive: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.sizes.body1,
    color: colors.error,
  }
});

