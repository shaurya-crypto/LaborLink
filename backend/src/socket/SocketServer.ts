import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketAuthMiddleware } from './SocketMiddleware';
import { socketManager } from './SocketManager';
import { registerSocketEvents } from './SocketEvents';
import { logger } from '../config/logger';

export const initializeSocketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Adjust in production
      methods: ['GET', 'POST']
    }
  });

  socketManager.init(io);

  io.use(socketAuthMiddleware);

  io.on('connection', async (socket: Socket) => {
    const userId = socket.data.user.id;
    logger.info(`🔗 User connected to socket: ${userId} (${socket.id})`);

    await socketManager.addUserConnection(userId, socket.id);
    
    // Join personal room for targeted push events
    socket.join(`user_${userId}`);

    registerSocketEvents(socket);
  });

  return io;
};
