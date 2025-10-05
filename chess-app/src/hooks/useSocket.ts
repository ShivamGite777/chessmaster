import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useCallback } from 'react';
import type { RootState, AppDispatch } from '../store/store';
import { setConnected, setReconnecting, setError, setOnlineUsers } from '../store/socketSlice';
import { socketService } from '../services/socket.service';

export const useSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connected, reconnecting, error, onlineUsers } = useSelector(
    (state: RootState) => state.socket
  );

  const connect = useCallback(() => {
    socketService.connect();
  }, []);

  const disconnect = useCallback(() => {
    socketService.disconnect();
  }, []);

  const joinGame = useCallback((gameId: string) => {
    socketService.joinGame(gameId);
  }, []);

  const leaveGame = useCallback((gameId: string) => {
    socketService.leaveGame(gameId);
  }, []);

  const makeMove = useCallback((gameId: string, move: { from: string; to: string; promotion?: string }) => {
    socketService.makeMove(gameId, move);
  }, []);

  const offerDraw = useCallback((gameId: string) => {
    socketService.offerDraw(gameId);
  }, []);

  const acceptDraw = useCallback((gameId: string) => {
    socketService.acceptDraw(gameId);
  }, []);

  const declineDraw = useCallback((gameId: string) => {
    socketService.declineDraw(gameId);
  }, []);

  const resign = useCallback((gameId: string) => {
    socketService.resign(gameId);
  }, []);

  const spectateGame = useCallback((gameId: string) => {
    socketService.spectateGame(gameId);
  }, []);

  const stopSpectating = useCallback((gameId: string) => {
    socketService.stopSpectating(gameId);
  }, []);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, [dispatch]);

  // Auto-connect on mount if authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !connected && !reconnecting) {
      connect();
    }
  }, [connect, connected, reconnecting]);

  return {
    connected,
    reconnecting,
    error,
    onlineUsers,
    connect,
    disconnect,
    joinGame,
    leaveGame,
    makeMove,
    offerDraw,
    acceptDraw,
    declineDraw,
    resign,
    spectateGame,
    stopSpectating,
    clearError,
  };
};