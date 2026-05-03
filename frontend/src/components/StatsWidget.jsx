import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const StatsWidget = ({ title, value, total, icon, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMilSecDur = 1000;
    let incrementTime = (totalMilSecDur / end) * 2;

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-5 rounded-3xl relative overflow-hidden group border border-white/5"
    >
      {/* Background Glow */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor: color }}
      />
      
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-2.5 rounded-xl bg-white/5 flex items-center justify-center shadow-lg"
          style={{ color: color }}
        >
          {icon}
        </div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      </div>

      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-black text-white tracking-tight">
          {count.toLocaleString()}
        </h3>
        {total && (
          <span className="text-gray-500 font-medium text-sm">/ {total}</span>
        )}
      </div>
      
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: total ? `${(count/total) * 100}%` : '70%' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
};

export default StatsWidget;
