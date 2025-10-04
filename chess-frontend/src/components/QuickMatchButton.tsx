import { motion } from 'framer-motion';
import { soundManager } from '../utils/sounds';

interface QuickMatchButtonProps {
  onQuickMatch: () => void;
}

const QuickMatchButton: React.FC<QuickMatchButtonProps> = ({ onQuickMatch }) => {
  const handleClick = () => {
    soundManager.playClick();
    onQuickMatch();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="btn-secondary flex-1 text-lg py-4 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '0%' }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10 flex items-center justify-center">
        <span className="mr-2">⚡</span>
        Quick Match
      </span>
    </motion.button>
  );
};

export default QuickMatchButton;