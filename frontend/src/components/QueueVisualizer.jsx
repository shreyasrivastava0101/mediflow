import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowUpCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    case 'Low': return 'text-green-500 bg-green-500/10 border-green-500/30';
    default: return 'text-gray-500';
  }
};

const QueueVisualizer = () => {
  const [queue, setQueue] = useState([]);

  const fetchQueue = async () => {
    try {
      const res = await api.get('/patients/queue');
      setQueue(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000); // Live update every 15s
    return () => clearInterval(interval);
  }, []);

  const handlePriority = async (id) => {
    try {
      await api.put(`/patients/${id}/priority`, { priority: 'Critical' });
      toast.success('Patient prioritized to Critical');
      fetchQueue();
    } catch (error) {
      toast.error('Failed to prioritize');
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Remove patient from queue?')) {
      try {
        await api.delete(`/patients/${id}`);
        toast.success('Patient removed');
        fetchQueue();
      } catch (error) {
        toast.error('Failed to remove');
      }
    }
  };

  if (queue.length === 0) {
    return <div className="text-gray-400 text-center py-8">Queue is currently empty.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      <AnimatePresence>
        {queue.map((patient, i) => (
          <motion.div
            key={patient._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: i * 0.05 }}
            className={`mb-3 p-4 rounded-xl border flex justify-between items-center group ${getSeverityColor(patient.severity)}`}
          >
            <div>
              <h4 className="font-bold text-white mb-1">{patient.name}</h4>
              <div className="flex items-center gap-1 text-xs uppercase font-bold">
                {patient.severity === 'Critical' && <AlertCircle className="w-3 h-3" />}
                {patient.severity}
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 block mb-1">Wait Time</span>
                <span className="font-mono text-white bg-black/30 px-2 py-1 rounded">
                  {formatDistanceToNow(new Date(patient.arrivalTime))}
                </span>
              </div>
              <div className="hidden group-hover:flex flex-col gap-1 ml-2">
                <button onClick={() => handlePriority(patient._id)} className="text-[#0ea5e9] hover:text-white transition-colors" title="Prioritize"><ArrowUpCircle className="w-5 h-5"/></button>
                <button onClick={() => handleRemove(patient._id)} className="text-red-500 hover:text-red-400 transition-colors" title="Remove"><Trash2 className="w-5 h-5"/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default QueueVisualizer;
