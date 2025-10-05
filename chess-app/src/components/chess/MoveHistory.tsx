import React from 'react';
import { motion } from 'framer-motion';
import type { Move } from '../../types/game.types';
import { TimeUtils } from '../../utils/time.utils';

interface MoveHistoryProps {
  moves: Move[];
  className?: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, className = '' }) => {
  const formatMoveNumber = (index: number) => {
    return Math.floor(index / 2) + 1;
  };

  const isWhiteMove = (index: number) => {
    return index % 2 === 0;
  };

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 max-h-96 overflow-y-auto ${className}`}>
      {moves.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          <p>No moves yet</p>
        </div>
      ) : (
        <div className="p-4 space-y-1">
          {moves.map((move, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-center justify-between p-2 rounded ${
                isWhiteMove(index) ? 'bg-gray-700/50' : 'bg-gray-600/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isWhiteMove(index) && (
                  <span className="text-sm font-medium text-gray-400 w-8">
                    {formatMoveNumber(index)}.
                  </span>
                )}
                <span className="text-sm font-mono text-white">
                  {move.san}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {TimeUtils.formatTimeMs(move.timeRemaining.white + move.timeRemaining.black)}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};