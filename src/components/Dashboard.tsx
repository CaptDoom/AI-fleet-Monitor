import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Activity, TrendingUp, TrendingDown, Clock, Zap, ShieldCheck, Database } from 'lucide-react';
import { ModelQuota } from '../types';
import { cn, formatCurrency, formatTokens } from '../lib/utils';
import { motion } from 'motion/react';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-white/5 rounded-md", className)} />
);

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

const mockTimeSeries = [
  { time: '00:00', tokens: 4000, cost: 2.4 },
  { time: '04:00', tokens: 3000, cost: 1.8 },
  { time: '08:00', tokens: 8000, cost: 4.8 },
  { time: '12:00', tokens: 12000, cost: 7.2 },
  { time: '16:00', tokens: 9000, cost: 5.4 },
  { time: '20:00', tokens: 5000, cost: 3.0 },
  { time: '23:59', tokens: 4500, cost: 2.7 },
];

const distributionData = [
  { name: 'OpenAI', value: 45 },
  { name: 'Anthropic', value: 30 },
  { name: 'Google', value: 15 },
  { name: 'Meta', value: 10 },
];

const StatCard = ({ title, value, subValue, icon: Icon, trend, colorClass }: any) => (
  <div className="bg-surface border border-border p-6 rounded-xl hover:border-accent/40 transition-all group overflow-hidden relative">
    <div className={cn("absolute bottom-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity", colorClass)}>
      <Icon className="w-16 h-16" />
    </div>
    <div className="flex flex-col gap-1">
      <span className="text-[10px] text-text-dim uppercase tracking-widest font-bold opacity-60 italic">{title}</span>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        <span className={cn("text-[10px] font-bold uppercase", trend > 0 ? "text-status-ok" : "text-status-err")}>
          {trend > 0 ? <TrendingUp className="inline w-3 h-3 mr-0.5" /> : <TrendingDown className="inline w-3 h-3 mr-0.5" />}
          {Math.abs(trend)}%
        </span>
        <span className="text-[10px] text-text-dim font-bold opacity-40 uppercase tracking-widest">{subValue}</span>
      </div>
    </div>
  </div>
);

export const Dashboard = ({ quotas, loading }: { quotas: ModelQuota[], loading: boolean }) => {
  const totalTokens = quotas.reduce((acc, q) => acc + q.usedQuota, 0);
  const totalCost = totalTokens * 0.00002; // Roughly scaled for demo

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white italic">Operational Overview</h1>
        <p className="text-text-dim text-sm max-w-2xl">Real-time heuristics and routing distribution across active AI clusters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Consolidated Usage" 
          value={formatTokens(totalTokens)} 
          subValue="vs last 24h" 
          icon={Database} 
          trend={12.4} 
          colorClass="text-accent"
        />
        <StatCard 
          title="Total Infrastructure Cost" 
          value={formatCurrency(totalCost)} 
          subValue="Projected $1,240/mo" 
          icon={TrendingUp} 
          trend={-2.1} 
          colorClass="text-status-ok"
        />
        <StatCard 
          title="Health Index" 
          value="99.8%" 
          subValue="All nodes active" 
          icon={ShieldCheck} 
          trend={0.12} 
          colorClass="text-status-ok"
        />
        <StatCard 
          title="Avg Latency" 
          value="452ms" 
          subValue="Regional optimization active" 
          icon={Clock} 
          trend={-15.3} 
          colorClass="text-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-8 relative overflow-hidden flex flex-col gap-6">
          <div className="flex items-center justify-between">
             <h3 className="text-[10px] uppercase font-bold tracking-[3px] text-white italic opacity-80">Telemetry_Stream</h3>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /><span className="text-[10px] text-text-dim uppercase font-bold">Tokens</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-white/10" /><span className="text-[10px] text-text-dim uppercase font-bold">Latency</span></div>
             </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTimeSeries}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="time" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff40' }}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: '#ffffff40' }}
                  tickFormatter={tick => `${tick/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#usageGradient)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 space-y-8 flex flex-col justify-between">
          <h3 className="text-[10px] uppercase font-bold tracking-[3px] text-white italic opacity-80">Cost_Distribution</h3>
          
          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-xl font-bold text-white italic">4</div>
              <div className="text-[8px] uppercase font-bold text-text-dim tracking-widest opacity-60">Providers</div>
            </div>
          </div>

          <div className="space-y-3">
             {distributionData.map((p, i) => (
               <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                     <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                     <span className="text-[10px] uppercase font-bold text-text-dim group-hover:text-white transition-colors tracking-widest">{p.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-text-dim/60 font-bold">{p.value}%</div>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8 space-y-6">
        <h3 className="text-[10px] uppercase font-bold tracking-[3px] text-white italic opacity-80">Provider_Integrity_Monitor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotas.map(q => (
             <div key={q.id} className="p-4 rounded-lg bg-bg/50 border border-border/50 hover:border-accent/40 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[9px] uppercase font-bold text-text-dim/60 tracking-widest leading-none mb-1">{q.provider}</div>
                    <div className="text-xs font-bold text-white tracking-tight leading-none">{q.model}</div>
                  </div>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold border",
                    q.status === 'Healthy' ? 'text-status-ok border-status-ok/20 bg-status-ok/5' : 'text-status-warn border-status-err/20 bg-status-err/5'
                  )}>
                    {q.status}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] uppercase font-bold text-text-dim/40 italic">
                    <span>Quota_Utilization</span>
                    <span>{Math.round((q.usedQuota / q.totalQuota) * 100)}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", q.usedQuota / q.totalQuota > 0.8 ? "bg-status-err" : "bg-accent")} style={{ width: `${(q.usedQuota / q.totalQuota) * 100}%` }} />
                  </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
