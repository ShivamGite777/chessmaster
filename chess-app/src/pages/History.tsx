import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { TimeUtils } from '../utils/time.utils';

const History: React.FC = () => {
  const { gameHistory, getGameHistory } = useGame();

  React.useEffect(() => {
    getGameHistory();
  }, [getGameHistory]);

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'text-green-400';
      case 'loss': return 'text-red-400';
      case 'draw': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'win': return 'Win';
      case 'loss': return 'Loss';
      case 'draw': return 'Draw';
      default: return 'Unknown';
    }
  };

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
              <CardTitle className="text-2xl text-white">Game History</CardTitle>
              <CardDescription className="text-gray-400">
                Your completed games
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gameHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No games found</p>
                  <p className="text-sm">Start playing to see your game history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {gameHistory.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors cursor-pointer"
                      onClick={() => {
                        // Navigate to game details or replay
                        window.location.href = `/game/${game.id}`;
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                          game.result === 'win' ? 'bg-green-500/20 text-green-400' :
                          game.result === 'loss' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {game.result === 'win' ? 'W' : game.result === 'loss' ? 'L' : 'D'}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">
                            vs {game.opponent.username}
                          </h3>
                          <p className="text-sm text-gray-400">
                            ELO: {game.opponent.elo} • {TimeUtils.getTimeControlLabel(game.timeControl, 0, 0)} • {TimeUtils.formatDuration(game.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-medium ${getResultColor(game.result)}`}>
                          {getResultText(game.result)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {TimeUtils.getRelativeTime(new Date(game.playedAt).getTime())}
                        </div>
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

export default History;