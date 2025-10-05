import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const Leaderboard: React.FC = () => {
  const { leaderboard, getLeaderboard } = useGame();

  React.useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Leaderboard</CardTitle>
              <CardDescription className="text-gray-400">
                Top players by ELO rating
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>Loading leaderboard...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-sm font-bold">
                          {entry.rank}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold">
                              {entry.user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{entry.user.username}</h3>
                            <p className="text-sm text-gray-400">
                              {entry.gamesPlayed} games • {entry.winRate.toFixed(1)}% win rate
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{entry.elo}</div>
                        <div className="text-sm text-gray-400">ELO</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;