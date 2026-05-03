import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/updatedetails', formData);
      toast.success('Profile updated successfully. Re-login to see changes globally.');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Platform Settings</h1>
        <p className="text-gray-400">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/10 text-white font-medium flex items-center gap-3">
            <User className="w-5 h-5 text-[#0ea5e9]" /> Profile
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-medium flex items-center gap-3 transition-colors">
            <Lock className="w-5 h-5" /> Security
          </button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white font-medium flex items-center gap-3 transition-colors">
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </div>

        <div className="col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="w-5 h-5 text-[#0ea5e9]"/> Profile Details</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:border-[#0ea5e9] outline-none text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:border-[#0ea5e9] outline-none text-white" />
              </div>
              <button disabled={loading} type="submit" className="bg-[#0ea5e9] hover:bg-[#3b82f6] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(14,165,233,0.3)] disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Monitor className="w-5 h-5 text-[#8b5cf6]"/> Appearance</h2>
            <div className="flex gap-4">
              <button className="flex-1 border border-white/20 bg-white/5 py-4 rounded-xl flex flex-col items-center gap-2 hover:bg-white/10 transition-colors">
                <Moon className="w-6 h-6 text-[#0ea5e9]" />
                <span className="font-medium">Dark (Active)</span>
              </button>
              <button className="flex-1 border border-white/5 bg-black/50 py-4 rounded-xl flex flex-col items-center gap-2 text-gray-500 cursor-not-allowed">
                <Sun className="w-6 h-6" />
                <span className="font-medium">Light</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Light mode coming in v2.0.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
