import { motion, AnimatePresence } from 'framer-motion';
import { Game } from '../types';
import { soundManager } from '../utils/sounds';

interface GameOverModalProps {
  game: Game;
  onClose: () => void;
  onRematch: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ game, onClose, onRematch }) => {
  const getResultText = () => {
    if (game.winner === 'draw') return 'Draw!';
    if (game.winner === 'white') return 'White Wins!';
    if (game.winner === 'black') return 'Black Wins!';
    return 'Game Over';
  };

  const getResultIcon = () => {
    if (game.winner === 'draw') return '🤝';
    if (game.winner === 'white') return '🏆';
    if (game.winner === 'black') return '🏆';
    return '🏁';
  };

  const getResultColor = () => {
    if (game.winner === 'draw') return 'text-gray-400';
    if (game.winner === 'white') return 'text-white';
    if (game.winner === 'black') return 'text-black';
    return 'text-gray-400';
  };

  const handleRematch = () => {
    soundManager.playClick();
    onRematch();
  };

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="glass-dark rounded-2xl p-8 w-full max-w-md text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Result Icon */}
          <motion.div
            className="text-8xl mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {getResultIcon()}
          </motion.div>

          {/* Result Text */}
          <motion.h2
            className={`text-3xl font-bold mb-4 ${getResultColor()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getResultText()}
          </motion.h2>

          {/* Game Summary */}
          <motion.div
            className="space-y-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center py-2 border-b border-dark-600">
              <span className="text-gray-400">White Player</span>
              <span className="text-white font-medium">{game.whitePlayer.username}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-600">
              <span className="text-gray-400">Black Player</span>
              <span className="text-white font-medium">{game.blackPlayer.username}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-600">
              <span className="text-gray-400">Total Moves</span>
              <span className="text-white font-medium">{game.moves.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Game Duration</span>
              <span className="text-white font-medium">
                {game.startedAt && game.finishedAt 
                  ? `${Math.floor((new Date(game.finishedAt).getTime() - new Date(game.startedAt).getTime()) / 60000)} min`
                  : 'N/A'
                }
              </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleRematch}
              className="flex-1 btn-primary"
            >
              <span className="mr-2">🔄</span>
              Rematch
            </button>
            <button
              onClick={handleClose}
              className="flex-1 btn-secondary"
            >
              <span className="mr-2">🏠</span>
              Back to Lobby
            </button>
          </motion.div>

          {/* Share Button */}
          <motion.button
            onClick={() => {
              soundManager.playClick();
              navigator.clipboard.writeText(`${window.location.origin}/game/${game.id}`);
              // Show toast notification
            }}
            className="w-full mt-4 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            📤 Share Game
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameOverModal;