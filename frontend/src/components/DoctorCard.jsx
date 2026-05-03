import { motion } from 'framer-motion';

const DoctorCard = ({ doctor }) => {
  const isBusy = doctor.status === 'Busy';
  const load = doctor.currentPatients ? doctor.currentPatients.length : 0;
  const max = doctor.maxPatients || 10;
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="glass-card p-5 rounded-2xl flex flex-col relative overflow-hidden group"
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${isBusy ? 'bg-red-500' : 'bg-green-500'}`} />
      
      <div className="flex justify-between items-start mb-4 pl-3">
        <div>
          <h3 className="font-bold text-lg text-white group-hover:text-[#0ea5e9] transition-colors">{doctor.name}</h3>
          <p className="text-sm text-[#8b5cf6] font-medium">{doctor.specialization}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${isBusy ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
          {doctor.status}
        </div>
      </div>
      
      <div className="mt-auto pl-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">Current Load</span>
          <span className="text-white font-bold">{load}/{max}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
          <div 
            className={`h-1.5 rounded-full ${isBusy ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,0.8)]'}`} 
            style={{ width: `${(load / max) * 100}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
