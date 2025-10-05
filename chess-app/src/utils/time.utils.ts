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

export const getTimeColor = (timeRemaining: number, totalTime: number): string => {
  const percentage = timeRemaining / totalTime;
  
  if (percentage <= 0.1) return 'text-red-500'; // Critical
  if (percentage <= 0.2) return 'text-orange-500'; // Warning
  if (percentage <= 0.5) return 'text-yellow-500'; // Caution
  return 'text-white'; // Normal
};

export const getTimeWarning = (timeRemaining: number, totalTime: number): string | null => {
  const percentage = timeRemaining / totalTime;
  
  if (percentage <= 0.05) return 'Time critical!';
  if (percentage <= 0.1) return 'Less than 10% time remaining';
  if (percentage <= 0.2) return 'Less than 20% time remaining';
  
  return null;
};

export const calculateTimeBonus = (timeControl: { initial: number; increment: number }): number => {
  return timeControl.increment * 1000; // Convert seconds to milliseconds
};

export const calculateInitialTime = (timeControl: { initial: number; increment: number }): number => {
  return timeControl.initial * 60 * 1000; // Convert minutes to milliseconds
};

export const isTimeUp = (timeRemaining: number): boolean => {
  return timeRemaining <= 0;
};

export const getTimeDisplay = (timeRemaining: number, showHours: boolean = false): string => {
  if (timeRemaining <= 0) return '0:00';
  
  if (showHours) {
    return formatTimeWithHours(timeRemaining);
  }
  
  return formatTime(timeRemaining);
};