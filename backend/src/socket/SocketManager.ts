import { Socket, Server } from 'socket.io';
import { presenceManager } from './PresenceManager';

class SocketManager {
  private userSockets: Map<string, Set<string>> = new Map();
  private io!: Server;

  public init(io: Server) {
    this.io = io;
  }

  public getIo(): Server {
    return this.io;
  }

  public async addUserConnection(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
      await presenceManager.setOnline(userId);
      this.io.emit('user_presence', { userId, status: 'online' }); 
    }
    this.userSockets.get(userId)?.add(socketId);
  }

  public async removeUserConnection(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
        await presenceManager.setOffline(userId);
        this.io.emit('user_presence', { userId, status: 'offline', lastSeen: new Date() });
      }
    }
  }

  public getUserSockets(userId: string): string[] {
    return Array.from(this.userSockets.get(userId) || []);
  }

  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}

export const socketManager = new SocketManager();
