import React from 'react';
import { motion } from 'framer-motion';
import { ChessUtils } from '../../utils/chess.utils';

interface CapturedPiecesProps {
  pieces: {
    white: string[];
    black: string[];
  };
  className?: string;
}

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, className = '' }) => {
  const getPieceValue = (piece: string) => {
    const values: { [key: string]: number } = {
      'P': 1, 'N': 3, 'B': 3, 'R': 5, 'Q': 9,
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9,
    };
    return values[piece] || 0;
  };

  const sortPieces = (pieceList: string[]) => {
    return pieceList.sort((a, b) => getPieceValue(b) - getPieceValue(a));
  };

  const renderPieces = (pieceList: string[], color: 'white' | 'black') => {
    const sortedPieces = sortPieces(pieceList);
    const pieceCounts: { [key: string]: number } = {};
    
    sortedPieces.forEach(piece => {
      pieceCounts[piece] = (pieceCounts[piece] || 0) + 1;
    });

    return Object.entries(pieceCounts).map(([piece, count], index) => (
      <motion.div
        key={`${color}-${piece}-${index}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="flex items-center space-x-1"
      >
        <span className={`text-2xl ${color === 'white' ? 'text-white' : 'text-gray-300'}`}>
          {ChessUtils.getPieceSymbol(piece)}
        </span>
        {count > 1 && (
          <span className="text-sm text-gray-400">×{count}</span>
        )}
      </motion.div>
    ));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* White captured pieces */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">White captured</h4>
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {pieces.white.length === 0 ? (
            <span className="text-gray-500 text-sm">None</span>
          ) : (
            renderPieces(pieces.white, 'white')
          )}
        </div>
      </div>

      {/* Black captured pieces */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-2">Black captured</h4>
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {pieces.black.length === 0 ? (
            <span className="text-gray-500 text-sm">None</span>
          ) : (
            renderPieces(pieces.black, 'black')
          )}
        </div>
      </div>
    </div>
  );
};