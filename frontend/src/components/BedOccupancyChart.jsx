import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Removed static data

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-4 rounded-xl border border-white/10 shadow-xl">
        <p className="text-gray-300 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-medium">{entry.name}:</span>
            <span className="text-sm text-white font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BedOccupancyChart = ({ chartData }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorICU" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorEmg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis dataKey="time" stroke="#666" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
        <YAxis stroke="#666" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="ICU" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorICU)" />
        <Area type="monotone" dataKey="Emergency" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorEmg)" />
        <Area type="monotone" dataKey="General" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorGen)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BedOccupancyChart;
