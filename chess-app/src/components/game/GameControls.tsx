import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface GameControlsProps {
  onResign: () => void;
  onOfferDraw: () => void;
  onAcceptDraw: () => void;
  onDeclineDraw: () => void;
  drawOfferPending: boolean;
  isMyTurn: boolean;
  className?: string;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onResign,
  onOfferDraw,
  onAcceptDraw,
  onDeclineDraw,
  drawOfferPending,
  isMyTurn,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-3 justify-center ${className}`}>
      {drawOfferPending ? (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-2"
          >
            <Button
              onClick={onAcceptDraw}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Accept Draw
            </Button>
            <Button
              onClick={onDeclineDraw}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              Decline
            </Button>
          </motion.div>
        </>
      ) : (
        <>
          <Button
            onClick={onOfferDraw}
            variant="outline"
            className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
            disabled={!isMyTurn}
          >
            Offer Draw
          </Button>
          <Button
            onClick={onResign}
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600/10"
            disabled={!isMyTurn}
          >
            Resign
          </Button>
        </>
      )}
    </div>
  );
};