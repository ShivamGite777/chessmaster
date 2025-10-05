import React from 'react';
import { motion } from 'framer-motion';
import { TimeUtils } from '../../utils/time.utils';

interface TimerProps {
  time: number;
  isRunning: boolean;
  isLow: boolean;
  isCritical: boolean;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  time,
  isRunning,
  isLow,
  isCritical,
  className = '',
}) => {
  const getTimeColor = () => {
    if (isCritical) return 'text-red-500';
    if (isLow) return 'text-yellow-500';
    return 'text-white';
  };

  const getTimeBgColor = () => {
    if (isCritical) return 'bg-red-500/10 border-red-500/20';
    if (isLow) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-gray-700/50 border-gray-600';
  };

  return (
    <motion.div
      className={`p-3 rounded-lg border ${getTimeBgColor()} ${className}`}
      animate={{
        scale: isRunning ? [1, 1.02, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: isRunning ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      <div className="text-center">
        <div className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
          {TimeUtils.formatTimeMs(time)}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {isRunning ? 'Running' : 'Paused'}
        </div>
      </div>
    </motion.div>
  );
};