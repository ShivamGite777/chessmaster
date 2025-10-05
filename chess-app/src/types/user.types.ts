export interface UserStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentElo: number;
  eloHistory: EloHistoryPoint[];
  bestElo: number;
  worstElo: number;
  averageOpponentElo: number;
  longestWinStreak: number;
  longestLossStreak: number;
  currentStreak: number;
  streakType: 'win' | 'loss' | 'draw' | 'none';
}

export interface EloHistoryPoint {
  elo: number;
  date: string;
  gameId: string;
  result: 'win' | 'loss' | 'draw';
  opponentElo: number;
}

export interface GameHistory {
  id: string;
  opponentUsername: string;
  opponentElo: number;
  opponentAvatar?: string;
  timeControl: string;
  result: 'win' | 'loss' | 'draw';
  eloChange: number;
  duration: number; // seconds
  moves: number;
  playedAt: string;
  gameUrl: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  elo: number;
  gamesPlayed: number;
  winRate: number;
  isCurrentUser?: boolean;
}

export interface ProfileUpdate {
  username?: string;
  email?: string;
  avatar?: File;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}