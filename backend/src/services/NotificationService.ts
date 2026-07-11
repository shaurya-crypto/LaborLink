import Notification, { INotification, NotificationCategory } from '../models/Notification';
import { User } from '../models/User';
import admin from 'firebase-admin';
import { getMessaging } from 'firebase-admin/messaging';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { logger } from '../config/logger';

try {
  if (process.env.FIREBASE_CREDENTIALS) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    logger.warn('FIREBASE_CREDENTIALS not found. Push notifications will only be saved to DB.');
  }
} catch (error) {
  logger.error('Failed to initialize Firebase Admin', error);
}

export class NotificationService {
  public async getNotifications(userId: string) {
    return await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  public async createNotification(
    userId: string, 
    senderId: string | undefined, 
    category: NotificationCategory, 
    title: string, 
    body: string, 
    metadata?: any
  ) {
    const notification = new Notification({
      user: userId,
      sender: senderId,
      category,
      title,
      body,
      metadata
    });

    await notification.save();

    try {
      const user = await User.findById(userId);
      if (user && user.fcmTokens && user.fcmTokens.length > 0 && getApps().length > 0) {
        const message = {
          notification: { title, body },
          data: metadata ? { ...metadata } : {},
          tokens: user.fcmTokens
        };
        await getMessaging().sendEachForMulticast(message);
      }
    } catch (error) {
      logger.error('Error sending FCM push notification', error);
    }

    return notification;
  }

  public async markAsRead(notificationIds: string[], userId: string) {
    await Notification.updateMany(
      { _id: { $in: notificationIds }, user: userId },
      { $set: { isRead: true } }
    );
  }
}

export const notificationService = new NotificationService();
