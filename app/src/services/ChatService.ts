import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Conversation, Message } from '@/store/useChatStore';
import Config from 'react-native-config';

const API_URL = `${Config.API_URL}/chat`;

class ChatService {
  private getHeaders() {
    const token = useAuthStore.getState().token;
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await axios.get(`${API_URL}/conversations`, { headers: this.getHeaders() });
      return response.data.data;
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await axios.get(`${API_URL}/messages/${conversationId}`, { headers: this.getHeaders() });
      return response.data.data;
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }

  async sendMessage(receiverId: string, text: string, mediaUrl?: string, mediaType?: string): Promise<Message> {
    try {
      const response = await axios.post(`${API_URL}/send`, { receiverId, text, mediaUrl, mediaType }, { headers: this.getHeaders() });
      return response.data.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async markAsRead(conversationId: string): Promise<void> {
    try {
      await axios.patch(`${API_URL}/read/${conversationId}`, {}, { headers: this.getHeaders() });
    } catch (error) {
      console.error('Failed to mark as read:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
