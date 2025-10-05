import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useGameStore } from '../store';
import { apiClient } from '../utils/api';
import { soundManager } from '../utils/sounds';
import CreateGameModal from '../components/CreateGameModal';
import GameList from '../components/GameList';
import QuickMatchButton from '../components/QuickMatchButton';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { availableGames, setAvailableGames, setCurrentGame, setLoading: _setLoading } = useGameStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  // Demo user for non-authenticated users
  const demoUser = {
    id: 'demo-user',
    username: 'Demo Player',
    email: 'demo@chessmaster.com',
    avatar: undefined,
    elo: 1200,
    wins: 15,
    losses: 8,
    draws: 3,
    createdAt: new Date().toISOString()
  };

  const currentUser = isAuthenticated ? user : demoUser;

  useEffect(() => {
    loadAvailableGames();
  }, []);

  const loadAvailableGames = async () => {
    setIsLoadingGames(true);
    console.log('Loading games, isAuthenticated:', isAuthenticated);
    try {
      if (isAuthenticated) {
        const response = await apiClient.getAvailableGames();
        if (response.success && response.data) {
          setAvailableGames(response.data);
        }
      } else {
        console.log('Creating demo games...');
        // Demo mode - create some sample games
        const demoGames = [
          {
            id: 'demo-game-1',
            whitePlayer: demoUser,
            blackPlayer: {
              id: 'demo-opponent-1',
              username: 'Chess Master',
              email: 'master@chess.com',
              avatar: undefined,
              elo: 1500,
              wins: 25,
              losses: 5,
              draws: 2,
              createdAt: new Date().toISOString()
            },
            status: 'active' as const,
            timeControl: {
              type: 'blitz' as const,
              initialTime: 300,
              increment: 5
            },
            moves: [],
            currentPlayer: 'white' as const,
            winner: undefined,
            createdAt: new Date().toISOString(),
            startedAt: new Date().toISOString()
          },
          {
            id: 'demo-game-2',
            whitePlayer: {
              id: 'demo-opponent-2',
              username: 'Chess Pro',
              email: 'pro@chess.com',
              avatar: undefined,
              elo: 1800,
              wins: 50,
              losses: 10,
              draws: 5,
              createdAt: new Date().toISOString()
            },
            blackPlayer: demoUser,
            status: 'waiting' as const,
            timeControl: {
              type: 'rapid' as const,
              initialTime: 600,
              increment: 10
            },
            moves: [],
            currentPlayer: 'white' as const,
            winner: undefined,
            createdAt: new Date().toISOString(),
            startedAt: undefined
          }
        ];
        console.log('Demo games created:', demoGames);
        setAvailableGames(demoGames);
      }
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setIsLoadingGames(false);
    }
  };

  const handleCreateGame = () => {
    soundManager.playClick();
    setShowCreateModal(true);
  };

  const handleQuickMatch = () => {
    soundManager.playClick();
    // Create a demo game and navigate to it
    const demoGame = {
      id: 'demo-quick-match',
      whitePlayer: currentUser,
      blackPlayer: {
        id: 'demo-opponent-quick',
        username: 'Chess Bot',
        email: 'bot@chess.com',
        avatar: undefined,
        elo: 1400,
        wins: 30,
        losses: 10,
        draws: 5,
        createdAt: new Date().toISOString()
      },
      status: 'active' as const,
      timeControl: {
        type: 'blitz' as const,
        initialTime: 300,
        increment: 5
      },
      moves: [],
      currentPlayer: 'white' as const,
      winner: undefined,
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString()
    };
    
    // Set the current game and navigate to it
    setCurrentGame(demoGame);
    window.location.href = `/game/${demoGame.id}`;
  };

  const stats = [
    {
      label: 'Games Won',
      value: currentUser?.wins || 0,
      color: 'text-success',
      icon: '🏆'
    },
    {
      label: 'Games Lost',
      value: currentUser?.losses || 0,
      color: 'text-danger',
      icon: '💔'
    },
    {
      label: 'Games Drawn',
      value: currentUser?.draws || 0,
      color: 'text-gray-400',
      icon: '🤝'
    },
    {
      label: 'ELO Rating',
      value: currentUser?.elo || 1200,
      color: 'text-primary-400',
      icon: '⭐'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {isAuthenticated ? `Welcome back, ${currentUser?.username}!` : `Welcome, ${currentUser?.username}!`}
          </h1>
          <p className="text-gray-400 text-lg">
            {isAuthenticated ? 'Ready for your next chess challenge?' : 'Try out our chess platform - no account required!'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {stats.map((stat, _index) => (
            <motion.div
              key={stat.label}
              className="glass-dark rounded-xl p-6 text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <button
            onClick={handleCreateGame}
            className="btn-primary flex-1 text-lg py-4"
          >
            <span className="mr-2">🎮</span>
            Create New Game
          </button>
          <QuickMatchButton onQuickMatch={handleQuickMatch} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Available Games */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="glass-dark rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Available Games</h2>
                <button
                  onClick={loadAvailableGames}
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                  disabled={isLoadingGames}
                >
                  {isLoadingGames ? (
                    <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </button>
              </div>
              <GameList games={availableGames} isLoading={isLoadingGames} />
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Recent Games */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Recent Games</h3>
              <div className="space-y-3">
                <div className="text-gray-400 text-sm">
                  No recent games yet. Start playing to see your history here!
                </div>
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Top Players</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <span className="text-white font-medium">GrandMaster</span>
                  </div>
                  <span className="text-primary-400 font-bold">2850</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <span className="text-white font-medium">ChessPro</span>
                  </div>
                  <span className="text-primary-400 font-bold">2780</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <span className="text-white font-medium">KingSlayer</span>
                  </div>
                  <span className="text-primary-400 font-bold">2720</span>
                </div>
              </div>
              <button className="w-full mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
                View Full Leaderboard →
              </button>
            </div>

            {/* Tips */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">💡 Chess Tips</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>• Control the center of the board early in the game</p>
                <p>• Develop your pieces before attacking</p>
                <p>• Castle early to protect your king</p>
                <p>• Always look for tactics and combinations</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Create Game Modal */}
        {showCreateModal && (
          <CreateGameModal
            onClose={() => setShowCreateModal(false)}
            onGameCreated={() => {
              setShowCreateModal(false);
              loadAvailableGames();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;