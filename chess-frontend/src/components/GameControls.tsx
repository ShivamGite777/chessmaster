import { motion } from 'framer-motion';
import { soundManager } from '../utils/sounds';

interface GameControlsProps {
  onResign: () => void;
  onDrawOffer: () => void;
  isPlayerTurn: boolean;
  gameStatus: string;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  onResign, 
  onDrawOffer, 
  isPlayerTurn, 
  gameStatus 
}) => {
  const handleResign = () => {
    soundManager.playClick();
    if (window.confirm('Are you sure you want to resign? This action cannot be undone.')) {
      onResign();
    }
  };

  const handleDrawOffer = () => {
    soundManager.playClick();
    onDrawOffer();
  };

  return (
    <motion.div
      className="glass-dark rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Game Controls</h3>
      
      <div className="space-y-3">
        <button
          onClick={handleDrawOffer}
          disabled={gameStatus !== 'active'}
          className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-2">🤝</span>
          Offer Draw
        </button>
        
        <button
          onClick={handleResign}
          disabled={gameStatus !== 'active'}
          className="w-full btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-2">🏳️</span>
          Resign Game
        </button>
      </div>

      {/* Turn indicator */}
      <div className="mt-6 pt-4 border-t border-dark-600">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Your turn</span>
          <div className={`flex items-center space-x-2 ${
            isPlayerTurn ? 'text-success' : 'text-gray-400'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isPlayerTurn ? 'bg-success animate-pulse' : 'bg-gray-400'
            }`} />
            <span className="text-sm font-medium">
              {isPlayerTurn ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Game status */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Game status</span>
          <span className={`text-sm font-medium ${
            gameStatus === 'active' ? 'text-success' :
            gameStatus === 'waiting' ? 'text-primary-400' : 'text-gray-400'
          }`}>
            {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default GameControls;