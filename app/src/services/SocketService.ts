import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';
import Config from 'react-native-config';

// Extract the base URL from API_URL (e.g. http://10.0.2.2:3000/api/v1 -> http://10.0.2.2:3000)
const SOCKET_URL = (Config.API_URL || 'http://10.0.2.2:3000/api/v1').replace(/\/api\/v1$/, ''); 

class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;

  public connect() {
    if (this.socket?.connected || this.isConnecting) return;

    const token = useAuthStore.getState().token;
    if (!token) {
      console.warn('Cannot connect to socket without token');
      return;
    }

    this.isConnecting = true;
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnecting = false;
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit event ${event}, socket is not connected`);
    }
  }
}

export const socketService = new SocketService();
