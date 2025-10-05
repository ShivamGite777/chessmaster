import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface GameResult {
  type: 'checkmate' | 'stalemate' | 'draw' | 'resignation' | 'timeout';
  winner?: 'white' | 'black';
}

interface GameResultModalProps {
  result: GameResult;
  onClose: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  result,
  onClose,
}) => {
  const getResultTitle = () => {
    switch (result.type) {
      case 'checkmate':
        return `Checkmate! ${result.winner === 'white' ? 'White' : 'Black'} wins!`;
      case 'stalemate':
        return 'Stalemate - Draw!';
      case 'draw':
        return 'Draw!';
      case 'resignation':
        return `${result.winner === 'white' ? 'White' : 'Black'} resigned`;
      case 'timeout':
        return `${result.winner === 'white' ? 'White' : 'Black'} wins on time`;
      default:
        return 'Game Over';
    }
  };

  const getResultDescription = () => {
    switch (result.type) {
      case 'checkmate':
        return 'The king is in check and cannot escape.';
      case 'stalemate':
        return 'The player to move has no legal moves but is not in check.';
      case 'draw':
        return 'The game ended in a draw.';
      case 'resignation':
        return 'The opponent resigned from the game.';
      case 'timeout':
        return 'The opponent ran out of time.';
      default:
        return '';
    }
  };

  const getResultColor = () => {
    if (result.type === 'checkmate' || result.type === 'resignation' || result.type === 'timeout') {
      return 'text-green-400';
    } else if (result.type === 'stalemate' || result.type === 'draw') {
      return 'text-yellow-400';
    }
    return 'text-white';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full max-w-md bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className={`text-2xl font-bold ${getResultColor()}`}>
                {getResultTitle()}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {getResultDescription()}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">
                  {result.type === 'checkmate' && '♔'}
                  {result.type === 'stalemate' && '⚖️'}
                  {result.type === 'draw' && '🤝'}
                  {result.type === 'resignation' && '🏳️'}
                  {result.type === 'timeout' && '⏰'}
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Implement rematch functionality
                    console.log('Rematch requested');
                  }}
                  variant="outline"
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                >
                  Request Rematch
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};