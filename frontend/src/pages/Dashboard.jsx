import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SymptomChecker from '../components/SymptomChecker';
import DoctorFinder from '../components/DoctorFinder';
import PatientTimeline from '../components/PatientTimeline';
import PatientAnalytics from '../components/PatientAnalytics';
import EmergencyOverlay from '../components/EmergencyOverlay';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-8 relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0ea5e9]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8b5cf6]/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Welcome, {user?.name?.split(' ')[0] || 'Patient'}
          </h1>
          <p className="text-gray-400 font-medium text-sm">Mediflow Health Portal</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* SOS Button */}
          <button 
            onClick={() => setEmergencyMode(true)}
            className="bg-red-500/20 hover:bg-red-500 border border-red-500/50 hover:border-red-500 text-red-500 hover:text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]"
          >
            <ShieldAlert className="w-5 h-5" /> SOS
          </button>

          {/* Notifications Toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifs(!showNotifs)}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-[#10b981] rounded-full border-2 border-[#050505]"></span>
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 glass-card rounded-2xl p-4 shadow-2xl z-30"
                >
                  <h3 className="font-bold mb-3 border-b border-white/10 pb-2">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start p-2 hover:bg-white/5 rounded-xl cursor-pointer">
                      <div className="w-2 h-2 rounded-full bg-[#10b981] mt-2"></div>
                      <div>
                        <p className="text-sm font-bold">Upcoming Appointment</p>
                        <p className="text-xs text-gray-400">Dr. Smith • Tomorrow 10:00 AM</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start p-2 hover:bg-white/5 rounded-xl cursor-pointer">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-bold">Medication Reminder</p>
                        <p className="text-xs text-gray-400">Time to take your vitamins</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={logout} className="p-2 text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 h-[calc(100vh-140px)]">
        
        {/* Left Column (Symptom & Triage) */}
        <div className="lg:col-span-4 h-full">
          <SymptomChecker />
        </div>

        {/* Middle Column (Doctor Finder) */}
        <div className="lg:col-span-4 h-full">
          <DoctorFinder />
        </div>

        {/* Right Column (Timeline & Analytics) */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <div className="flex-1 h-[48%]">
            <PatientTimeline />
          </div>
          <div className="flex-1 h-[48%]">
            <PatientAnalytics />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {emergencyMode && <EmergencyOverlay onClose={() => setEmergencyMode(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
