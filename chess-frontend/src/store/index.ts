import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Game, GameState, Notification, AppSettings, SoundConfig, ThemeConfig } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

interface GameState {
  currentGame: Game | null;
  gameState: GameState | null;
  availableGames: Game[];
  isLoading: boolean;
  setCurrentGame: (game: Game | null) => void;
  setGameState: (state: GameState | null) => void;
  setAvailableGames: (games: Game[]) => void;
  setLoading: (loading: boolean) => void;
  addMove: (move: any) => void;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

interface SettingsState {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateSoundSettings: (sound: Partial<SoundConfig>) => void;
  updateThemeSettings: (theme: Partial<ThemeConfig>) => void;
}

interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean;
  soundEnabled: boolean;
  setSidebarOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: (user) => set({ user, isAuthenticated: true }),
        logout: () => set({ user: null, isAuthenticated: false }),
        setLoading: (isLoading) => set({ isLoading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      }
    ),
    { name: 'auth-store' }
  )
);

// Game Store
export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      currentGame: null,
      gameState: null,
      availableGames: [],
      isLoading: false,
      setCurrentGame: (currentGame) => set({ currentGame }),
      setGameState: (gameState) => set({ gameState }),
      setAvailableGames: (availableGames) => set({ availableGames }),
      setLoading: (isLoading) => set({ isLoading }),
      addMove: (move) => {
        const { gameState } = get();
        if (gameState) {
          set({
            gameState: {
              ...gameState,
              moves: [...gameState.moves, move],
              currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white',
            },
          });
        }
      },
    }),
    { name: 'game-store' }
  )
);

// Notification Store
export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => {
        const id = Date.now().toString();
        const timestamp = Date.now();
        const newNotification = { ...notification, id, timestamp };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep only last 50
          unreadCount: state.unreadCount + 1,
        }));
      },
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: state.notifications.find((n) => n.id === id && !n.read)
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        })),
    }),
    { name: 'notification-store' }
  )
);

// Settings Store
export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        settings: {
          sound: {
            enabled: true,
            volume: 0.7,
            moveSound: true,
            captureSound: true,
            checkSound: true,
            checkmateSound: true,
            timerSound: true,
          },
          theme: {
            boardStyle: 'classic',
            pieceStyle: 'classic',
            darkMode: true,
            animations: true,
          },
          notifications: true,
          autoQueen: true,
          showCoordinates: true,
          showLastMove: true,
          showValidMoves: true,
        },
        updateSettings: (newSettings) =>
          set((state) => ({
            settings: { ...state.settings, ...newSettings },
          })),
        updateSoundSettings: (sound) =>
          set((state) => ({
            settings: {
              ...state.settings,
              sound: { ...state.settings.sound, ...sound },
            },
          })),
        updateThemeSettings: (theme) =>
          set((state) => ({
            settings: {
              ...state.settings,
              theme: { ...state.settings.theme, ...theme },
            },
          })),
      }),
      {
        name: 'settings-storage',
      }
    ),
    { name: 'settings-store' }
  )
);

// UI Store
export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      sidebarOpen: false,
      chatOpen: false,
      soundEnabled: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setChatOpen: (chatOpen) => set({ chatOpen }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }),
    { name: 'ui-store' }
  )
);