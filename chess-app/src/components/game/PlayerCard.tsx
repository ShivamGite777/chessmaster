import React from 'react';
import { motion } from 'framer-motion';
import { Timer } from './Timer';
import { Card, CardContent } from '../ui/Card';

interface Player {
  username: string;
  elo: number;
  avatar?: string;
}

interface TimerProps {
  time: number;
  isRunning: boolean;
  isLow: boolean;
  isCritical: boolean;
}

interface PlayerCardProps {
  player: Player;
  isOpponent: boolean;
  timer: TimerProps;
  className?: string;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isOpponent,
  timer,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              {player.avatar ? (
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold">
                  {player.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{player.username}</h3>
              <p className="text-sm text-gray-400">ELO: {player.elo}</p>
            </div>
          </div>

          <Timer
            time={timer.time}
            isRunning={timer.isRunning}
            isLow={timer.isLow}
            isCritical={timer.isCritical}
          />

          {isOpponent && (
            <div className="mt-3 text-center">
              <span className="text-xs text-gray-400">Opponent</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};