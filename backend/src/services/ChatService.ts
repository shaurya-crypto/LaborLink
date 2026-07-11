import Conversation, { IConversation } from '../models/Conversation';
import Message, { IMessage } from '../models/Message';
import mongoose from 'mongoose';

export class ChatService {
  public async getConversations(userId: string) {
    const conversations = await Conversation.find({ 
      participants: userId, 
      deletedForUser: { $ne: userId } 
    })
    .populate('participants', 'name email profilePhoto role isOnline lastSeen')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    return conversations;
  }

  public async getMessages(conversationId: string, userId: string, limit: number = 50, skip: number = 0) {
    const messages = await Message.find({
      conversation: conversationId,
      deletedForUser: { $ne: userId }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    return messages;
  }

  public async sendMessage(senderId: string, receiverId: string, text?: string, mediaUrl?: string, mediaType?: string) {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId]
      });
      await conversation.save();
    }

    const message = new Message({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text,
      mediaUrl,
      mediaType,
      status: 'sent',
      sentAt: new Date()
    });

    await message.save();

    conversation.lastMessage = message._id as mongoose.Types.ObjectId;
    conversation.lastActivity = new Date();
    conversation.lastSender = new mongoose.Types.ObjectId(senderId);
    
    // increment unread count for receiver
    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);

    await conversation.save();

    return message;
  }

  public async markAsRead(conversationId: string, userId: string) {
    await Message.updateMany(
      { conversation: conversationId, receiver: userId, status: { $ne: 'read' } },
      { $set: { status: 'read', readAt: new Date() } }
    );

    const conversation = await Conversation.findById(conversationId);
    if (conversation) {
      conversation.unreadCount.set(userId.toString(), 0);
      await conversation.save();
    }
  }
}

export const chatService = new ChatService();
