import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore, useUIStore, useNotificationStore } from '../store';
import { soundManager } from '../utils/sounds';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { unreadCount } = useNotificationStore();

  // Demo user for non-authenticated users
  const demoUser = {
    id: 'demo-user',
    username: 'Demo Player',
    email: 'demo@chessmaster.com',
    elo: 1200
  };

  const currentUser = isAuthenticated ? user : demoUser;

  const handleLogout = () => {
    soundManager.playClick();
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    soundManager.playClick();
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { path: isAuthenticated ? '/dashboard' : '/', label: 'Dashboard', icon: '🏠' },
    { path: isAuthenticated ? '/profile' : '/', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav className="bg-dark-800 border-b border-dark-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">♔</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">ChessMaster</span>
          </Link>
        </div>

        {/* Center navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-dark-700 transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {unreadCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-white font-medium">{currentUser?.username}</p>
              <p className="text-gray-400 text-sm">ELO: {currentUser?.elo}</p>
            </div>
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-300 hover:text-white"
                aria-label="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            ) : (
              <Link
                to="/login"
                className="p-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-300 hover:text-white"
                aria-label="Sign In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;