import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SquareProps {
  square: string;
  color: 'light' | 'dark';
  children?: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  isLegalMove?: boolean;
  isLastMove?: boolean;
  isCheck?: boolean;
  isInteractive?: boolean;
  className?: string;
}

export const Square: React.FC<SquareProps> = ({
  square,
  color,
  children,
  onClick,
  isSelected = false,
  isLegalMove = false,
  isLastMove = false,
  isCheck = false,
  isInteractive = true,
  className = '',
}) => {
  const baseClasses = cn(
    'relative flex items-center justify-center cursor-pointer transition-all duration-200',
    {
      'cursor-pointer': isInteractive,
      'cursor-default': !isInteractive,
    }
  );

  const colorClasses = cn({
    'bg-light-square': color === 'light',
    'bg-dark-square': color === 'dark',
  });

  const stateClasses = cn({
    'bg-highlight-legal': isLegalMove,
    'bg-highlight-lastmove': isLastMove,
    'bg-highlight-check': isCheck,
    'ring-2 ring-blue-500': isSelected,
  });

  return (
    <motion.div
      className={cn(baseClasses, colorClasses, stateClasses, className)}
      onClick={onClick}
      whileHover={isInteractive ? { scale: 1.05 } : {}}
      whileTap={isInteractive ? { scale: 0.95 } : {}}
      transition={{ duration: 0.1 }}
    >
      {children}
      
      {/* Legal move indicator */}
      {isLegalMove && !children && (
        <motion.div
          className="w-3 h-3 bg-yellow-400 rounded-full opacity-60"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Legal move indicator for occupied squares */}
      {isLegalMove && children && (
        <motion.div
          className="absolute inset-0 bg-yellow-400 rounded-full opacity-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};