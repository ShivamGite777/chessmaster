export interface Game {
  id: string;
  hostId: string;
  hostUsername: string;
  hostElo: number;
  hostAvatar?: string;
  opponentId?: string;
  opponentUsername?: string;
  opponentElo?: number;
  opponentAvatar?: string;
  timeControl: TimeControl;
  colorPreference: 'white' | 'black' | 'random';
  isPublic: boolean;
  status: GameStatus;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  result?: GameResult;
  moves: Move[];
  currentFen: string;
  whiteTimeRemaining: number;
  blackTimeRemaining: number;
  isWhiteTurn: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  drawOfferedBy?: string;
  resignedBy?: string;
}

export interface TimeControl {
  type: 'blitz' | 'rapid' | 'classical';
  initial: number; // minutes
  increment: number; // seconds
  label: string; // e.g., "3+0", "10+0", "15+10"
}

export type GameStatus = 'waiting' | 'active' | 'finished' | 'abandoned';
export type GameResult = 'white_wins' | 'black_wins' | 'draw' | 'abandoned';

export interface Move {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  san: string; // Standard Algebraic Notation
  timestamp: number;
  timeRemaining: {
    white: number;
    black: number;
  };
}

export interface GameState {
  board: string; // FEN notation
  turn: 'white' | 'black';
  moveHistory: Move[];
  capturedPieces: {
    white: string[];
    black: string[];
  };
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  lastMove?: {
    from: string;
    to: string;
  };
}

export interface GameSettings {
  timeControl: TimeControl;
  colorPreference: 'white' | 'black' | 'random';
  isPublic: boolean;
}

export interface CreateGameRequest {
  timeControl: TimeControl;
  colorPreference: 'white' | 'black' | 'random';
  isPublic: boolean;
}

export interface JoinGameRequest {
  gameId: string;
}

export interface MakeMoveRequest {
  gameId: string;
  from: string;
  to: string;
  promotion?: string;
}

export interface GameActionRequest {
  gameId: string;
  action: 'resign' | 'offer_draw' | 'accept_draw' | 'decline_draw';
}