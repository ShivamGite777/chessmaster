import { Chess } from 'chess.js';
import { Move, GameState } from '../types';

export class ChessGame {
  private chess: Chess;

  constructor(fen?: string) {
    this.chess = new Chess(fen);
  }

  getFen(): string {
    return this.chess.fen();
  }

  getPgn(): string {
    return this.chess.pgn();
  }

  getMoves(): Move[] {
    return this.chess.history({ verbose: true }).map((move, index) => ({
      from: move.from,
      to: move.to,
      piece: move.piece,
      captured: move.captured,
      promotion: move.promotion,
      san: move.san,
      timestamp: Date.now() - (this.chess.history().length - index) * 1000,
      timeLeft: { white: 0, black: 0 }, // This would be managed by the game state
    }));
  }

  getValidMoves(square?: string): any[] {
    if (square) {
      return this.chess.moves({ square, verbose: true });
    }
    return this.chess.moves({ verbose: true });
  }

  makeMove(move: { from: string; to: string; promotion?: string }): boolean {
    try {
      const result = this.chess.move(move);
      return !!result;
    } catch (error) {
      return false;
    }
  }

  isGameOver(): boolean {
    return this.chess.isGameOver();
  }

  isCheck(): boolean {
    return this.chess.isCheck();
  }

  isCheckmate(): boolean {
    return this.chess.isCheckmate();
  }

  isStalemate(): boolean {
    return this.chess.isStalemate();
  }

  isDraw(): boolean {
    return this.chess.isDraw();
  }

  isInsufficientMaterial(): boolean {
    return this.chess.isInsufficientMaterial();
  }

  isThreefoldRepetition(): boolean {
    return this.chess.isThreefoldRepetition();
  }

  turn(): 'w' | 'b' {
    return this.chess.turn();
  }

  getCurrentPlayer(): 'white' | 'black' {
    return this.turn() === 'w' ? 'white' : 'black';
  }

  getCapturedPieces(): { white: string[]; black: string[] } {
    const captured = { white: [], black: [] };
    
    // This is a simplified version - in a real implementation,
    // you'd track captured pieces throughout the game
    const moves = this.chess.history({ verbose: true });
    moves.forEach(move => {
      if (move.captured) {
        const piece = move.captured.toUpperCase();
        if (move.color === 'w') {
          captured.black.push(piece);
        } else {
          captured.white.push(piece);
        }
      }
    });

    return captured;
  }

  getGameState(): GameState {
    return {
      fen: this.getFen(),
      moves: this.getMoves(),
      currentPlayer: this.getCurrentPlayer(),
      isCheck: this.isCheck(),
      isCheckmate: this.isCheckmate(),
      isStalemate: this.isStalemate(),
      isDraw: this.isDraw(),
      capturedPieces: this.getCapturedPieces(),
      timeLeft: { white: 0, black: 0 }, // This would be managed by the game state
    };
  }

  reset(): void {
    this.chess.reset();
  }

  load(fen: string): void {
    this.chess.load(fen);
  }

  loadPgn(pgn: string): void {
    this.chess.loadPgn(pgn);
  }
}

export const getSquareColor = (square: string): 'light' | 'dark' => {
  const file = square.charCodeAt(0) - 97; // a = 0, b = 1, etc.
  const rank = parseInt(square[1]) - 1;
  return (file + rank) % 2 === 0 ? 'light' : 'dark';
};

export const getSquareCoordinates = (square: string): { x: number; y: number } => {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  return { x: file, y: 7 - rank }; // Flip rank for display
};

export const getSquareFromCoordinates = (x: number, y: number): string => {
  const file = String.fromCharCode(97 + x);
  const rank = 8 - y;
  return `${file}${rank}`;
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getTimeControlDisplay = (timeControl: { type: string; initialTime: number; increment: number }): string => {
  const minutes = Math.floor(timeControl.initialTime / 60);
  const increment = timeControl.increment;
  
  if (increment > 0) {
    return `${minutes}+${increment}`;
  }
  return `${minutes}`;
};

export const getPieceSymbol = (piece: string): string => {
  const symbols: { [key: string]: string } = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  };
  return symbols[piece] || piece;
};

export const getPieceName = (piece: string): string => {
  const names: { [key: string]: string } = {
    'K': 'King', 'Q': 'Queen', 'R': 'Rook', 'B': 'Bishop', 'N': 'Knight', 'P': 'Pawn',
    'k': 'King', 'q': 'Queen', 'r': 'Rook', 'b': 'Bishop', 'n': 'Knight', 'p': 'Pawn'
  };
  return names[piece] || piece;
};