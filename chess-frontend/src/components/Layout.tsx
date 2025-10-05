import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { useUIStore } from '../store';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-dark-900">
      <Navigation />
      
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          className={`${
            sidebarOpen ? 'w-80' : 'w-0'
          } transition-all duration-300 overflow-hidden`}
          initial={false}
          animate={{ width: sidebarOpen ? 320 : 0 }}
        >
          <Sidebar />
        </motion.div>

        {/* Main content */}
        <motion.main
          className="flex-1 min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;