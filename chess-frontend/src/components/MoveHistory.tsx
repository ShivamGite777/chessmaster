import { motion } from 'framer-motion';
import type { Move } from '../types';

interface MoveHistoryProps {
  moves: Move[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const formatMoveNumber = (index: number): number => {
    return Math.floor(index / 2) + 1;
  };

  const isWhiteMove = (index: number): boolean => {
    return index % 2 === 0;
  };

  return (
    <motion.div
      className="glass-dark rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Move History</h3>
      
      <div className="max-h-64 overflow-y-auto">
        {moves.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">♟️</div>
            <p className="text-gray-400">No moves yet</p>
            <p className="text-gray-500 text-sm">Make the first move to start the game!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {moves.map((move, index) => (
              <motion.div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isWhiteMove(index) ? 'bg-white/5' : 'bg-black/10'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  {isWhiteMove(index) && (
                    <span className="text-gray-400 text-sm font-medium w-8">
                      {formatMoveNumber(index)}.
                    </span>
                  )}
                  <span className={`font-mono text-sm ${
                    isWhiteMove(index) ? 'text-white' : 'text-gray-300'
                  }`}>
                    {move.san}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{move.from}</span>
                  <span>→</span>
                  <span>{move.to}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Move count */}
      {moves.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dark-600">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total moves</span>
            <span className="text-white font-medium">{moves.length}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MoveHistory;