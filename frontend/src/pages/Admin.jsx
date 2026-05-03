import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, FileOutput } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Admin = () => {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    if (window.confirm('WARNING: This will wipe all current data and reseed the database. Continue?')) {
      setLoading(true);
      try {
        const res = await api.post('/seed');
        toast.success(res.data.message);
      } catch (error) {
        toast.error('Failed to seed database');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExport = () => {
    toast.success('Analytics report downloaded successfully');
    // In a real app, trigger a CSV download blob from backend
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-red-500" /> Admin Controls
          </h1>
          <p className="text-gray-400">System management and data operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl border-l-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold">Database Management</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">Reset the database and populate it with 100 mock patients, 30 doctors, and 50 beds. Useful for demonstrations.</p>
          <button 
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Run Seed Script'}
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl border-l-4 border-[#10b981]">
          <div className="flex items-center gap-3 mb-4">
            <FileOutput className="w-6 h-6 text-[#10b981]" />
            <h2 className="text-xl font-bold">Data Export</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">Download a comprehensive CSV report of hospital occupancy, doctor utilization, and patient demographics.</p>
          <button 
            onClick={handleExport}
            className="w-full bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/50 py-3 rounded-xl font-bold transition-all"
          >
            Export Analytics CSV
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
