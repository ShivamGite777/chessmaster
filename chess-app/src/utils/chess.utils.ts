import { Chess } from 'chess.js';

export const TIME_CONTROLS = {
  blitz: [
    { type: 'blitz' as const, initial: 3, increment: 0, label: '3+0' },
    { type: 'blitz' as const, initial: 5, increment: 0, label: '5+0' },
  ],
  rapid: [
    { type: 'rapid' as const, initial: 10, increment: 0, label: '10+0' },
    { type: 'rapid' as const, initial: 15, increment: 10, label: '15+10' },
  ],
  classical: [
    { type: 'classical' as const, initial: 30, increment: 0, label: '30+0' },
    { type: 'classical' as const, initial: 60, increment: 0, label: '60+0' },
  ],
};

export const getTimeControlLabel = (timeControl: { initial: number; increment: number }) => {
  return `${timeControl.initial}+${timeControl.increment}`;
};

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}`;
};

export const formatTimeWithHours = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getSquareColor = (square: string): 'light' | 'dark' => {
  const file = square.charCodeAt(0) - 97; // a = 0, b = 1, etc.
  const rank = parseInt(square[1]) - 1; // 1 = 0, 2 = 1, etc.
  return (file + rank) % 2 === 0 ? 'light' : 'dark';
};

export const getSquareFromPosition = (file: number, rank: number): string => {
  return String.fromCharCode(97 + file) + (rank + 1).toString();
};

export const getPositionFromSquare = (square: string): { file: number; rank: number } => {
  return {
    file: square.charCodeAt(0) - 97,
    rank: parseInt(square[1]) - 1,
  };
};

export const isPromotionMove = (from: string, to: string, piece: string): boolean => {
  if (piece.toLowerCase() !== 'p') return false;
  
  const fromRank = parseInt(from[1]);
  const toRank = parseInt(to[1]);
  
  // White pawn moving to 8th rank or black pawn moving to 1st rank
  return (piece === 'P' && toRank === 8) || (piece === 'p' && toRank === 1);
};

export const getPromotionPieces = (color: 'white' | 'black'): string[] => {
  return color === 'white' ? ['Q', 'R', 'B', 'N'] : ['q', 'r', 'b', 'n'];
};

export const getPieceSymbol = (piece: string): string => {
  const symbols: Record<string, string> = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
  };
  return symbols[piece] || piece;
};

export const getCapturedPieces = (moves: any[]): { white: string[]; black: string[] } => {
  const captured: { white: string[]; black: string[] } = { white: [], black: [] };
  
  moves.forEach(move => {
    if (move.captured) {
      const piece = move.captured;
      if (piece === piece.toUpperCase()) {
        captured.black.push(piece);
      } else {
        captured.white.push(piece);
      }
    }
  });
  
  return captured;
};

export const validateMove = (chess: Chess, from: string, to: string, promotion?: string): boolean => {
  try {
    const move = chess.move({
      from,
      to,
      promotion: promotion || undefined,
    });
    return !!move;
  } catch {
    return false;
  }
};

export const getLegalMoves = (chess: Chess, square: string): string[] => {
  return chess.moves({ square, verbose: true }).map(move => move.to);
};

export const isCheck = (chess: Chess): boolean => {
  return chess.isCheck();
};

export const isCheckmate = (chess: Chess): boolean => {
  return chess.isCheckmate();
};

export const isStalemate = (chess: Chess): boolean => {
  return chess.isStalemate();
};

export const isDraw = (chess: Chess): boolean => {
  return chess.isDraw();
};

export const getGameResult = (chess: Chess, resignedBy?: string): string | null => {
  if (resignedBy) {
    return resignedBy === 'white' ? 'black_wins' : 'white_wins';
  }
  
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? 'black_wins' : 'white_wins';
  }
  
  if (chess.isDraw()) {
    return 'draw';
  }
  
  return null;
};