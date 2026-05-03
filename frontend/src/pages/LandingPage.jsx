import { motion } from 'framer-motion';
import { ArrowRight, Activity, ShieldPlus, HeartPulse } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    const { success, user } = await demoLogin();
    setDemoLoading(false);
    if (success && user) {
      if (user.role === 'Admin') navigate('/admin');
      else navigate('/dashboard');
    }
  };
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-20">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#0ea5e9] rounded-full blur-[150px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#8b5cf6] rounded-full blur-[150px] opacity-20 pointer-events-none" />

      <main className="z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#0ea5e9]/30 text-[#0ea5e9] text-sm mb-8"
        >
          <Activity className="w-4 h-4" />
          <span>Next-Generation Healthcare Intelligence</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500"
        >
          Hospital Workflow, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6]">Reimagined.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10"
        >
          A premium, AI-driven platform for smart bed allocation, automated doctor assignment, and real-time hospital analytics.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/dashboard" className="flex items-center gap-2 bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6] text-white px-8 py-4 rounded-full font-bold hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all">
            Enter Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <button 
            onClick={handleDemo}
            disabled={demoLoading}
            className="flex items-center gap-2 glass px-8 py-4 rounded-full font-bold text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            {demoLoading ? 'Logging in...' : 'View Demo'}
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
        >
          {[
            { icon: <ShieldPlus className="w-8 h-8 text-[#0ea5e9]" />, title: 'Smart Triage', desc: 'Automated AI severity assessment.' },
            { icon: <HeartPulse className="w-8 h-8 text-[#8b5cf6]" />, title: 'Live Occupancy', desc: 'Real-time bed tracking and analytics.' },
            { icon: <Activity className="w-8 h-8 text-[#10b981]" />, title: 'Instant Routing', desc: 'Symptom-based doctor matching.' }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl text-left hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-white/5 p-3 rounded-xl inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
