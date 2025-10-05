import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { soundManager } from '../utils/sounds';

const LandingPage: React.FC = () => {
  const handlePlayClick = () => {
    soundManager.playClick();
  };

  const features = [
    {
      icon: '⚡',
      title: 'Real-time Multiplayer',
      description: 'Play against players from around the world with instant move synchronization'
    },
    {
      icon: '🏆',
      title: 'ELO Rating System',
      description: 'Compete and climb the leaderboards with our fair rating system'
    },
    {
      icon: '🎵',
      title: 'Immersive Experience',
      description: 'Enjoy beautiful animations and sound effects for every move'
    },
    {
      icon: '📱',
      title: 'Cross-platform',
      description: 'Play on desktop, tablet, or mobile with responsive design'
    }
  ];

  const stats = [
    { label: 'Games Played', value: '1,234,567' },
    { label: 'Active Players', value: '45,678' },
    { label: 'Countries', value: '127' },
    { label: 'Average Rating', value: '1,245' }
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary-500/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated Chess Pieces */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex justify-center space-x-4 text-6xl">
                <motion.span
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ♔
                </motion.span>
                <motion.span
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  ♛
                </motion.span>
                <motion.span
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  ♜
                </motion.span>
              </div>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 text-shadow-lg">
              ChessMaster
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the ultimate online chess platform with real-time multiplayer, 
              beautiful animations, and competitive rankings.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/demo"
                className="btn-primary text-lg px-8 py-4"
                onClick={handlePlayClick}
              >
                Try Demo
              </Link>
              <Link
                to="/register"
                className="btn-secondary text-lg px-8 py-4"
                onClick={handlePlayClick}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-4"
                onClick={handlePlayClick}
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose ChessMaster?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built for chess enthusiasts who demand the best online experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-dark rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Thousands of players worldwide trust ChessMaster for their daily games
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500/20 to-primary-600/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Play?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of players and start your chess journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/demo"
                className="btn-primary text-lg px-8 py-4"
                onClick={handlePlayClick}
              >
                Try Demo Now
              </Link>
              <Link
                to="/register"
                className="btn-secondary text-lg px-8 py-4"
                onClick={handlePlayClick}
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-dark-800 border-t border-dark-700">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-400">
            <p>&copy; 2024 ChessMaster. Built with React, TypeScript, and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;