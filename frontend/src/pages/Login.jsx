import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Lock, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@mediflow.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { success, user } = await login(email, password);
    setLoading(false);
    if (success && user) {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0ea5e9]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8b5cf6]/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl z-10 relative"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Activity className="w-8 h-8 text-[#0ea5e9]" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to Mediflow Command Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
                placeholder="admin@mediflow.com"
                required
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#0ea5e9] hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#0ea5e9] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#0ea5e9] hover:bg-[#3b82f6] text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account? <Link to="/register" className="text-[#0ea5e9] hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
