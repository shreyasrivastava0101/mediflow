import { useState, useEffect } from 'react';
import { Clock, Calendar, FileText, Pill } from 'lucide-react';
import api from '../services/api';

const PatientTimeline = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
    window.addEventListener('refresh-timeline', fetchTimeline);
    return () => window.removeEventListener('refresh-timeline', fetchTimeline);
  }, []);

  return (
    <div className="glass-card p-6 rounded-3xl h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#8b5cf6]" /> Your Health Timeline
      </h3>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading history...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No recent activity.</div>
        ) : (
          <div className="relative border-l border-white/10 ml-4 space-y-6 pb-4">
            {appointments.map((app, i) => (
              <div key={app._id} className="relative pl-6">
                {/* Timeline dot */}
                <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-black ${
                  app.status === 'Completed' ? 'bg-[#10b981]' : 
                  app.status === 'Cancelled' ? 'bg-red-500' : 'bg-[#0ea5e9]'
                }`} />
                
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-[#0ea5e9] font-bold flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> 
                      {new Date(app.date).toLocaleDateString()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-md ${
                      app.status === 'Completed' ? 'bg-[#10b981]/20 text-[#10b981]' : 
                      app.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 'bg-[#0ea5e9]/20 text-[#0ea5e9]'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg">{app.doctor?.name || 'Doctor'}</h4>
                  <p className="text-sm text-gray-400 mb-3">{app.doctor?.specialization || 'Consultation'}</p>
                  
                  {app.status === 'Completed' && i % 2 === 0 && (
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs flex items-center gap-1 bg-[#8b5cf6]/20 text-[#8b5cf6] px-2 py-1 rounded-lg">
                        <FileText className="w-3 h-3" /> Report Ready
                      </span>
                      <span className="text-xs flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-lg">
                        <Pill className="w-3 h-3" /> Prescription
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientTimeline;
