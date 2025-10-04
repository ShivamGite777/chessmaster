import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store';
import { socketManager } from './utils/socket';
import { soundManager } from './utils/sounds';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    // Initialize sound manager
    soundManager.preloadSounds();

    // Connect to socket if authenticated
    if (isAuthenticated) {
      const token = localStorage.getItem('auth-token');
      socketManager.connect(token || undefined).catch(console.error);
    }

    return () => {
      socketManager.disconnect();
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <GamePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
