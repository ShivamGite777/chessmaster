import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Game, GameState, Move, GameSettings, GameTimers, GameStats, LeaderboardEntry, GameHistoryEntry } from '../types/game.types';
import { gameService } from '../services/game.service';

interface GameSliceState {
  currentGame: Game | null;
  availableGames: Game[];
  gameState: GameState | null;
  timers: GameTimers | null;
  stats: GameStats | null;
  leaderboard: LeaderboardEntry[];
  gameHistory: GameHistoryEntry[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GameSliceState = {
  currentGame: null,
  availableGames: [],
  gameState: null,
  timers: null,
  stats: null,
  leaderboard: [],
  gameHistory: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const createGame = createAsyncThunk(
  'game/createGame',
  async (settings: GameSettings, { rejectWithValue }) => {
    try {
      const game = await gameService.createGame(settings);
      return game;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create game');
    }
  }
);

export const fetchAvailableGames = createAsyncThunk(
  'game/fetchAvailableGames',
  async (_, { rejectWithValue }) => {
    try {
      const games = await gameService.getAvailableGames();
      return games;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch games');
    }
  }
);

export const joinGame = createAsyncThunk(
  'game/joinGame',
  async (gameId: string, { rejectWithValue }) => {
    try {
      const game = await gameService.joinGame(gameId);
      return game;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join game');
    }
  }
);

export const fetchGameDetails = createAsyncThunk(
  'game/fetchGameDetails',
  async (gameId: string, { rejectWithValue }) => {
    try {
      const game = await gameService.getGameDetails(gameId);
      return game;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch game details');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'game/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await gameService.getStats();
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'game/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboard = await gameService.getLeaderboard();
      return leaderboard;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

export const fetchGameHistory = createAsyncThunk(
  'game/fetchGameHistory',
  async (_, { rejectWithValue }) => {
    try {
      const history = await gameService.getGameHistory();
      return history;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch game history');
    }
  }
);

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<Game | null>) => {
      state.currentGame = action.payload;
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload;
    },
    addMove: (state, action: PayloadAction<Move>) => {
      if (state.gameState) {
        state.gameState.moveHistory.push(action.payload);
        state.gameState.lastMove = action.payload;
      }
    },
    setTimers: (state, action: PayloadAction<GameTimers>) => {
      state.timers = action.payload;
    },
    updateTimer: (state, action: PayloadAction<{ color: 'white' | 'black'; time: number }>) => {
      if (state.timers) {
        state.timers[`${action.payload.color}Time`] = action.payload.time;
        state.timers.lastUpdate = Date.now();
      }
    },
    setSelectedSquare: (state, action: PayloadAction<string | null>) => {
      if (state.gameState) {
        state.gameState.selectedSquare = action.payload;
      }
    },
    setLegalMoves: (state, action: PayloadAction<string[]>) => {
      if (state.gameState) {
        state.gameState.legalMoves = action.payload;
      }
    },
    setDrawOfferPending: (state, action: PayloadAction<boolean>) => {
      if (state.gameState) {
        state.gameState.drawOfferPending = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetGame: (state) => {
      state.currentGame = null;
      state.gameState = null;
      state.timers = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Game
      .addCase(createGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
        state.error = null;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Available Games
      .addCase(fetchAvailableGames.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableGames = action.payload;
      })
      .addCase(fetchAvailableGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Join Game
      .addCase(joinGame.fulfilled, (state, action) => {
        state.currentGame = action.payload;
      })
      // Fetch Game Details
      .addCase(fetchGameDetails.fulfilled, (state, action) => {
        state.currentGame = action.payload;
      })
      // Fetch Stats
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Fetch Leaderboard
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      // Fetch Game History
      .addCase(fetchGameHistory.fulfilled, (state, action) => {
        state.gameHistory = action.payload.games;
      });
  },
});

export const {
  setCurrentGame,
  setGameState,
  addMove,
  setTimers,
  updateTimer,
  setSelectedSquare,
  setLegalMoves,
  setDrawOfferPending,
  clearError,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;