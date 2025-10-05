export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  elo: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  avatar?: File;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}