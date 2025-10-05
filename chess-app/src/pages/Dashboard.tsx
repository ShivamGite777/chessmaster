import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { useSocket } from '../hooks/useSocket';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GameCard } from '../components/game/GameCard';
import { CreateGameModal } from '../components/game/CreateGameModal';
import { LeaderboardPreview } from '../components/game/LeaderboardPreview';
import { RecentGames } from '../components/game/RecentGames';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { availableGames, stats, getAvailableGames, getStats } = useGame();
  const { onlineUsers, connected } = useSocket();
  const [showCreateGame, setShowCreateGame] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    getAvailableGames();
    getStats();
  }, [isAuthenticated, navigate, getAvailableGames, getStats]);

  const handleQuickPlay = () => {
    setShowCreateGame(true);
  };

  const handleJoinGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleCreateGame = () => {
    setShowCreateGame(true);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Chess Master</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{onlineUsers} online</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-400">ELO: {user.elo}</p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Play Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Play</CardTitle>
                  <CardDescription className="text-gray-400">
                    Start a new game or join an existing one
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleQuickPlay}
                      className="flex-1 bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      Quick Play
                    </Button>
                    <Button
                      onClick={handleCreateGame}
                      variant="outline"
                      className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                      size="lg"
                    >
                      Create Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Available Games */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Available Games</CardTitle>
                  <CardDescription className="text-gray-400">
                    Join games created by other players
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {availableGames.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p>No games available at the moment</p>
                      <p className="text-sm">Create a new game to get started</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableGames.map((game) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          onJoin={() => handleJoinGame(game.id)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Games */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RecentGames />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Your Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Games Played</span>
                        <span className="text-white font-medium">{stats.totalGames}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wins</span>
                        <span className="text-green-400 font-medium">{stats.wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Losses</span>
                        <span className="text-red-400 font-medium">{stats.losses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Draws</span>
                        <span className="text-yellow-400 font-medium">{stats.draws}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="text-white font-medium">{stats.winRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current ELO</span>
                        <span className="text-primary font-medium">{stats.currentElo}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <p>Loading stats...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LeaderboardPreview />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Create Game Modal */}
      {showCreateGame && (
        <CreateGameModal
          onClose={() => setShowCreateGame(false)}
          onGameCreated={(gameId) => {
            setShowCreateGame(false);
            navigate(`/game/${gameId}`);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;