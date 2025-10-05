import { motion } from 'framer-motion';
import type { Game, GameState } from '../types';
import { formatTime } from '../utils/chess';

interface GameInfoProps {
  currentGame: Game;
  gameState: GameState | null;
}

const GameInfo: React.FC<GameInfoProps> = ({ currentGame, gameState }) => {

  return (
    <motion.div
      className="glass-dark rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Game Information</h3>
      
      <div className="space-y-4">
        {/* Players */}
        <div className="space-y-3">
          {/* White Player */}
          <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold">
                  {currentGame.whitePlayer.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-white font-medium">{currentGame.whitePlayer.username}</div>
                <div className="text-gray-400 text-sm">ELO: {currentGame.whitePlayer.elo}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">
                {formatTime(gameState?.timeLeft.white || currentGame.timeControl.initialTime)}
              </div>
              <div className="text-gray-400 text-sm">Time Left</div>
            </div>
          </div>

          {/* Black Player */}
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {currentGame.blackPlayer.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-white font-medium">{currentGame.blackPlayer.username}</div>
                <div className="text-gray-400 text-sm">ELO: {currentGame.blackPlayer.elo}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-lg">
                {formatTime(gameState?.timeLeft.black || currentGame.timeControl.initialTime)}
              </div>
              <div className="text-gray-400 text-sm">Time Left</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="pt-4 border-t border-dark-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Status</span>
            <span className={`font-medium ${
              currentGame.status === 'active' ? 'text-success' :
              currentGame.status === 'waiting' ? 'text-primary-400' : 'text-gray-400'
            }`}>
              {currentGame.status.charAt(0).toUpperCase() + currentGame.status.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Time Control</span>
            <span className="text-white font-medium">
              {formatTime(currentGame.timeControl.initialTime)}
              {currentGame.timeControl.increment > 0 && ` + ${currentGame.timeControl.increment}s`}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Game Type</span>
            <span className="text-white font-medium capitalize">
              {currentGame.timeControl.type}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Moves</span>
            <span className="text-white font-medium">
              {gameState?.moves.length || 0}
            </span>
          </div>
        </div>

        {/* Game State Indicators */}
        {gameState && (
          <div className="pt-4 border-t border-dark-600">
            {gameState.isCheck && (
              <motion.div
                className="flex items-center space-x-2 text-danger mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>⚠️</span>
                <span className="font-medium">Check!</span>
              </motion.div>
            )}
            
            {gameState.isCheckmate && (
              <motion.div
                className="flex items-center space-x-2 text-danger mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>🏁</span>
                <span className="font-medium">Checkmate!</span>
              </motion.div>
            )}
            
            {gameState.isStalemate && (
              <motion.div
                className="flex items-center space-x-2 text-gray-400 mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>🤝</span>
                <span className="font-medium">Stalemate</span>
              </motion.div>
            )}
            
            {gameState.isDraw && (
              <motion.div
                className="flex items-center space-x-2 text-gray-400 mb-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span>🤝</span>
                <span className="font-medium">Draw</span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GameInfo;