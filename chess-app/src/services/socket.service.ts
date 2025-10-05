import { io, Socket } from 'socket.io-client';
import { store } from '../store/store';
import { setConnected, setReconnecting, setError, setOnlineUsers } from '../store/socketSlice';
import { setGameState, addMove, updateTimer, setDrawOfferPending } from '../store/gameSlice';
import { addNotification, addToast } from '../store/uiSlice';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found, cannot connect to socket');
      return;
    }

    const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    
    this.socket = io(WS_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      store.dispatch(setConnected(true));
      store.dispatch(setReconnecting(false));
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      store.dispatch(setConnected(false));
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnection attempt:', attemptNumber);
      store.dispatch(setReconnecting(true));
      this.reconnectAttempts = attemptNumber;
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      store.dispatch(setReconnecting(false));
      store.dispatch(setError('Connection lost. Please refresh the page.'));
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      store.dispatch(setError(error.message || 'Connection error'));
    });

    // Game events
    this.socket.on('game_joined', (data) => {
      console.log('Joined game:', data);
      store.dispatch(addNotification({
        type: 'success',
        title: 'Game Joined',
        message: `Successfully joined game ${data.gameId}`,
      }));
    });

    this.socket.on('opponent_joined', (data) => {
      console.log('Opponent joined:', data);
      store.dispatch(addNotification({
        type: 'info',
        title: 'Opponent Joined',
        message: `${data.username} joined the game`,
      }));
    });

    this.socket.on('opponent_left', (data) => {
      console.log('Opponent left:', data);
      store.dispatch(addNotification({
        type: 'warning',
        title: 'Opponent Left',
        message: `${data.username} left the game`,
      }));
    });

    this.socket.on('move_made', (data) => {
      console.log('Move made:', data);
      store.dispatch(addMove(data.move));
      store.dispatch(setGameState(data.gameState));
    });

    this.socket.on('game_state_update', (data) => {
      console.log('Game state updated:', data);
      store.dispatch(setGameState(data));
    });

    this.socket.on('time_update', (data) => {
      store.dispatch(updateTimer(data));
    });

    this.socket.on('check', (data) => {
      store.dispatch(addToast({
        type: 'warning',
        title: 'Check!',
        message: `${data.color} is in check`,
      }));
    });

    this.socket.on('checkmate', (data) => {
      store.dispatch(addToast({
        type: 'success',
        title: 'Checkmate!',
        message: `${data.winner} wins by checkmate`,
      }));
    });

    this.socket.on('stalemate', () => {
      store.dispatch(addToast({
        type: 'info',
        title: 'Stalemate',
        message: 'The game ended in a draw by stalemate',
      }));
    });

    this.socket.on('draw_offered', (data) => {
      store.dispatch(setDrawOfferPending(true));
      store.dispatch(addNotification({
        type: 'info',
        title: 'Draw Offered',
        message: `${data.username} offered a draw`,
      }));
    });

    this.socket.on('draw_accepted', () => {
      store.dispatch(setDrawOfferPending(false));
      store.dispatch(addToast({
        type: 'info',
        title: 'Draw Accepted',
        message: 'The game ended in a draw',
      }));
    });

    this.socket.on('draw_declined', () => {
      store.dispatch(setDrawOfferPending(false));
      store.dispatch(addToast({
        type: 'info',
        title: 'Draw Declined',
        message: 'Your draw offer was declined',
      }));
    });

    this.socket.on('game_ended', (data) => {
      store.dispatch(addNotification({
        type: 'info',
        title: 'Game Ended',
        message: `Game ended: ${data.result}`,
      }));
    });

    this.socket.on('opponent_disconnected', (data) => {
      store.dispatch(addNotification({
        type: 'warning',
        title: 'Opponent Disconnected',
        message: `${data.username} disconnected. Waiting for reconnection...`,
      }));
    });

    this.socket.on('opponent_reconnected', (data) => {
      store.dispatch(addNotification({
        type: 'success',
        title: 'Opponent Reconnected',
        message: `${data.username} has reconnected`,
      }));
    });

    this.socket.on('online_users_update', (data) => {
      store.dispatch(setOnlineUsers(data.count));
    });
  }

  // Emit methods
  joinGame(gameId: string): void {
    this.socket?.emit('join_game', { gameId });
  }

  leaveGame(gameId: string): void {
    this.socket?.emit('leave_game', { gameId });
  }

  makeMove(gameId: string, move: { from: string; to: string; promotion?: string }): void {
    this.socket?.emit('make_move', { gameId, move });
  }

  offerDraw(gameId: string): void {
    this.socket?.emit('offer_draw', { gameId });
  }

  acceptDraw(gameId: string): void {
    this.socket?.emit('accept_draw', { gameId });
  }

  declineDraw(gameId: string): void {
    this.socket?.emit('decline_draw', { gameId });
  }

  resign(gameId: string): void {
    this.socket?.emit('resign', { gameId });
  }

  spectateGame(gameId: string): void {
    this.socket?.emit('spectate_game', { gameId });
  }

  stopSpectating(gameId: string): void {
    this.socket?.emit('stop_spectating', { gameId });
  }

  // Get socket instance for direct use if needed
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();