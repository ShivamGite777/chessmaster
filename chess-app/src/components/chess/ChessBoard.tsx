import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useChess } from '../../hooks/useChess';
import type { PieceColor } from '../../types/game.types';
import { ChessUtils } from '../../utils/chess.utils';
import { Square } from './Square';
import { Piece } from './Piece';

interface ChessBoardProps {
  fen?: string;
  onMove?: (from: string, to: string, promotion?: string) => void;
  onSquareClick?: (square: string) => void;
  onPieceDrop?: (from: string, to: string) => void;
  orientation?: PieceColor;
  showCoordinates?: boolean;
  showLegalMoves?: boolean;
  highlightLastMove?: boolean;
  lastMove?: { from: string; to: string };
  isInteractive?: boolean;
  className?: string;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  onMove,
  onSquareClick,
  onPieceDrop,
  orientation = 'white',
  showCoordinates = true,
  showLegalMoves = true,
  highlightLastMove = true,
  lastMove,
  isInteractive = true,
  className = '',
}) => {
  const {
    gameState,
    selectedSquare,
    legalMoves,
    selectSquare,
    makeMove,
    isValidMove,
    isPromotionMove,
    getSquareColor,
    getBoard,
  } = useChess(fen);

  const board = useMemo(() => getBoard(), [getBoard]);

  const handleSquareClick = useCallback((square: string) => {
    if (!isInteractive) return;

    if (selectedSquare) {
      if (selectedSquare === square) {
        selectSquare('');
        return;
      }

      if (legalMoves.includes(square)) {
        const promotion = isPromotionMove(selectedSquare, square) ? 'q' : undefined;
        const success = makeMove(selectedSquare, square, promotion);
        
        if (success) {
          onMove?.(selectedSquare, square, promotion);
          selectSquare('');
        }
      } else {
        selectSquare(square);
      }
    } else {
      selectSquare(square);
    }

    onSquareClick?.(square);
  }, [selectedSquare, legalMoves, isInteractive, selectSquare, makeMove, isPromotionMove, onMove, onSquareClick]);

  const handlePieceDrop = useCallback((from: string, to: string) => {
    if (!isInteractive) return;

    if (isValidMove(from, to)) {
      const promotion = isPromotionMove(from, to) ? 'q' : undefined;
      const success = makeMove(from, to, promotion);
      
      if (success) {
        onMove?.(from, to, promotion);
        onPieceDrop?.(from, to);
      }
    }
  }, [isInteractive, isValidMove, isPromotionMove, makeMove, onMove, onPieceDrop]);

  const getSquareProps = useCallback((square: string) => {
    const isSelected = selectedSquare === square;
    const isLegalMove = legalMoves.includes(square);
    const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
    const isCheck = gameState.isCheck && board[7 - (parseInt(square[1]) - 1)][square.charCodeAt(0) - 97]?.type === 'k';
    
    return {
      isSelected,
      isLegalMove,
      isLastMove,
      isCheck,
      isInteractive,
    };
  }, [selectedSquare, legalMoves, lastMove, gameState.isCheck, board, isInteractive]);

  const renderSquare = useCallback((file: number, rank: number) => {
    const square = ChessUtils.getSquareFromPosition(file, rank);
    const piece = board[rank][file];
    const squareColor = getSquareColor(square);
    const squareProps = getSquareProps(square);

    return (
      <Square
        key={square}
        square={square}
        color={squareColor}
        onClick={() => handleSquareClick(square)}
        {...squareProps}
      >
        {piece && (
          <Piece
            piece={piece}
            square={square}
            onDragStart={() => {}}
            onDragEnd={() => {}}
            onDrop={(to) => handlePieceDrop(square, to)}
          />
        )}
      </Square>
    );
  }, [board, getSquareColor, getSquareProps, handleSquareClick, handlePieceDrop]);

  const renderCoordinates = useCallback(() => {
    if (!showCoordinates) return null;

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    return (
      <>
        {/* File coordinates */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
          {files.map(file => (
            <span key={file} className="text-xs text-gray-400 font-medium">
              {file}
            </span>
          ))}
        </div>
        
        {/* Rank coordinates */}
        <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-2">
          {ranks.map(rank => (
            <span key={rank} className="text-xs text-gray-400 font-medium">
              {rank}
            </span>
          ))}
        </div>
      </>
    );
  }, [showCoordinates]);

  const boardSquares = useMemo(() => {
    const squares = [];
    
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        squares.push(renderSquare(file, rank));
      }
    }
    
    return squares;
  }, [renderSquare]);

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        className="relative grid grid-cols-8 grid-rows-8 border-2 border-gray-600 shadow-lg"
        style={{ aspectRatio: '1/1' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {boardSquares}
        {renderCoordinates()}
      </motion.div>
    </div>
  );
};