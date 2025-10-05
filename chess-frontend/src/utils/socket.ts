import { io, Socket } from 'socket.io-client';
import type { SocketEvents } from '../types';

class SocketManager {
  private socket: Socket | null = null;
  private url: string;

  constructor() {
    this.url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
  }

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.url, {
        auth: {
          token,
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): void {
    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off<K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]): void {
    if (this.socket) {
      this.socket.off(event, callback as any);
    }
  }

  get connected(): boolean {
    return this.socket?.connected || false;
  }

  get id(): string | undefined {
    return this.socket?.id;
  }
}

export const socketManager = new SocketManager();