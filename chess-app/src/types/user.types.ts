export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  elo: number;
  stats: UserStats;
  createdAt: string;
  lastActiveAt: string;
}

export interface UserStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentElo: number;
  highestElo: number;
  eloHistory: EloHistoryEntry[];
  recentGames: GameHistoryEntry[];
}

export interface EloHistoryEntry {
  elo: number;
  date: string;
  gameId: string;
  change: number;
}

export interface GameHistoryEntry {
  id: string;
  opponent: {
    username: string;
    elo: number;
    avatar?: string;
  };
  result: 'win' | 'loss' | 'draw';
  timeControl: string;
  duration: number;
  playedAt: string;
  moves: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  autoQueen: boolean;
  showLegalMoves: boolean;
  showCoordinates: boolean;
  boardColor: 'classic' | 'modern' | 'wood';
}

export interface OnlineUser {
  id: string;
  username: string;
  avatar?: string;
  elo: number;
  isOnline: boolean;
  lastSeen: string;
}