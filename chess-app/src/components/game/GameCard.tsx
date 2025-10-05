import React from 'react';
import { motion } from 'framer-motion';
import type { Game } from '../../types/game.types';
import { TimeUtils } from '../../utils/time.utils';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface GameCardProps {
  game: Game;
  onJoin: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onJoin }) => {
  const timeControl = TimeUtils.getTimeControlLabel(
    game.timeControl,
    game.timeLimit,
    game.increment
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-yellow-400';
      case 'active': return 'text-green-400';
      case 'finished': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'Waiting for opponent';
      case 'active': return 'In progress';
      case 'finished': return 'Finished';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-gray-700 border-gray-600 hover:border-gray-500 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">
                  {game.hostUsername.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-white">{game.hostUsername}</p>
                <p className="text-sm text-gray-400">ELO: {game.hostElo}</p>
              </div>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(game.status)}`}>
              {getStatusText(game.status)}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Time Control</span>
              <span className="text-white">{timeControl}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Color</span>
              <span className="text-white capitalize">{game.colorPreference}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Type</span>
              <span className="text-white">{game.isPublic ? 'Public' : 'Private'}</span>
            </div>
          </div>

          <Button
            onClick={onJoin}
            className="w-full"
            disabled={game.status !== 'waiting'}
          >
            {game.status === 'waiting' ? 'Join Game' : 'View Game'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};