import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';
import { AppNotification } from '@/models/Job';
import Config from 'react-native-config';

const API_URL = `${Config.API_URL}/notifications`;

class NotificationService {
  private getHeaders() {
    const token = useAuthStore.getState().token;
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getNotifications(page = 1, limit = 20): Promise<{ notifications: AppNotification[], unreadCount: number }> {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, { headers: this.getHeaders() });
      return response.data.data; // Expected { notifications, unreadCount }
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await axios.patch(`${API_URL}/${notificationId}/read`, {}, { headers: this.getHeaders() });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await axios.patch(`${API_URL}/read-all`, {}, { headers: this.getHeaders() });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${notificationId}`, { headers: this.getHeaders() });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
