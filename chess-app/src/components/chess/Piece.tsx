import React from 'react';
import { motion } from 'framer-motion';
import { ChessUtils } from '../../utils/chess.utils';

interface PieceProps {
  piece: {
    type: string;
    color: string;
  };
  square: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrop?: (to: string) => void;
  className?: string;
}

export const Piece: React.FC<PieceProps> = ({
  piece,
  square,
  onDragStart,
  onDragEnd,
  onDrop,
  className = '',
}) => {
  const symbol = ChessUtils.getPieceSymbol(piece.type);
  const pieceName = ChessUtils.getPieceName(piece.type);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', square);
    onDragStart?.();
  };

  const handleDragEnd = (e: React.DragEvent) => {
    onDragEnd?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromSquare = e.dataTransfer.getData('text/plain');
    if (fromSquare !== square) {
      onDrop?.(square);
    }
  };

  return (
    <motion.div
      className={`select-none cursor-grab active:cursor-grabbing ${className}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.1 }}
      title={`${piece.color} ${pieceName}`}
    >
      <span className="text-4xl font-bold drop-shadow-lg">
        {symbol}
      </span>
    </motion.div>
  );
};