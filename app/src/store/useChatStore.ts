import { create } from 'zustand';

import { chatService } from '@/services/ChatService';
import { socketService } from '@/services/SocketService';
import { useAuthStore } from './useAuthStore';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; // or Date/string depending on backend
  status: 'sent' | 'delivered' | 'seen';
  type: 'text' | 'image' | 'location' | 'document' | 'voice';
  mediaUrl?: string;
  fileName?: string;
  mediaSize?: string;
  mediaDuration?: string;
  location?: {
    name?: string;
    distance?: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface Conversation {
  id: string; // this is the conversation ID
  name: string;
  photo?: string;
  occupation: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isPinned: boolean;
  isOnline: boolean;
  isTyping: boolean;
  messages: Message[];
  participantId?: string; // The ID of the other user to send messages to
}

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  searchQuery: string;
  isOffline: boolean;
  totalUnread: number;
  isInitialized: boolean;
  
  setSearchQuery: (query: string) => void;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (text: string, type?: Message['type'], _extra?: any) => Promise<void>;
  togglePin: (id: string) => void;
  toggleOffline: () => void;
  markAsRead: (id: string) => Promise<void>;
  initializeConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  handleIncomingMessage: (message: any) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  searchQuery: '',
  isOffline: false,
  totalUnread: 0,
  isInitialized: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setActiveConversationId: (id) => {
    set({ activeConversationId: id });
    if (id) {
      get().markAsRead(id);
      get().loadMessages(id);
    }
  },

  togglePin: (id) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      ),
    }));
  },

  toggleOffline: () => {
    set((state) => ({ isOffline: !state.isOffline }));
  },

  markAsRead: async (id) => {
    try {
      await chatService.markAsRead(id);
      set((state) => {
        const conversations = state.conversations.map((c) =>
          c.id === id ? { ...c, unreadCount: 0 } : c
        );
        const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
        return { conversations, totalUnread };
      });
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  },

  initializeConversations: async () => {
    try {
      const dbConversations = await chatService.getConversations();
      
      const mapped = dbConversations.map((c: any) => ({
        id: c.id,
        name: c.otherUser?.name || 'Unknown',
        occupation: c.otherUser?.occupation || 'User',
        lastMessage: c.lastMessage?.text || 'No messages',
        time: c.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        unreadCount: c.unreadCount || 0,
        isPinned: false,
        isOnline: false, // Could be synced with socket presence
        isTyping: false,
        messages: [],
        participantId: c.otherUser?.id,
      }));

      const totalUnread = mapped.reduce((sum, c) => sum + c.unreadCount, 0);
      set({ conversations: mapped, totalUnread, isInitialized: true });

      // Connect socket if not connected
      socketService.connect();
      const socket = socketService.getSocket();
      
      if (socket) {
        socket.off('message');
        socket.on('message', (msg) => {
          get().handleIncomingMessage(msg);
        });

        socket.off('message_sent');
        socket.on('message_sent', (msg) => {
           get().handleIncomingMessage(msg);
        });
      }

    } catch (e) {
      console.error('Failed to init convos', e);
    }
  },

  loadMessages: async (conversationId: string) => {
    try {
      const msgs = await chatService.getMessages(conversationId);
      const userId = useAuthStore.getState().user?.id;
      
      set((state) => ({
        conversations: state.conversations.map(c => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: msgs.map((m: any) => ({
                id: m.id,
                senderId: m.senderId === userId ? 'me' : 'other',
                text: m.text || '',
                timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: m.isRead ? 'seen' : 'delivered',
                type: m.mediaType || 'text',
                mediaUrl: m.mediaUrl,
              }))
            };
          }
          return c;
        })
      }));
    } catch (e) {
      console.error('Failed to load msgs', e);
    }
  },

  handleIncomingMessage: (msg: any) => {
    const userId = useAuthStore.getState().user?.id;
    const isMe = msg.senderId === userId;
    
    const formattedMsg: Message = {
      id: msg.id,
      senderId: isMe ? 'me' : 'other',
      text: msg.text || '',
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: msg.isRead ? 'seen' : 'delivered',
      type: msg.mediaType || 'text',
      mediaUrl: msg.mediaUrl,
    };

    set((state) => {
      let convExists = false;
      const updatedConversations = state.conversations.map(c => {
        if (c.id === msg.conversationId) {
          convExists = true;
          return {
            ...c,
            lastMessage: formattedMsg.text,
            time: formattedMsg.timestamp,
            unreadCount: (state.activeConversationId === c.id || isMe) ? 0 : c.unreadCount + 1,
            messages: [...c.messages, formattedMsg],
          };
        }
        return c;
      });

      if (!convExists) {
        // We'd ideally fetch the conversation details if a new one arrives.
        // For now, trigger a re-fetch of all conversations to populate it.
        get().initializeConversations();
        return state;
      }

      const totalUnread = updatedConversations.reduce((sum, c) => sum + c.unreadCount, 0);
      return { conversations: updatedConversations, totalUnread };
    });

    if (get().activeConversationId === msg.conversationId && !isMe) {
      get().markAsRead(msg.conversationId);
      socketService.emit('message_read', { messageIds: [msg.id], conversationId: msg.conversationId, senderId: msg.senderId });
    }
  },

  sendMessage: async (text, type = 'text', _extra = {}) => {
    const { activeConversationId, isOffline, conversations } = get();
    if (!activeConversationId || isOffline) return;

    const conv = conversations.find(c => c.id === activeConversationId);
    if (!conv || !conv.participantId) return;

    try {
      // Optimistic update
      const tempId = `temp_${Date.now()}`;
      const tempMsg: Message = {
        id: tempId,
        senderId: 'me',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        type,
      };

      set((state) => ({
        conversations: state.conversations.map(c => 
          c.id === activeConversationId ? { 
            ...c, 
            messages: [...c.messages, tempMsg],
            lastMessage: text,
            time: tempMsg.timestamp
          } : c
        )
      }));

      // Send via REST API, which triggers backend socket events
      await chatService.sendMessage(conv.participantId, text);
      
      // We don't necessarily need to replace the temp message here if the socket 'message_sent' 
      // event replaces it, but realistically it's safer to just fetch or handle the socket event.
      // Our handleIncomingMessage will append it. In a production app we'd reconcile tempId with realId.
      
    } catch (e) {
      console.error('Failed to send msg', e);
    }
  },
}));
