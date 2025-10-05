import { useState, useEffect, useCallback, useRef } from 'react';
import type { PieceColor } from '../types/game.types';
import { TimeUtils } from '../utils/time.utils';

interface TimerState {
  whiteTime: number;
  blackTime: number;
  isRunning: boolean;
  currentPlayer: PieceColor;
}

export const useTimer = (timeLimit: number, increment: number = 0) => {
  const [timerState, setTimerState] = useState<TimerState>({
    whiteTime: timeLimit * 1000,
    blackTime: timeLimit * 1000,
    isRunning: false,
    currentPlayer: 'white',
  });

  const intervalRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  const startTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
    lastUpdateRef.current = Date.now();
  }, []);

  const stopTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState({
      whiteTime: timeLimit * 1000,
      blackTime: timeLimit * 1000,
      isRunning: false,
      currentPlayer: 'white',
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timeLimit]);

  const switchPlayer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      currentPlayer: prev.currentPlayer === 'white' ? 'black' : 'white',
    }));
  }, []);

  const addTime = useCallback((player: PieceColor, time: number) => {
    setTimerState(prev => ({
      ...prev,
      [`${player}Time`]: prev[`${player}Time`] + time,
    }));
  }, []);

  const setTime = useCallback((player: PieceColor, time: number) => {
    setTimerState(prev => ({
      ...prev,
      [`${player}Time`]: time,
    }));
  }, []);

  const getTime = useCallback((player: PieceColor) => {
    return timerState[`${player}Time`];
  }, [timerState]);

  const getFormattedTime = useCallback((player: PieceColor) => {
    return TimeUtils.formatTimeMs(timerState[`${player}Time`]);
  }, [timerState]);

  const isTimeLow = useCallback((player: PieceColor, threshold = 30000) => {
    return TimeUtils.isTimeLow(timerState[`${player}Time`], threshold);
  }, [timerState]);

  const isTimeCritical = useCallback((player: PieceColor, threshold = 10000) => {
    return TimeUtils.isTimeCritical(timerState[`${player}Time`], threshold);
  }, [timerState]);

  const getTimeColor = useCallback((player: PieceColor) => {
    return TimeUtils.getTimeColor(timerState[`${player}Time`]);
  }, [timerState]);

  const isTimeUp = useCallback((player: PieceColor) => {
    return timerState[`${player}Time`] <= 0;
  }, [timerState]);

  const getCurrentPlayer = useCallback(() => {
    return timerState.currentPlayer;
  }, [timerState]);

  const isTimerRunning = useCallback(() => {
    return timerState.isRunning;
  }, [timerState]);

  // Timer tick effect
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = now - lastUpdateRef.current;
        lastUpdateRef.current = now;

        setTimerState(prev => {
          const newTime = prev[`${prev.currentPlayer}Time`] - delta;
          return {
            ...prev,
            [`${prev.currentPlayer}Time`]: Math.max(0, newTime),
          };
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState.isRunning, timerState.currentPlayer]);

  // Auto-stop when time runs out
  useEffect(() => {
    if (timerState.isRunning && (timerState.whiteTime <= 0 || timerState.blackTime <= 0)) {
      stopTimer();
    }
  }, [timerState.isRunning, timerState.whiteTime, timerState.blackTime, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    whiteTime: timerState.whiteTime,
    blackTime: timerState.blackTime,
    currentPlayer: timerState.currentPlayer,
    isRunning: timerState.isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    switchPlayer,
    addTime,
    setTime,
    getTime,
    getFormattedTime,
    isTimeLow,
    isTimeCritical,
    getTimeColor,
    isTimeUp,
    getCurrentPlayer,
    isRunning: isTimerRunning,
  };
};