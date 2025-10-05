import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { stats, getStats } = useGame();

  React.useEffect(() => {
    getStats();
  }, [getStats]);

  const isOwnProfile = user?.username === username;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    {username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{username}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {isOwnProfile ? 'Your Profile' : 'Player Profile'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stats */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Games Played</span>
                      <span className="text-white font-medium">{stats.totalGames}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wins</span>
                      <span className="text-green-400 font-medium">{stats.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Losses</span>
                      <span className="text-red-400 font-medium">{stats.losses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Draws</span>
                      <span className="text-yellow-400 font-medium">{stats.draws}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-white font-medium">{stats.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current ELO</span>
                      <span className="text-primary font-medium">{stats.currentElo}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <p>Loading stats...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Games</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-gray-400">
                  <p>Recent games will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;