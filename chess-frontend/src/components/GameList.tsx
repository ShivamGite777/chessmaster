import { motion } from 'framer-motion';
import { Game } from '../types';
import { formatTime } from '../utils/chess';
import { soundManager } from '../utils/sounds';

interface GameListProps {
  games: Game[];
  isLoading: boolean;
}

const GameList: React.FC<GameListProps> = ({ games, isLoading }) => {
  const handleJoinGame = (gameId: string) => {
    soundManager.playClick();
    // Navigate to game page
    window.location.href = `/game/${gameId}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 bg-dark-600 rounded w-32"></div>
                  <div className="h-3 bg-dark-600 rounded w-24"></div>
                </div>
                <div className="h-8 bg-dark-600 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-6xl mb-4">♟️</div>
        <h3 className="text-xl font-semibold text-white mb-2">No Games Available</h3>
        <p className="text-gray-400">
          Be the first to create a game and start playing!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game, index) => (
        <motion.div
          key={game.id}
          className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-dark-900 font-bold text-sm">
                      {game.whitePlayer.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    {game.whitePlayer.username}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({game.whitePlayer.elo})
                  </span>
                </div>
                
                <span className="text-gray-400">vs</span>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {game.blackPlayer.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white font-medium">
                    {game.blackPlayer.username}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({game.blackPlayer.elo})
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span>
                  {formatTime(game.timeControl.initialTime)}
                  {game.timeControl.increment > 0 && ` + ${game.timeControl.increment}s`}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🎯</span>
                  {game.timeControl.type}
                </span>
                <span className={`flex items-center ${
                  game.status === 'active' ? 'text-success' :
                  game.status === 'waiting' ? 'text-primary-400' : 'text-gray-400'
                }`}>
                  <span className="mr-1">●</span>
                  {game.status}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => handleJoinGame(game.id)}
              className="btn-primary px-4 py-2 text-sm"
              disabled={game.status !== 'waiting'}
            >
              {game.status === 'waiting' ? 'Join' : 'Spectate'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GameList;