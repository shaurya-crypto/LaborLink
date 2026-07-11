import { Socket } from 'socket.io';
import { socketManager } from './SocketManager';

export const registerSocketEvents = (socket: Socket) => {
  const userId = socket.data.user.id;

  socket.on('typing', (data: { conversationId: string; receiverId: string }) => {
    const receiverSockets = socketManager.getUserSockets(data.receiverId);
    receiverSockets.forEach(id => {
      socketManager.getIo().to(id).emit('typing', { conversationId: data.conversationId, senderId: userId });
    });
  });

  socket.on('stop_typing', (data: { conversationId: string; receiverId: string }) => {
    const receiverSockets = socketManager.getUserSockets(data.receiverId);
    receiverSockets.forEach(id => {
      socketManager.getIo().to(id).emit('stop_typing', { conversationId: data.conversationId, senderId: userId });
    });
  });

  socket.on('message_read', async (data: { messageIds: string[]; conversationId: string; senderId: string }) => {
    const senderSockets = socketManager.getUserSockets(data.senderId);
    senderSockets.forEach(id => {
      socketManager.getIo().to(id).emit('message_read', { messageIds: data.messageIds, conversationId: data.conversationId, readBy: userId, readAt: new Date() });
    });
  });

  socket.on('disconnect', async () => {
    await socketManager.removeUserConnection(userId, socket.id);
  });
};
