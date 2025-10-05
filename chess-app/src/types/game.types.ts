export type PieceColor = 'white' | 'black';
export type GameStatus = 'waiting' | 'active' | 'finished' | 'abandoned';
export type TimeControl = 'blitz' | 'rapid' | 'classical';
export type GameResult = 'white_wins' | 'black_wins' | 'draw' | 'abandoned';

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
  timeLimit: number; // in seconds
  increment: number; // in seconds
  colorPreference: PieceColor | 'random';
  isPublic: boolean;
  status: GameStatus;
  result?: GameResult;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export interface GameState {
  board: string; // FEN notation
  turn: PieceColor;
  moveHistory: Move[];
  capturedPieces: {
    white: Piece[];
    black: Piece[];
  };
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  lastMove?: Move;
  selectedSquare?: string | null;
  legalMoves?: string[];
  drawOfferPending?: boolean;
}

export interface Move {
  from: string;
  to: string;
  piece: string;
  color: PieceColor;
  promotion?: string;
  san: string; // Standard Algebraic Notation
  timestamp: number;
  timeRemaining: {
    white: number;
    black: number;
  };
}

export interface Piece {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: PieceColor;
  square: string;
}

export interface GameSettings {
  timeControl: TimeControl;
  timeLimit: number;
  increment: number;
  colorPreference: PieceColor | 'random';
  isPublic: boolean;
}

export interface GameTimers {
  whiteTime: number; // milliseconds
  blackTime: number; // milliseconds
  lastUpdate: number;
}

export interface GameUIState {
  selectedSquare: string | null;
  legalMoves: string[];
  drawOfferPending: boolean;
  isPromoting: boolean;
  promotionSquare?: string;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentElo: number;
  eloHistory: EloHistoryEntry[];
}

export interface EloHistoryEntry {
  elo: number;
  date: string;
  gameId: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  elo: number;
  gamesPlayed: number;
  winRate: number;
}

export interface GameHistoryEntry {
  id: string;
  opponent: {
    username: string;
    elo: number;
    avatar?: string;
  };
  result: 'win' | 'loss' | 'draw';
  timeControl: TimeControl;
  duration: number; // in seconds
  playedAt: string;
  moves: Move[];
}