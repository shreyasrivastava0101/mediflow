import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AdmitPatientModal = ({ onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', symptoms: '', severity: 'Medium', insurance: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        symptoms: formData.symptoms.split(',').map(s => s.trim())
      };
      const res = await api.post('/patients', payload);
      toast.success(res.data.message);
      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to admit patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card w-full max-w-xl rounded-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Admit New Patient</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:border-[#0ea5e9] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Age</label>
              <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:border-[#0ea5e9] outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 focus:border-[#0ea5e9] outline-none text-white">
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Severity</label>
              <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 focus:border-[#0ea5e9] outline-none text-white">
                <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Symptoms (comma separated)</label>
            <input type="text" placeholder="e.g. Chest pain, Fever" required value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:border-[#0ea5e9] outline-none" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Insurance Info</label>
            <input type="text" value={formData.insurance} onChange={e => setFormData({...formData, insurance: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 focus:border-[#0ea5e9] outline-none" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[#0ea5e9] hover:bg-[#3b82f6] text-white font-medium shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all disabled:opacity-50">
              {loading ? 'Admitting...' : 'Admit Patient'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdmitPatientModal;
