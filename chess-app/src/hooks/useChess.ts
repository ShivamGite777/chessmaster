import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import type { PieceColor, Move } from '../types/game.types';
import { ChessUtils } from '../utils/chess.utils';

export const useChess = (initialFen?: string) => {
  const [chess] = useState(() => ChessUtils.initializeGame(initialFen));
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);

  const gameState = useMemo(() => {
    return ChessUtils.getGameState(chess);
  }, [chess]);

  const moveHistory = useMemo(() => {
    return ChessUtils.getMoveHistory(chess);
  }, [chess]);

  const capturedPieces = useMemo(() => {
    return ChessUtils.getCapturedPieces(chess);
  }, [chess]);

  const isGameOver = useMemo(() => {
    return gameState.isCheckmate || gameState.isStalemate || gameState.isDraw;
  }, [gameState]);

  const getLegalMoves = useCallback((square?: string) => {
    const moves = ChessUtils.getLegalMoves(chess, square);
    return moves.map(move => move.to);
  }, [chess]);

  const selectSquare = useCallback((square: string) => {
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    const moves = getLegalMoves(square);
    if (moves.length > 0) {
      setSelectedSquare(square);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [selectedSquare, getLegalMoves]);

  const makeMove = useCallback((from: string, to: string, promotion?: string) => {
    const move = ChessUtils.makeMove(chess, from, to, promotion);
    if (move) {
      setLastMove({
        from: move.from,
        to: move.to,
        piece: move.piece,
        color: move.color === 'w' ? 'white' : 'black',
        promotion: move.promotion,
        san: move.san,
        timestamp: Date.now(),
        timeRemaining: {
          white: 0,
          black: 0,
        },
      });
      setSelectedSquare(null);
      setLegalMoves([]);
      return true;
    }
    return false;
  }, [chess]);

  const isValidMove = useCallback((from: string, to: string, promotion?: string) => {
    return ChessUtils.isValidMove(chess, from, to, promotion);
  }, [chess]);

  const isPromotionMove = useCallback((from: string, to: string) => {
    return ChessUtils.isPromotionMove(chess, from, to);
  }, [chess]);

  const getSquareColor = useCallback((square: string) => {
    return ChessUtils.getSquareColor(square);
  }, []);

  const getPieceSymbol = useCallback((piece: string) => {
    return ChessUtils.getPieceSymbol(piece);
  }, []);

  const reset = useCallback(() => {
    chess.reset();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
  }, [chess]);

  const loadPosition = useCallback((fen: string) => {
    chess.load(fen);
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [chess]);

  const getBoard = useCallback(() => {
    return chess.board();
  }, [chess]);

  const getFen = useCallback(() => {
    return chess.fen();
  }, [chess]);

  const getTurn = useCallback(() => {
    return chess.turn() === 'w' ? 'white' : 'black';
  }, [chess]);

  const isInCheck = useCallback(() => {
    return chess.isCheck();
  }, [chess]);

  const isInCheckmate = useCallback(() => {
    return chess.isCheckmate();
  }, [chess]);

  const isInStalemate = useCallback(() => {
    return chess.isStalemate();
  }, [chess]);

  const isDraw = useCallback(() => {
    return chess.isDraw();
  }, [chess]);

  const analyzePosition = useCallback(() => {
    return ChessUtils.analyzePosition(chess);
  }, [chess]);

  return {
    chess,
    gameState,
    moveHistory,
    capturedPieces,
    isGameOver,
    selectedSquare,
    legalMoves,
    lastMove,
    getLegalMoves,
    selectSquare,
    makeMove,
    isValidMove,
    isPromotionMove,
    getSquareColor,
    getPieceSymbol,
    reset,
    loadPosition,
    getBoard,
    getFen,
    getTurn,
    isInCheck,
    isInCheckmate,
    isInStalemate,
    isDraw,
    analyzePosition,
  };
};