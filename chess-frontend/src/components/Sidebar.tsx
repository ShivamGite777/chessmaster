import { motion } from 'framer-motion';
import { useGameStore, useAuthStore } from '../store';
import { formatTime } from '../utils/chess';

const Sidebar: React.FC = () => {
  const { availableGames, currentGame } = useGameStore();
  const { user } = useAuthStore();

  return (
    <div className="h-full bg-dark-800 border-r border-dark-700 overflow-y-auto">
      <div className="p-4">
        {/* User Stats */}
        <motion.div
          className="glass-dark rounded-lg p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-white font-semibold mb-3">Your Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ELO Rating</span>
              <span className="text-primary-400 font-medium">{user?.elo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Games Played</span>
              <span className="text-white">{(user?.wins || 0) + (user?.losses || 0) + (user?.draws || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Win Rate</span>
              <span className="text-success">
                {user ? Math.round(((user.wins || 0) / ((user.wins || 0) + (user.losses || 0) + (user.draws || 0))) * 100) || 0 : 0}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Current Game */}
        {currentGame && (
          <motion.div
            className="glass-dark rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold mb-3">Current Game</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-400">vs </span>
                <span className="text-white">
                  {currentGame.whitePlayer.id === user?.id 
                    ? currentGame.blackPlayer.username 
                    : currentGame.whitePlayer.username}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Time: </span>
                <span className="text-white">
                  {formatTime(currentGame.timeControl.initialTime)}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Status: </span>
                <span className={`${
                  currentGame.status === 'active' ? 'text-success' : 
                  currentGame.status === 'waiting' ? 'text-primary-400' : 'text-gray-400'
                }`}>
                  {currentGame.status}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Available Games */}
        <motion.div
          className="glass-dark rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-white font-semibold mb-3">Available Games</h3>
          <div className="space-y-3">
            {availableGames.length === 0 ? (
              <p className="text-gray-400 text-sm">No games available</p>
            ) : (
              availableGames.slice(0, 5).map((game) => (
                <motion.div
                  key={game.id}
                  className="bg-dark-700 rounded-lg p-3 cursor-pointer hover:bg-dark-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm">
                      <span className="text-white font-medium">
                        {game.whitePlayer.username}
                      </span>
                      <span className="text-gray-400 mx-1">vs</span>
                      <span className="text-white font-medium">
                        {game.blackPlayer.username}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatTime(game.timeControl.initialTime)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {game.timeControl.type} • {game.timeControl.increment}s increment
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;