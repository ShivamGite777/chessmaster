import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Game, GameState } from '../types';
import { ChessGame, getSquareColor, getSquareCoordinates } from '../utils/chess';
import { soundManager } from '../utils/sounds';

interface ChessBoardProps {
  gameState: GameState | null;
  onMove: (move: any) => void;
  isPlayerTurn: boolean;
  currentGame: Game;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ gameState, onMove, isPlayerTurn, currentGame }) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [_dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const chess = new ChessGame(gameState?.fen);

  const getPieceSymbol = (piece: string): string => {
    const symbols: { [key: string]: string } = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };
    return symbols[piece] || '';
  };

  const getPieceColor = (piece: string): 'white' | 'black' => {
    return piece === piece.toUpperCase() ? 'white' : 'black';
  };

  const handleSquareClick = useCallback((square: string) => {
    if (!isPlayerTurn || currentGame.status !== 'active') return;

    soundManager.playClick();

    if (selectedSquare === square) {
      // Deselect if clicking the same square
      setSelectedSquare(null);
      setValidMoves([]);
      return;
    }

    if (selectedSquare) {
      // Try to make a move
      const move = { from: selectedSquare, to: square };
      if (chess.makeMove(move)) {
        onMove(move);
        setSelectedSquare(null);
        setValidMoves([]);
        soundManager.playMove();
      } else {
        // Invalid move, select new square
        setSelectedSquare(square);
        setValidMoves(chess.getValidMoves(square).map(m => m.to));
      }
    } else {
      // Select square
      const moves = chess.getValidMoves(square);
      if (moves.length > 0) {
        setSelectedSquare(square);
        setValidMoves(moves.map(m => m.to));
      }
    }
  }, [selectedSquare, isPlayerTurn, currentGame.status, chess, onMove]);

  const handleSquareHover = (_square: string) => {
    if (draggedPiece) {
      // Handle drag hover
    }
  };

  const handleDragStart = (e: React.DragEvent, square: string) => {
    if (!isPlayerTurn || currentGame.status !== 'active') return;
    
    const piece = chess.getFen().split(' ')[0].split('/').join('').split('').find(p => p !== '1' && p !== '2' && p !== '3' && p !== '4' && p !== '5' && p !== '6' && p !== '7' && p !== '8');
    if (piece) {
      setDraggedPiece(square);
      setValidMoves(chess.getValidMoves(square).map(m => m.to));
      
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleDragEnd = (_e: React.DragEvent, square: string) => {
    if (draggedPiece && validMoves.includes(square)) {
      const move = { from: draggedPiece, to: square };
      if (chess.makeMove(move)) {
        onMove(move);
        soundManager.playMove();
      }
    }
    
    setDraggedPiece(null);
    setValidMoves([]);
    setSelectedSquare(null);
  };

  const renderSquare = (square: string, piece: string | null) => {
    const isSelected = selectedSquare === square;
    const isValidMove = validMoves.includes(square);
    const isLastMove = gameState?.moves.length && 
      (gameState.moves[gameState.moves.length - 1].from === square || 
       gameState.moves[gameState.moves.length - 1].to === square);
    const isCheck = gameState?.isCheck && piece === (gameState.currentPlayer === 'white' ? 'K' : 'k');
    const squareColor = getSquareColor(square);
    const coordinates = getSquareCoordinates(square);

    return (
      <motion.div
        key={square}
        className={`
          relative w-full h-full flex items-center justify-center cursor-pointer
          ${squareColor === 'light' ? 'chess-square-light' : 'chess-square-dark'}
          ${isSelected ? 'chess-square-highlight' : ''}
          ${isValidMove ? 'chess-square-highlight' : ''}
          ${isLastMove ? 'chess-square-last-move' : ''}
          ${isCheck ? 'chess-square-check' : ''}
        `}
        onClick={() => handleSquareClick(square)}
        onMouseEnter={() => handleSquareHover(square)}
        onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, square)}
        onDragEnd={(e) => handleDragEnd(e as unknown as React.DragEvent, square)}
        draggable={!!piece && isPlayerTurn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Piece */}
        {piece && (
          <motion.div
            className="text-4xl md:text-5xl select-none"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              color: getPieceColor(piece) === 'white' ? '#ffffff' : '#000000',
              textShadow: getPieceColor(piece) === 'white' ? '2px 2px 4px rgba(0,0,0,0.8)' : '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            {getPieceSymbol(piece)}
          </motion.div>
        )}

        {/* Valid move indicator */}
        {isValidMove && !piece && (
          <motion.div
            className="w-3 h-3 bg-primary-500 rounded-full opacity-70"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Valid capture indicator */}
        {isValidMove && piece && (
          <motion.div
            className="absolute inset-0 border-4 border-danger rounded opacity-70"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Square coordinates */}
        {(coordinates.x === 0 || coordinates.y === 7) && (
          <div className="absolute bottom-1 right-1 text-xs text-gray-600 font-medium">
            {square}
          </div>
        )}
      </motion.div>
    );
  };

  const renderBoard = () => {
    const squares = [];
    const fen = chess.getFen().split(' ')[0];
    const board = fen.split('/').map(row => {
      const expanded = [];
      for (const char of row) {
        if (isNaN(parseInt(char))) {
          expanded.push(char);
        } else {
          expanded.push(...Array(parseInt(char)).fill(null));
        }
      }
      return expanded;
    });

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const square = String.fromCharCode(97 + file) + (8 - rank);
        const piece = board[rank][file];
        squares.push(renderSquare(square, piece));
      }
    }

    return squares;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Board */}
      <div className="relative">
        <div className="grid grid-cols-8 aspect-square border-2 border-dark-600 rounded-lg overflow-hidden">
          {renderBoard()}
        </div>

        {/* Turn indicator */}
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            gameState?.currentPlayer === 'white' 
              ? 'bg-white text-black' 
              : 'bg-black text-white'
          }`}>
            {gameState?.currentPlayer === 'white' ? 'White to move' : 'Black to move'}
          </div>
        </motion.div>

        {/* Flip board button */}
        <button
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 btn-secondary text-sm px-3 py-1"
          onClick={() => soundManager.playClick()}
        >
          Flip Board
        </button>
      </div>

      {/* Captured pieces */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="glass-dark rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Captured by White</h3>
          <div className="flex flex-wrap gap-1">
            {gameState?.capturedPieces.white.map((piece, index) => (
              <span key={index} className="text-2xl text-white">
                {getPieceSymbol(piece)}
              </span>
            ))}
          </div>
        </div>
        <div className="glass-dark rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Captured by Black</h3>
          <div className="flex flex-wrap gap-1">
            {gameState?.capturedPieces.black.map((piece, index) => (
              <span key={index} className="text-2xl text-white">
                {getPieceSymbol(piece)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;