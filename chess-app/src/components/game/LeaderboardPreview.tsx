import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../hooks/useGame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

export const LeaderboardPreview: React.FC = () => {
  const { leaderboard, getLeaderboard } = useGame();

  React.useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Leaderboard</CardTitle>
        <CardDescription className="text-gray-400">
          Top players by ELO rating
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            <p>Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry, index) => (
              <motion.div
                key={entry.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-xs font-bold">
                    {entry.rank}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {entry.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {entry.user.username}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary">
                    {entry.elo}
                  </div>
                  <div className="text-xs text-gray-400">
                    {entry.gamesPlayed} games
                  </div>
                </div>
              </motion.div>
            ))}
            <Button
              variant="outline"
              className="w-full mt-4 border-gray-600 text-white hover:bg-gray-700"
              onClick={() => {
                // Navigate to full leaderboard
                window.location.href = '/leaderboard';
              }}
            >
              View Full Leaderboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};