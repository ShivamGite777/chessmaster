import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  CreateGameRequest, 
  JoinGameRequest,
  User,
  Game,
  GameHistory,
  LeaderboardEntry
} from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth-token');
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
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth-token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.client.post('/auth/refresh');
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.put('/auth/profile', userData);
    return response.data;
  }

  // Game endpoints
  async createGame(gameData: CreateGameRequest): Promise<ApiResponse<Game>> {
    const response = await this.client.post('/games', gameData);
    return response.data;
  }

  async joinGame(gameData: JoinGameRequest): Promise<ApiResponse<Game>> {
    const response = await this.client.post('/games/join', gameData);
    return response.data;
  }

  async getGame(gameId: string): Promise<ApiResponse<Game>> {
    const response = await this.client.get(`/games/${gameId}`);
    return response.data;
  }

  async getAvailableGames(): Promise<ApiResponse<Game[]>> {
    const response = await this.client.get('/games/available');
    return response.data;
  }

  async getMyGames(): Promise<ApiResponse<Game[]>> {
    const response = await this.client.get('/games/my-games');
    return response.data;
  }

  async resignGame(gameId: string): Promise<ApiResponse<void>> {
    const response = await this.client.post(`/games/${gameId}/resign`);
    return response.data;
  }

  async offerDraw(gameId: string): Promise<ApiResponse<void>> {
    const response = await this.client.post(`/games/${gameId}/draw`);
    return response.data;
  }

  async acceptDraw(gameId: string): Promise<ApiResponse<void>> {
    const response = await this.client.post(`/games/${gameId}/draw/accept`);
    return response.data;
  }

  async declineDraw(gameId: string): Promise<ApiResponse<void>> {
    const response = await this.client.post(`/games/${gameId}/draw/decline`);
    return response.data;
  }

  // Game history and statistics
  async getGameHistory(page: number = 1, limit: number = 20): Promise<ApiResponse<GameHistory[]>> {
    const response = await this.client.get(`/games/history?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getGameById(gameId: string): Promise<ApiResponse<GameHistory>> {
    const response = await this.client.get(`/games/history/${gameId}`);
    return response.data;
  }

  // Leaderboard
  async getLeaderboard(page: number = 1, limit: number = 50): Promise<ApiResponse<LeaderboardEntry[]>> {
    const response = await this.client.get(`/leaderboard?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Statistics
  async getStatistics(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/statistics');
    return response.data;
  }

  // Search users
  async searchUsers(query: string): Promise<ApiResponse<User[]>> {
    const response = await this.client.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  // Check username availability
  async checkUsername(username: string): Promise<ApiResponse<{ available: boolean }>> {
    const response = await this.client.get(`/users/check-username?username=${encodeURIComponent(username)}`);
    return response.data;
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await this.client.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();