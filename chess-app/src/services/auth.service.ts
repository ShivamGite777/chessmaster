import { apiClient } from './api';
import type { User, LoginCredentials, RegisterData, AuthResponse, PasswordResetRequest } from '../types/auth.types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('confirmPassword', userData.confirmPassword);
    formData.append('acceptTerms', userData.acceptTerms.toString());
    
    if (userData.avatar) {
      formData.append('avatar', userData.avatar);
    }

    return apiClient.post<AuthResponse>('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  }

  async refreshToken(): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh');
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<void> {
    return apiClient.post<void>('/auth/forgot-password', data);
  }

  async resetPassword(token: string, password: string): Promise<void> {
    return apiClient.post<void>('/auth/reset-password', { token, password });
  }

  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    return apiClient.get<{ available: boolean }>(`/auth/check-username?username=${encodeURIComponent(username)}`);
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return apiClient.get<{ available: boolean }>(`/auth/check-email?email=${encodeURIComponent(email)}`);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.patch<User>('/auth/profile', data);
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    return apiClient.uploadFile<{ avatarUrl: string }>('/auth/avatar', file);
  }

  async deleteAccount(): Promise<void> {
    return apiClient.delete<void>('/auth/account');
  }
}

export const authService = new AuthService();