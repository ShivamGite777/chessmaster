import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import { gameSettingsSchema } from '../../utils/validation';
import type { GameSettings } from '../../utils/validation';
import { TimeUtils } from '../../utils/time.utils';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface CreateGameModalProps {
  onClose: () => void;
  onGameCreated: (gameId: string) => void;
}

export const CreateGameModal: React.FC<CreateGameModalProps> = ({
  onClose,
  onGameCreated,
}) => {
  const { createNewGame, isLoading } = useGame();
  const [selectedTimeControl, setSelectedTimeControl] = useState<string>('blitz-5-0');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<GameSettings>({
    resolver: zodResolver(gameSettingsSchema),
    defaultValues: {
      timeControl: 'blitz',
      timeLimit: 300,
      increment: 0,
      colorPreference: 'random',
      isPublic: true,
    },
  });

  const timeControlPresets = TimeUtils.getTimeControlPresets();
  const watchedTimeControl = watch('timeControl');

  const handleTimeControlSelect = (presetId: string) => {
    const preset = timeControlPresets.find(p => p.id === presetId);
    if (preset) {
      setSelectedTimeControl(presetId);
      setValue('timeControl', preset.timeLimit <= 300 ? 'blitz' : preset.timeLimit <= 900 ? 'rapid' : 'classical');
      setValue('timeLimit', preset.timeLimit);
      setValue('increment', preset.increment);
    }
  };

  const onSubmit = async (data: GameSettings) => {
    try {
      const result = await createNewGame(data).unwrap();
      onGameCreated(result.id);
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

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
          <Card className="w-full max-w-md bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Game</CardTitle>
              <CardDescription className="text-gray-400">
                Set up your game preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Time Control */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Time Control</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeControlPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleTimeControlSelect(preset.id)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          selectedTimeControl === preset.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Preference */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Color Preference</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'white', label: 'White' },
                      { value: 'black', label: 'Black' },
                      { value: 'random', label: 'Random' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue('colorPreference', option.value as any)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          watch('colorPreference') === option.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Game Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Game Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setValue('isPublic', true)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        watch('isPublic')
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
                      }`}
                    >
                      Public
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('isPublic', false)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        !watch('isPublic')
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
                      }`}
                    >
                      Private
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Game'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};