import { Response, NextFunction } from 'express';
import { notificationService } from '../services/NotificationService';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class NotificationController {
  public getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const notifications = await notificationService.getNotifications(userId);
      res.status(200).json(ApiResponse.success('Notifications fetched', notifications));
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { notificationIds } = req.body;
      await notificationService.markAsRead(notificationIds, userId);
      res.status(200).json(ApiResponse.success('Notifications marked as read', null));
    } catch (error) {
      next(error);
    }
  };
}

export const notificationController = new NotificationController();
