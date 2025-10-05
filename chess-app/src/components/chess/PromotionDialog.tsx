import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChessUtils } from '../../utils/chess.utils';
import { Card, CardContent } from '../ui/Card';

interface PromotionDialogProps {
  onSelect: (piece: string) => void;
  onClose: () => void;
}

export const PromotionDialog: React.FC<PromotionDialogProps> = ({
  onSelect,
  onClose,
}) => {
  const promotionPieces = ChessUtils.getPromotionPieces();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Choose Promotion Piece
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {promotionPieces.map((piece) => (
                  <motion.button
                    key={piece.value}
                    onClick={() => onSelect(piece.value)}
                    className="p-4 rounded-lg border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{piece.symbol}</div>
                      <div className="text-sm text-gray-300">{piece.label}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={onClose}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};