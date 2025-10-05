import { Chess } from 'chess.js';
import type { PieceColor, Move } from '../types/game.types';

export class ChessUtils {
  private static chess = new Chess();

  static initializeGame(fen?: string): Chess {
    const chess = new Chess();
    if (fen) {
      chess.load(fen);
    }
    return chess;
  }

  static getLegalMoves(chess: Chess, square?: string): any[] {
    if (square) {
      return chess.moves({ square: square as any, verbose: true });
    }
    return chess.moves({ verbose: true });
  }

  static isValidMove(chess: Chess, from: string, to: string, promotion?: string): boolean {
    try {
      const move = chess.move({
        from,
        to,
        promotion: promotion || 'q',
      });
      return !!move;
    } catch {
      return false;
    }
  }

  static makeMove(chess: Chess, from: string, to: string, promotion?: string): any | null {
    try {
      return chess.move({
        from,
        to,
        promotion: promotion || 'q',
      });
    } catch {
      return null;
    }
  }

  static getGameState(chess: Chess): {
    fen: string;
    turn: PieceColor;
    isCheck: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    isDraw: boolean;
    inCheck: boolean;
  } {
    return {
      fen: chess.fen(),
      turn: chess.turn() === 'w' ? 'white' : 'black',
      isCheck: chess.isCheck(),
      isCheckmate: chess.isCheckmate(),
      isStalemate: chess.isStalemate(),
      isDraw: chess.isDraw(),
      inCheck: chess.isCheck(),
    };
  }

  static getCapturedPieces(chess: Chess): { white: string[]; black: string[] } {
    const history = chess.history({ verbose: true });
    const captured: { white: string[]; black: string[] } = { white: [], black: [] };

    history.forEach((move: any) => {
      if (move.captured) {
        const piece = move.captured.toUpperCase();
        if (move.color === 'w') {
          captured.white.push(piece);
        } else {
          captured.black.push(piece);
        }
      }
    });

    return captured;
  }

  static getMoveHistory(chess: Chess): Move[] {
    const history = chess.history({ verbose: true });
    return history.map((move: any, index: number) => ({
      from: move.from,
      to: move.to,
      piece: move.piece,
      color: move.color === 'w' ? 'white' : 'black',
      promotion: move.promotion,
      san: move.san,
      timestamp: Date.now() - (history.length - index) * 1000, // Mock timestamp
      timeRemaining: {
        white: 0, // Will be updated by timer
        black: 0,
      },
    }));
  }

  static getSquareColor(square: string): 'light' | 'dark' {
    const file = square.charCodeAt(0) - 97; // a = 0, b = 1, etc.
    const rank = parseInt(square[1]) - 1; // 1 = 0, 2 = 1, etc.
    return (file + rank) % 2 === 0 ? 'light' : 'dark';
  }

  static getSquareFromPosition(file: number, rank: number): string {
    const fileChar = String.fromCharCode(97 + file); // a, b, c, etc.
    return `${fileChar}${rank + 1}` as any;
  }

  static getPositionFromSquare(square: string): { file: number; rank: number } {
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]) - 1;
    return { file, rank };
  }

  static isPromotionMove(chess: Chess, from: string, to: string): boolean {
    const piece = chess.get(from);
    if (!piece || piece.type !== 'p') return false;

    const { rank: fromRank } = this.getPositionFromSquare(from);
    const { rank: toRank } = this.getPositionFromSquare(to);

    return (piece.color === 'w' && fromRank === 6 && toRank === 7) ||
           (piece.color === 'b' && fromRank === 1 && toRank === 0);
  }

  static getPromotionPieces(): Array<{ value: string; label: string; symbol: string }> {
    return [
      { value: 'q', label: 'Queen', symbol: '♕' },
      { value: 'r', label: 'Rook', symbol: '♖' },
      { value: 'b', label: 'Bishop', symbol: '♗' },
      { value: 'n', label: 'Knight', symbol: '♘' },
    ];
  }

  static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  static formatTimeMs(milliseconds: number): string {
    return this.formatTime(Math.floor(milliseconds / 1000));
  }

  static getPieceSymbol(piece: string): string {
    const symbols: { [key: string]: string } = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
    };
    return symbols[piece] || piece;
  }

  static getPieceName(piece: string): string {
    const names: { [key: string]: string } = {
      'K': 'King', 'Q': 'Queen', 'R': 'Rook', 'B': 'Bishop', 'N': 'Knight', 'P': 'Pawn',
      'k': 'King', 'q': 'Queen', 'r': 'Rook', 'b': 'Bishop', 'n': 'Knight', 'p': 'Pawn',
    };
    return names[piece] || piece;
  }

  static getMoveNotation(move: any): string {
    return move.san || `${move.from}-${move.to}`;
  }

  static analyzePosition(chess: Chess): {
    material: { white: number; black: number };
    centerControl: { white: number; black: number };
    development: { white: number; black: number };
  } {
    const board = chess.board();
    let whiteMaterial = 0;
    let blackMaterial = 0;
    let whiteCenterControl = 0;
    let blackCenterControl = 0;
    let whiteDevelopment = 0;
    let blackDevelopment = 0;

    const pieceValues: { [key: string]: number } = {
      'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0,
    };

    const centerSquares = ['d4', 'd5', 'e4', 'e5'];

    board.forEach((row, rank) => {
      row.forEach((piece, file) => {
        if (piece) {
          const value = pieceValues[piece.type] || 0;
          const square = this.getSquareFromPosition(file, rank);
          
          if (piece.color === 'w') {
            whiteMaterial += value;
            if (centerSquares.includes(square)) whiteCenterControl += 1;
            if (piece.type !== 'p' && rank > 0) whiteDevelopment += 1;
          } else {
            blackMaterial += value;
            if (centerSquares.includes(square)) blackCenterControl += 1;
            if (piece.type !== 'p' && rank < 7) blackDevelopment += 1;
          }
        }
      });
    });

    return {
      material: { white: whiteMaterial, black: blackMaterial },
      centerControl: { white: whiteCenterControl, black: blackCenterControl },
      development: { white: whiteDevelopment, black: blackDevelopment },
    };
  }
}