import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgotpassword', { email });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error generating reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl z-10 relative"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#0ea5e9] hover:bg-[#3b82f6] text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <p className="text-center text-gray-400 text-sm mt-6">
          Remember your password? <Link to="/login" className="text-[#0ea5e9] hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
