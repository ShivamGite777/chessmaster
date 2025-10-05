import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '../utils/api';
import { soundManager } from '../utils/sounds';
import type { TimeControl } from '../types';

interface CreateGameModalProps {
  onClose: () => void;
  onGameCreated: () => void;
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({ onClose, onGameCreated }) => {
  const [formData, setFormData] = useState({
    timeControl: 'blitz' as 'blitz' | 'rapid' | 'classical',
    isPrivate: false,
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const timeControls: { [key: string]: TimeControl } = {
    blitz: { type: 'blitz', initialTime: 300, increment: 0 }, // 5 minutes
    rapid: { type: 'rapid', initialTime: 900, increment: 10 }, // 15 minutes + 10s
    classical: { type: 'classical', initialTime: 1800, increment: 30 } // 30 minutes + 30s
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();

    if (formData.isPrivate && !formData.password.trim()) {
      setError('Password is required for private games');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.createGame({
        timeControl: timeControls[formData.timeControl],
        isPrivate: formData.isPrivate,
        password: formData.isPrivate ? formData.password : undefined
      });

      if (response.success) {
        onGameCreated();
      } else {
        setError(response.error || 'Failed to create game');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-dark rounded-xl p-6 w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Create New Game</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                className="bg-danger/20 border border-danger/50 text-danger px-4 py-3 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            {/* Time Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Time Control
              </label>
              <div className="space-y-3">
                {Object.entries(timeControls).map(([key, control]) => (
                  <label
                    key={key}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.timeControl === key
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 hover:border-dark-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeControl"
                      value={key}
                      checked={formData.timeControl === key}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium capitalize">{key}</div>
                      <div className="text-sm text-gray-400">
                        {formatTime(control.initialTime)}
                        {control.increment > 0 && ` + ${control.increment}s`}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Private Game */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-600 rounded bg-dark-700"
                />
                <span className="ml-2 text-sm text-gray-300">
                  Make this a private game
                </span>
              </label>
            </div>

            {/* Password */}
            {formData.isPrivate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Game Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter password for private game"
                />
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Game'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateGameModal;