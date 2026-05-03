import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Heart, Zap } from 'lucide-react';
import StatsWidget from './StatsWidget';

const healthData = [
  { day: 'Mon', hr: 72, score: 85 },
  { day: 'Tue', hr: 75, score: 88 },
  { day: 'Wed', hr: 82, score: 84 },
  { day: 'Thu', hr: 70, score: 90 },
  { day: 'Fri', hr: 68, score: 92 },
  { day: 'Sat', hr: 74, score: 89 },
  { day: 'Sun', hr: 71, score: 95 },
];

const PatientAnalytics = () => {
  return (
    <div className="glass-card p-6 rounded-3xl h-full flex flex-col">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-[#10b981]" /> Vital Insights
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatsWidget 
          title="Heart Rate" 
          value={73} 
          icon={<Heart className="w-5 h-5" />} 
          color="#ef4444" 
        />
        <StatsWidget 
          title="Health Score" 
          value={89} 
          total={100} 
          icon={<Zap className="w-5 h-5" />} 
          color="#10b981" 
        />
      </div>

      <div className="flex-1 min-h-[160px]">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Activity Velocity</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={healthData}>
            <defs>
              <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
              itemStyle={{ color: '#10b981' }}
            />
            <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorHr)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PatientAnalytics;
