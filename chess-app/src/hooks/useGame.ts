import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../store/store';
import {
  createGame,
  fetchAvailableGames,
  joinGame,
  fetchGameDetails,
  fetchStats,
  fetchLeaderboard,
  fetchGameHistory,
  setCurrentGame,
  setGameState,
  addMove,
  setTimers,
  updateTimer,
  setSelectedSquare,
  setLegalMoves,
  setDrawOfferPending,
  clearError,
  resetGame,
} from '../store/gameSlice';
import type { GameSettings, Move, GameTimers } from '../types/game.types';

export const useGame = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentGame,
    availableGames,
    gameState,
    timers,
    stats,
    leaderboard,
    gameHistory,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.game);

  const createNewGame = useCallback(
    (settings: GameSettings) => {
      return dispatch(createGame(settings));
    },
    [dispatch]
  );

  const getAvailableGames = useCallback(() => {
    return dispatch(fetchAvailableGames());
  }, [dispatch]);

  const joinGameById = useCallback(
    (gameId: string) => {
      return dispatch(joinGame(gameId));
    },
    [dispatch]
  );

  const getGameDetails = useCallback(
    (gameId: string) => {
      return dispatch(fetchGameDetails(gameId));
    },
    [dispatch]
  );

  const getStats = useCallback(() => {
    return dispatch(fetchStats());
  }, [dispatch]);

  const getLeaderboard = useCallback(() => {
    return dispatch(fetchLeaderboard());
  }, [dispatch]);

  const getGameHistory = useCallback(() => {
    return dispatch(fetchGameHistory());
  }, [dispatch]);

  const setCurrentGameData = useCallback(
    (game: any) => {
      dispatch(setCurrentGame(game));
    },
    [dispatch]
  );

  const setGameStateData = useCallback(
    (state: any) => {
      dispatch(setGameState(state));
    },
    [dispatch]
  );

  const addMoveToHistory = useCallback(
    (move: Move) => {
      dispatch(addMove(move));
    },
    [dispatch]
  );

  const setTimerData = useCallback(
    (timerData: GameTimers) => {
      dispatch(setTimers(timerData));
    },
    [dispatch]
  );

  const updateTimerData = useCallback(
    (color: 'white' | 'black', time: number) => {
      dispatch(updateTimer({ color, time }));
    },
    [dispatch]
  );

  const setSelectedSquareData = useCallback(
    (square: string | null) => {
      dispatch(setSelectedSquare(square));
    },
    [dispatch]
  );

  const setLegalMovesData = useCallback(
    (moves: string[]) => {
      dispatch(setLegalMoves(moves));
    },
    [dispatch]
  );

  const setDrawOfferPendingData = useCallback(
    (pending: boolean) => {
      dispatch(setDrawOfferPending(pending));
    },
    [dispatch]
  );

  const clearGameError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetCurrentGame = useCallback(() => {
    dispatch(resetGame());
  }, [dispatch]);

  return {
    currentGame,
    availableGames,
    gameState,
    timers,
    stats,
    leaderboard,
    gameHistory,
    isLoading,
    error,
    createNewGame,
    getAvailableGames,
    joinGameById,
    getGameDetails,
    getStats,
    getLeaderboard,
    getGameHistory,
    setCurrentGameData,
    setGameStateData,
    addMoveToHistory,
    setTimerData,
    updateTimerData,
    setSelectedSquareData,
    setLegalMovesData,
    setDrawOfferPendingData,
    clearGameError,
    resetCurrentGame,
  };
};