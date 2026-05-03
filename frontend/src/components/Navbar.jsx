import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Home, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const previewMode = true;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!previewMode) {
      logout();
      navigate('/');
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-card border border-white/10 rounded-full px-6 py-3 flex justify-between items-center bg-black/40 backdrop-blur-2xl shadow-2xl">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-[#0ea5e9]/10 rounded-lg group-hover:bg-[#0ea5e9]/20 transition-colors">
            <Activity className="w-6 h-6 text-[#0ea5e9]" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            MEDI<span className="text-[#0ea5e9]">FLOW</span>
          </span>
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
                <span className="text-xs font-bold text-gray-400 uppercase">Preview Mode</span>
              </div>
              <Link 
                to="/dashboard" 
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" /> Dashboard
              </Link>
              {!previewMode && (
                <>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-all text-sm font-bold"
                  >
                    <LogOut className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition-all text-sm font-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
