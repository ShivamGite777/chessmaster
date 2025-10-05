import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import { apiClient } from '../utils/api';
import type { GameHistory } from '../types';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'settings'>('stats');

  useEffect(() => {
    loadGameHistory();
  }, []);

  const loadGameHistory = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getGameHistory();
      if (response.success && response.data) {
        setGameHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to load game history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWinRate = (): number => {
    if (!user) return 0;
    const totalGames = (user.wins || 0) + (user.losses || 0) + (user.draws || 0);
    return totalGames > 0 ? Math.round(((user.wins || 0) / totalGames) * 100) : 0;
  };

  const getTotalGames = (): number => {
    if (!user) return 0;
    return (user.wins || 0) + (user.losses || 0) + (user.draws || 0);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const getResultColor = (result: 'win' | 'loss' | 'draw'): string => {
    switch (result) {
      case 'win': return 'text-success';
      case 'loss': return 'text-danger';
      case 'draw': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getResultIcon = (result: 'win' | 'loss' | 'draw'): string => {
    switch (result) {
      case 'win': return '🏆';
      case 'loss': return '💔';
      case 'draw': return '🤝';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400 text-lg">Manage your account and view your chess statistics</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="glass-dark rounded-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{user?.username}</h2>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">{user?.elo}</div>
                  <div className="text-sm text-gray-400">ELO Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{getWinRate()}%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{getTotalGames()}</div>
                  <div className="text-sm text-gray-400">Games Played</div>
                </div>
              </div>
            </div>
            <button className="btn-secondary">
              <span className="mr-2">✏️</span>
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex space-x-1 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { id: 'stats', label: 'Statistics', icon: '📊' },
            { id: 'history', label: 'Game History', icon: '📜' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'stats' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Win/Loss/Draw Stats */}
              <div className="glass-dark rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Game Results</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏆</span>
                      <span className="text-white">Wins</span>
                    </div>
                    <span className="text-success font-bold text-xl">{user?.wins || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💔</span>
                      <span className="text-white">Losses</span>
                    </div>
                    <span className="text-danger font-bold text-xl">{user?.losses || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🤝</span>
                      <span className="text-white">Draws</span>
                    </div>
                    <span className="text-gray-400 font-bold text-xl">{user?.draws || 0}</span>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="glass-dark rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Best Rating</span>
                    <span className="text-primary-400 font-bold">{user?.elo || 1200}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Longest Win Streak</span>
                    <span className="text-success font-bold">0</span>
                  </div>
                </div>
              </div>

              {/* Time Controls */}
              <div className="glass-dark rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Preferred Time</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Blitz</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rapid</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Classical</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Recent Games</h3>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-dark-700 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <div className="h-4 bg-dark-600 rounded w-32"></div>
                            <div className="h-3 bg-dark-600 rounded w-24"></div>
                          </div>
                          <div className="h-6 bg-dark-600 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : gameHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📜</div>
                  <h4 className="text-xl font-semibold text-white mb-2">No Games Yet</h4>
                  <p className="text-gray-400">Start playing to see your game history here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {gameHistory.map((game) => (
                    <motion.div
                      key={game.id}
                      className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`text-2xl ${getResultColor(game.result)}`}>
                            {getResultIcon(game.result)}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              vs {game.opponent.username}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {formatDate(game.date)} • {game.moves} moves
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            game.eloChange > 0 ? 'text-success' : 
                            game.eloChange < 0 ? 'text-danger' : 'text-gray-400'
                          }`}>
                            {game.eloChange > 0 ? '+' : ''}{game.eloChange}
                          </div>
                          <div className="text-gray-400 text-sm">ELO</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="input-field"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <button className="btn-secondary">
                    Change Password
                  </button>
                </div>
                <div className="pt-4 border-t border-dark-600">
                  <button className="btn-danger">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;