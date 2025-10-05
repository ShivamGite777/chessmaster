import { apiClient } from './api';
import type { Game, GameSettings, GameStats, LeaderboardEntry, GameHistoryEntry, Move } from '../types/game.types';

class GameService {
  async createGame(settings: GameSettings): Promise<Game> {
    return apiClient.post<Game>('/games', settings);
  }

  async getAvailableGames(): Promise<Game[]> {
    return apiClient.get<Game[]>('/games/available');
  }

  async joinGame(gameId: string): Promise<Game> {
    return apiClient.post<Game>(`/games/${gameId}/join`);
  }

  async getGameDetails(gameId: string): Promise<Game> {
    return apiClient.get<Game>(`/games/${gameId}`);
  }

  async makeMove(gameId: string, move: { from: string; to: string; promotion?: string }): Promise<{ success: boolean; gameState?: any }> {
    return apiClient.post<{ success: boolean; gameState?: any }>(`/games/${gameId}/move`, move);
  }

  async resignGame(gameId: string): Promise<void> {
    return apiClient.post<void>(`/games/${gameId}/resign`);
  }

  async offerDraw(gameId: string): Promise<void> {
    return apiClient.post<void>(`/games/${gameId}/draw`);
  }

  async acceptDraw(gameId: string): Promise<void> {
    return apiClient.post<void>(`/games/${gameId}/draw/accept`);
  }

  async declineDraw(gameId: string): Promise<void> {
    return apiClient.post<void>(`/games/${gameId}/draw/decline`);
  }

  async getStats(): Promise<GameStats> {
    return apiClient.get<GameStats>('/games/stats');
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return apiClient.get<LeaderboardEntry[]>('/games/leaderboard');
  }

  async getGameHistory(page = 1, limit = 20): Promise<{ games: GameHistoryEntry[]; total: number; page: number; totalPages: number }> {
    return apiClient.get<{ games: GameHistoryEntry[]; total: number; page: number; totalPages: number }>(`/games/history?page=${page}&limit=${limit}`);
  }

  async getGameReplay(gameId: string): Promise<{ moves: Move[]; game: Game }> {
    return apiClient.get<{ moves: Move[]; game: Game }>(`/games/${gameId}/replay`);
  }

  async spectateGame(gameId: string): Promise<Game> {
    return apiClient.post<Game>(`/games/${gameId}/spectate`);
  }

  async leaveGame(gameId: string): Promise<void> {
    return apiClient.post<void>(`/games/${gameId}/leave`);
  }

  async getOnlineUsers(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>('/games/online-users');
  }

  async getRecentGames(limit = 10): Promise<Game[]> {
    return apiClient.get<Game[]>(`/games/recent?limit=${limit}`);
  }
}

export const gameService = new GameService();