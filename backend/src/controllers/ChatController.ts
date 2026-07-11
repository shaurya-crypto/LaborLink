import { Response, NextFunction } from 'express';
import { chatService } from '../services/ChatService';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { socketManager } from '../socket/SocketManager';

export class ChatController {
  public getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const conversations = await chatService.getConversations(userId);
      res.status(200).json(ApiResponse.success('Conversations fetched successfully', conversations));
    } catch (error) {
      next(error);
    }
  };

  public getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

      const messages = await chatService.getMessages(conversationId as string, userId, limit, skip);
      res.status(200).json(ApiResponse.success('Messages fetched successfully', messages));
    } catch (error) {
      next(error);
    }
  };

  public sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const senderId = req.user!.id;
      const { receiverId, text, mediaUrl, mediaType } = req.body;

      if (!text && !mediaUrl) {
        return res.status(400).json(ApiResponse.error('Message must contain text or media'));
      }

      const message = await chatService.sendMessage(senderId, receiverId, text, mediaUrl, mediaType);

      // Emit socket event to receiver
      const receiverSockets = socketManager.getUserSockets(receiverId);
      receiverSockets.forEach(id => {
        socketManager.getIo().to(id).emit('message', message);
      });

      // Emit to sender's devices so they sync locally
      const senderSockets = socketManager.getUserSockets(senderId);
      senderSockets.forEach(id => {
        socketManager.getIo().to(id).emit('message_sent', message);
      });

      res.status(201).json(ApiResponse.success('Message sent successfully', message));
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;

      await chatService.markAsRead(conversationId as string, userId);
      res.status(200).json(ApiResponse.success('Messages marked as read', null));
    } catch (error) {
      next(error);
    }
  };
}

export const chatController = new ChatController();
