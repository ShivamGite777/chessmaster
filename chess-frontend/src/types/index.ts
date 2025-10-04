export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  createdAt: string;
}

export interface Game {
  id: string;
  whitePlayer: User;
  blackPlayer: User;
  status: 'waiting' | 'active' | 'finished';
  timeControl: TimeControl;
  moves: Move[];
  currentPlayer: 'white' | 'black';
  winner?: 'white' | 'black' | 'draw';
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface TimeControl {
  type: 'blitz' | 'rapid' | 'classical';
  initialTime: number; // in seconds
  increment: number; // in seconds
}

export interface Move {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  san: string; // Standard Algebraic Notation
  timestamp: number;
  timeLeft: {
    white: number;
    black: number;
  };
}

export interface GameState {
  fen: string;
  moves: Move[];
  currentPlayer: 'white' | 'black';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  capturedPieces: {
    white: string[];
    black: string[];
  };
  timeLeft: {
    white: number;
    black: number;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  type: 'user' | 'system';
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  elo: number;
  gamesPlayed: number;
  winRate: number;
}

export interface GameHistory {
  id: string;
  opponent: User;
  result: 'win' | 'loss' | 'draw';
  eloChange: number;
  moves: number;
  duration: number;
  date: string;
  pgn: string;
}

export interface SoundConfig {
  enabled: boolean;
  volume: number;
  moveSound: boolean;
  captureSound: boolean;
  checkSound: boolean;
  checkmateSound: boolean;
  timerSound: boolean;
}

export interface ThemeConfig {
  boardStyle: 'classic' | 'modern' | 'wood';
  pieceStyle: 'classic' | 'modern';
  darkMode: boolean;
  animations: boolean;
}

export interface AppSettings {
  sound: SoundConfig;
  theme: ThemeConfig;
  notifications: boolean;
  autoQueen: boolean;
  showCoordinates: boolean;
  showLastMove: boolean;
  showValidMoves: boolean;
}

export interface SocketEvents {
  // Game events
  'game:created': (game: Game) => void;
  'game:joined': (game: Game) => void;
  'game:move': (move: Move) => void;
  'game:ended': (game: Game) => void;
  'game:timeout': (game: Game) => void;
  
  // User events
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
  
  // Chat events
  'chat:message': (message: ChatMessage) => void;
  
  // Notification events
  'notification': (notification: Notification) => void;
  
  // Error events
  'error': (error: string) => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateGameRequest {
  timeControl: TimeControl;
  isPrivate?: boolean;
  password?: string;
}

export interface JoinGameRequest {
  gameId: string;
  password?: string;
}