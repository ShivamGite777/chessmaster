import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AuthResponse, LoginCredentials, RegisterData } from '../types/auth.types';
import { Game, CreateGameRequest, JoinGameRequest, MakeMoveRequest, GameActionRequest } from '../types/game.types';
import { UserStats, GameHistory, LeaderboardEntry } from '../types/user.types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('confirmPassword', userData.confirmPassword);
    formData.append('termsAccepted', userData.termsAccepted.toString());
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async getProfile(): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.get('/auth/profile');
    return response.data;
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  }

  // Game endpoints
  async createGame(settings: CreateGameRequest): Promise<Game> {
    const response: AxiosResponse<Game> = await this.api.post('/games', settings);
    return response.data;
  }

  async getAvailableGames(): Promise<Game[]> {
    const response: AxiosResponse<Game[]> = await this.api.get('/games/available');
    return response.data;
  }

  async joinGame(request: JoinGameRequest): Promise<Game> {
    const response: AxiosResponse<Game> = await this.api.post('/games/join', request);
    return response.data;
  }

  async getGameDetails(gameId: string): Promise<Game> {
    const response: AxiosResponse<Game> = await this.api.get(`/games/${gameId}`);
    return response.data;
  }

  async makeMove(request: MakeMoveRequest): Promise<Game> {
    const response: AxiosResponse<Game> = await this.api.post('/games/move', request);
    return response.data;
  }

  async resign(request: GameActionRequest): Promise<Game> {
    const response: AxiosResponse<Game> = await this.api.post('/games/resign', request);
    return response.data;
  }

  async offerDraw(request: GameActionRequest): Promise<Game> {
    const response: AxiosResponse<Game> = await this.api.post('/games/offer-draw', request);
    return response.data;
  }

  async respondToDrawOffer(request: GameActionRequest): Promise<Game> {
    const response: AxiosResponse<Game> = await this.api.post('/games/draw-response', request);
    return response.data;
  }

  // User endpoints
  async getUserStats(userId: string): Promise<UserStats> {
    const response: AxiosResponse<UserStats> = await this.api.get(`/users/${userId}/stats`);
    return response.data;
  }

  async getLeaderboard(page: number = 1, limit: number = 50): Promise<{
    entries: LeaderboardEntry[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response: AxiosResponse<{
      entries: LeaderboardEntry[];
      total: number;
      page: number;
      totalPages: number;
    }> = await this.api.get(`/users/leaderboard?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getGameHistory(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters?: {
      result?: 'win' | 'loss' | 'draw';
      timeControl?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<{
    games: GameHistory[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.result && { result: filters.result }),
      ...(filters?.timeControl && { timeControl: filters.timeControl }),
      ...(filters?.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters?.dateTo && { dateTo: filters.dateTo }),
    });

    const response: AxiosResponse<{
      games: GameHistory[];
      total: number;
      page: number;
      totalPages: number;
    }> = await this.api.get(`/users/${userId}/history?${params}`);
    return response.data;
  }

  async updateProfile(userId: string, updates: {
    username?: string;
    email?: string;
    avatar?: File;
  }): Promise<AuthResponse> {
    const formData = new FormData();
    if (updates.username) formData.append('username', updates.username);
    if (updates.email) formData.append('email', updates.email);
    if (updates.avatar) formData.append('avatar', updates.avatar);

    const response: AxiosResponse<AuthResponse> = await this.api.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async changePassword(userId: string, passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response: AxiosResponse<{ message: string }> = await this.api.post(`/users/${userId}/change-password`, passwordData);
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeAuthToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const apiService = new ApiService();
export default apiService;