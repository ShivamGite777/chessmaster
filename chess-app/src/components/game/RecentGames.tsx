import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { TimeUtils } from '../../utils/time.utils';

export const RecentGames: React.FC = () => {
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
      case 'win': return 'W';
      case 'loss': return 'L';
      case 'draw': return 'D';
      default: return '?';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Games</CardTitle>
        <CardDescription className="text-gray-400">
          Your latest matches
        </CardDescription>
      </CardHeader>
      <CardContent>
        {gameHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No recent games</p>
            <p className="text-sm">Start playing to see your game history</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gameHistory.slice(0, 5).map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors cursor-pointer"
                onClick={() => {
                  // Navigate to game details or replay
                  window.location.href = `/game/${game.id}`;
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    game.result === 'win' ? 'bg-green-500/20 text-green-400' :
                    game.result === 'loss' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {getResultText(game.result)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">
                        vs {game.opponent.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        (ELO: {game.opponent.elo})
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {TimeUtils.getTimeControlLabel(game.timeControl, 0, 0)} • {TimeUtils.formatDuration(game.duration)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getResultColor(game.result)}`}>
                    {game.result === 'win' ? 'Win' : game.result === 'loss' ? 'Loss' : 'Draw'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {TimeUtils.getRelativeTime(new Date(game.playedAt).getTime())}
                  </div>
                </div>
              </motion.div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-4 border-gray-600 text-white hover:bg-gray-700"
              onClick={() => {
                // Navigate to full game history
                window.location.href = '/history';
              }}
            >
              View All Games
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};