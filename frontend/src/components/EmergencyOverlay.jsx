import { motion } from 'framer-motion';
import { Phone, Navigation, ShieldAlert, X } from 'lucide-react';

const EmergencyOverlay = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-xl"
    >
      <div className="absolute top-8 right-8">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl text-center"
      >
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-pulse">
          <ShieldAlert className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">EMERGENCY SOS</h1>
        <p className="text-xl text-red-200 mb-10">Dispatching emergency services to your location. Do not close this window.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="bg-black/40 border border-red-500/30 p-6 rounded-2xl">
            <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><Navigation className="w-5 h-5"/> Nearest Hospitals</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-white/5 pb-2">
                <div>
                  <div className="font-bold text-white">City General Hospital</div>
                  <div className="text-sm text-gray-400">1.2 miles away</div>
                </div>
                <div className="text-red-400 font-bold">3 mins</div>
              </li>
              <li className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Mercy Medical Center</div>
                  <div className="text-sm text-gray-400">2.5 miles away</div>
                </div>
                <div className="text-red-400 font-bold">8 mins</div>
              </li>
            </ul>
          </div>

          <div className="bg-black/40 border border-red-500/30 p-6 rounded-2xl flex flex-col justify-center gap-4">
            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Phone className="w-6 h-6" /> Call 911 Directly
            </button>
            <button className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg border border-white/10">
              <Phone className="w-6 h-6 text-gray-400" /> Contact Emergency Contact
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmergencyOverlay;
