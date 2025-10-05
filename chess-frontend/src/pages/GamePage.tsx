import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore, useAuthStore } from '../store';
import { apiClient } from '../utils/api';
import ChessBoard from '../components/ChessBoard';
import GameControls from '../components/GameControls';
import GameInfo from '../components/GameInfo';
import MoveHistory from '../components/MoveHistory';
import ChatPanel from '../components/ChatPanel';
import GameOverModal from '../components/GameOverModal';

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentGame, gameState, setCurrentGame, setGameState } = useGameStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    if (id) {
      loadGame(id);
    }
  }, [id]);

  const loadGame = async (gameId: string) => {
    setIsLoading(true);
    try {
      // Check if this is a demo game
      if (gameId.startsWith('demo-')) {
        // For demo games, use the current game from store or create a demo game
        const demoGame = currentGame || {
          id: gameId,
          whitePlayer: {
            id: 'demo-user',
            username: 'Demo Player',
            email: 'demo@chess.com',
            elo: 1200,
            wins: 15,
            losses: 8,
            draws: 3,
            createdAt: new Date().toISOString()
          },
          blackPlayer: {
            id: 'demo-opponent',
            username: 'Chess Bot',
            email: 'bot@chess.com',
            elo: 1400,
            wins: 30,
            losses: 10,
            draws: 5,
            createdAt: new Date().toISOString()
          },
          status: 'active' as const,
          timeControl: {
            type: 'blitz' as const,
            initialTime: 300,
            increment: 5
          },
          moves: [],
          currentPlayer: 'white' as const,
          createdAt: new Date().toISOString(),
          startedAt: new Date().toISOString()
        };
        
        setCurrentGame(demoGame);
        
        // Initialize game state with starting position
        setGameState({
          fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          moves: [],
          currentPlayer: 'white',
          isCheck: false,
          isCheckmate: false,
          isStalemate: false,
          isDraw: false,
          capturedPieces: { white: [], black: [] },
          timeLeft: { white: demoGame.timeControl.initialTime, black: demoGame.timeControl.initialTime }
        });
      } else {
        // For real games, use API
        const response = await apiClient.getGame(gameId);
        if (response.success && response.data) {
          setCurrentGame(response.data);
          setGameState({
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            moves: [],
            currentPlayer: 'white',
            isCheck: false,
            isCheckmate: false,
            isStalemate: false,
            isDraw: false,
            capturedPieces: { white: [], black: [] },
            timeLeft: { white: response.data.timeControl.initialTime, black: response.data.timeControl.initialTime }
          });
        }
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = (move: any) => {
    // Handle move logic
    console.log('Move made:', move);
  };

  const handleResign = () => {
    // Handle resign logic
    console.log('Player resigned');
  };

  const handleDrawOffer = () => {
    // Handle draw offer logic
    console.log('Draw offered');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Game Not Found</h1>
          <p className="text-gray-400">The game you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  // For demo mode, always allow the current player to move
  const isPlayerTurn = gameState?.currentPlayer === 'white' || gameState?.currentPlayer === 'black';

  return (
    <div className="min-h-screen bg-dark-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-white">Chess Game</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-lg transition-colors ${
                  showChat ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Game Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chess Board */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="glass-dark rounded-xl p-6">
              <ChessBoard
                gameState={gameState}
                onMove={handleMove}
                isPlayerTurn={isPlayerTurn}
                currentGame={currentGame}
              />
            </div>
          </motion.div>

          {/* Game Info and Controls */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Game Info */}
            <GameInfo currentGame={currentGame} gameState={gameState} />

            {/* Game Controls */}
            <GameControls
              onResign={handleResign}
              onDrawOffer={handleDrawOffer}
              isPlayerTurn={isPlayerTurn}
              gameStatus={currentGame.status}
            />

            {/* Move History */}
            <MoveHistory moves={gameState?.moves || []} />
          </motion.div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatPanel gameId={currentGame.id} />
          </motion.div>
        )}

        {/* Game Over Modal */}
        {showGameOver && (
          <GameOverModal
            game={currentGame}
            onClose={() => setShowGameOver(false)}
            onRematch={() => {
              setShowGameOver(false);
              // Handle rematch logic
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GamePage;