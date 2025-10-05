import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { useSocket } from '../hooks/useSocket';
import { useChess } from '../hooks/useChess';
import { useTimer } from '../hooks/useTimer';
import { ChessBoard } from '../components/chess/ChessBoard';
import { MoveHistory } from '../components/chess/MoveHistory';
import { CapturedPieces } from '../components/chess/CapturedPieces';
import { GameControls } from '../components/game/GameControls';
import { PlayerCard } from '../components/game/PlayerCard';
import { Timer } from '../components/game/Timer';
import { GameResultModal } from '../components/game/GameResultModal';
import { PromotionDialog } from '../components/chess/PromotionDialog';

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentGame, gameState, timers, getGameDetails, setCurrentGameData } = useGame();
  const { joinGame, makeMove, offerDraw, acceptDraw, declineDraw, resign } = useSocket();
  const [isPromoting, setIsPromoting] = useState(false);
  const [promotionSquare, setPromotionSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const {
    gameState: chessGameState,
    moveHistory,
    capturedPieces,
    makeMove: chessMakeMove,
    isPromotionMove,
    loadPosition,
  } = useChess(gameState?.board);

  const {
    whiteTime,
    blackTime,
    currentPlayer,
    isRunning,
    switchPlayer,
    isTimeLow,
    isTimeCritical,
  } = useTimer(
    currentGame?.timeLimit || 300,
    currentGame?.increment || 0
  );

  useEffect(() => {
    if (id) {
      getGameDetails(id);
    }
  }, [id, getGameDetails]);

  useEffect(() => {
    if (currentGame && user) {
      joinGame(currentGame.id);
    }
  }, [currentGame, user, joinGame]);

  useEffect(() => {
    if (gameState) {
      loadPosition(gameState.board);
      setLastMove(gameState.lastMove ? {
        from: gameState.lastMove.from,
        to: gameState.lastMove.to,
      } : null);
    }
  }, [gameState, loadPosition]);

  useEffect(() => {
    if (timers) {
      // Update timer state when received from server
      // This would be handled by the timer hook
    }
  }, [timers]);

  const handleMove = (from: string, to: string, promotion?: string) => {
    if (!currentGame || !user) return;

    if (isPromotionMove(from, to)) {
      setPromotionSquare(to);
      setIsPromoting(true);
      return;
    }

    const success = chessMakeMove(from, to, promotion);
    if (success) {
      makeMove(currentGame.id, { from, to, promotion });
      switchPlayer();
    }
  };

  const handlePromotion = (piece: string) => {
    if (!currentGame || !promotionSquare || !lastMove) return;

    const success = chessMakeMove(lastMove.from, promotionSquare, piece);
    if (success) {
      makeMove(currentGame.id, { from: lastMove.from, to: promotionSquare, promotion: piece });
      switchPlayer();
    }

    setIsPromoting(false);
    setPromotionSquare(null);
  };

  const handleResign = () => {
    if (!currentGame) return;
    resign(currentGame.id);
  };

  const handleDrawOffer = () => {
    if (!currentGame) return;
    offerDraw(currentGame.id);
  };

  const handleAcceptDraw = () => {
    if (!currentGame) return;
    acceptDraw(currentGame.id);
  };

  const handleDeclineDraw = () => {
    if (!currentGame) return;
    declineDraw(currentGame.id);
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading game...</p>
        </div>
      </div>
    );
  }

  const isWhitePlayer = user?.id === currentGame.hostId && currentGame.colorPreference === 'white' ||
                       user?.id === currentGame.opponentId && currentGame.colorPreference === 'black';
  const isBlackPlayer = user?.id === currentGame.hostId && currentGame.colorPreference === 'black' ||
                       user?.id === currentGame.opponentId && currentGame.colorPreference === 'white';

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div className="text-sm text-gray-400">
                Game ID: {currentGame.id.slice(0, 8)}...
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {currentGame.timeControl} • {currentGame.timeLimit}s
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Opponent Info */}
          <div className="lg:col-span-1">
            <PlayerCard
              player={{
                username: currentGame.opponentUsername || 'Waiting...',
                elo: currentGame.opponentElo || 0,
                avatar: currentGame.opponentAvatar,
              }}
              isOpponent={true}
            timer={{
              time: blackTime,
              isRunning: isRunning() && currentPlayer === 'black',
              isLow: isTimeLow('black'),
              isCritical: isTimeCritical('black'),
            }}
            />
          </div>

          {/* Center - Chess Board */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="mb-4">
              <ChessBoard
                fen={gameState?.board}
                onMove={handleMove}
                orientation={isWhitePlayer ? 'white' : 'black'}
                showCoordinates={true}
                showLegalMoves={true}
                highlightLastMove={true}
                lastMove={lastMove || undefined}
                isInteractive={true}
                className="max-w-full"
              />
            </div>

            <GameControls
              onResign={handleResign}
              onOfferDraw={handleDrawOffer}
              onAcceptDraw={handleAcceptDraw}
              onDeclineDraw={handleDeclineDraw}
              drawOfferPending={false}
              isMyTurn={currentPlayer === (isWhitePlayer ? 'white' : 'black')}
            />
          </div>

          {/* Right Sidebar - Move History & Captured Pieces */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Captured Pieces</h3>
              <CapturedPieces pieces={capturedPieces} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Move History</h3>
              <MoveHistory moves={moveHistory} />
            </div>
          </div>
        </div>

        {/* Bottom - Your Info */}
        <div className="mt-8">
          <PlayerCard
            player={{
              username: user?.username || '',
              elo: user?.elo || 0,
              avatar: user?.avatar,
            }}
            isOpponent={false}
            timer={{
              time: whiteTime,
              isRunning: isRunning() && currentPlayer === 'white',
              isLow: isTimeLow('white'),
              isCritical: isTimeCritical('white'),
            }}
          />
        </div>
      </main>

      {/* Promotion Dialog */}
      {isPromoting && (
        <PromotionDialog
          onSelect={handlePromotion}
          onClose={() => {
            setIsPromoting(false);
            setPromotionSquare(null);
          }}
        />
      )}

      {/* Game Result Modal */}
      {gameState?.isCheckmate || gameState?.isStalemate || gameState?.isDraw ? (
        <GameResultModal
          result={{
            type: gameState.isCheckmate ? 'checkmate' : gameState.isStalemate ? 'stalemate' : 'draw',
            winner: gameState.isCheckmate ? (currentPlayer === 'white' ? 'black' : 'white') : undefined,
          }}
          onClose={handleBackToDashboard}
        />
      ) : null}
    </div>
  );
};

export default GamePage;