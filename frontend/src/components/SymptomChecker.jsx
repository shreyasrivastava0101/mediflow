import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Stethoscope, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import api from '../services/api';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState('1-3 days');
  const [age, setAge] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const symArray = symptoms.split(',').map(s => s.trim()).filter(s => s);
      const res = await api.post('/triage', { symptoms: symArray, severity, duration, age });
      setResult(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-3xl h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#0ea5e9]/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-[#0ea5e9]" />
        </div>
        <div>
          <h2 className="text-xl font-bold">AI Symptom Checker</h2>
          <p className="text-sm text-gray-400">Powered by Mediflow Intelligence</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleAnalyze} 
            className="flex-1 flex flex-col space-y-4 relative z-10"
          >
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Describe symptoms (comma separated)</label>
              <input 
                type="text" 
                required
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="e.g. Chest pain, Fever, Headache"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-[#0ea5e9] outline-none transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Age</label>
                <input 
                  type="number" 
                  min="0"
                  max="120"
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 0)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-[#0ea5e9] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Duration</label>
                <select 
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:border-[#0ea5e9] outline-none transition-colors appearance-none"
                >
                  <option>&lt; 24 hours</option>
                  <option>1-3 days</option>
                  <option>1 week</option>
                  <option>&gt; 1 week</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                <span>Severity (1-10)</span>
                <span className="text-white font-bold">{severity}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={severity}
                onChange={e => setSeverity(parseInt(e.target.value))}
                className="w-full accent-[#0ea5e9]"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !symptoms}
              className="mt-auto w-full bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6] text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? 'Analyzing Neural Patterns...' : 'Analyze Symptoms'} <ChevronRight className="w-5 h-5" />
            </button>
          </motion.form>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col relative z-10"
          >
            <div className={`p-4 rounded-xl border mb-4 ${
              result.urgency === 'Critical' ? 'bg-red-500/10 border-red-500/30' :
              result.urgency === 'High' ? 'bg-orange-500/10 border-orange-500/30' :
              result.urgency === 'Medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-green-500/10 border-green-500/30'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`font-bold uppercase text-xs px-2 py-1 rounded ${
                  result.urgency === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  result.urgency === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  result.urgency === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {result.urgency} Urgency
                </span>
                <span className="text-[#0ea5e9] font-mono text-sm">{result.confidence}% Match</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{result.specialist} Recommended</h3>
              <p className="text-sm text-gray-300">{result.explanation}</p>
            </div>

            <div className="mt-auto flex gap-3">
              <button 
                onClick={() => setResult(null)}
                className="flex-1 glass border border-white/10 py-3 rounded-xl font-medium hover:bg-white/5 transition-colors text-center"
              >
                Reset
              </button>
              <button 
                onClick={() => {
                  // Dispatch custom event to trigger Doctor Finder tab with specialist
                  window.dispatchEvent(new CustomEvent('find-specialist', { detail: result.specialist }));
                }}
                className="flex-[2] bg-[#8b5cf6] hover:bg-[#7c3aed] py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all flex justify-center items-center gap-2"
              >
                <Stethoscope className="w-5 h-5" /> Find Doctor
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SymptomChecker;
