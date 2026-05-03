import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    const success = await register(formData.name, formData.email, formData.password, formData.confirmPassword);
    setLoading(false);
    if (success) navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#10b981]/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-8 rounded-3xl z-10 relative"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join the Mediflow platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#10b981] transition-colors"
                placeholder="Dr. John Doe"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#10b981] transition-colors"
                placeholder="doctor@mediflow.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#10b981] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#10b981] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#10b981] hover:bg-[#059669] text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Register'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-[#10b981] hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
