import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Zap, 
  Settings as SettingsIcon, 
  Users, 
  Key, 
  TrendingDown, 
  Search,
  Bell,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatTokens, formatCurrency, timeAgo } from './lib/utils';
import { ModelQuota, OptimizationSuggestion } from './types';

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-white/5 rounded-md", className)} />
);

// Mock Views
const OptimizationEngine = () => {
  const suggestions: OptimizationSuggestion[] = [
    { 
      id: '1', 
      title: 'Route Suggestion', 
      description: "Move 'Summarization' calls to Claude 3 Haiku", 
      savings: 'Save $124.50/mo', 
      action: 'Switch',
      savingsPercent: 45,
      impact: 'high'
    },
    { 
      id: '2', 
      title: 'Latency Optimization', 
      description: "Use Groq for 'Chat' use-case (1.2s avg improvement)", 
      savings: 'Fastest Option', 
      action: 'Apply',
      savingsPercent: 15,
      impact: 'medium'
    },
    { 
      id: '3', 
      title: 'Quota Failover', 
      description: 'Switching fallback to Together AI for Llama models', 
      savings: 'Active Safety', 
      action: 'Enable',
      savingsPercent: 30,
      impact: 'low'
    },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white italic">Optimization suggestions</h1>
        <p className="text-text-dim text-sm max-w-2xl">High-impact route changes identified by the fleet analyzer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map(s => (
          <div key={s.id} className="bg-surface-lite border border-border rounded-lg p-5 flex flex-col gap-3 group hover:border-accent/50 transition-colors relative overflow-hidden">
            {/* Visual Savings Indicator (Background Accent) */}
            <div 
              className="absolute bottom-0 left-0 h-1 bg-status-ok transition-all duration-1000" 
              style={{ width: `${s.savingsPercent}%` }}
            />
            
            <div className="flex justify-between items-start">
              <div className="text-[10px] text-accent uppercase tracking-[1px] font-bold">{s.title}</div>
              {s.impact === 'high' && (
                <div className="flex gap-0.5">
                  <div className="w-1 h-3 bg-status-ok rounded-full" />
                  <div className="w-1 h-3 bg-status-ok rounded-full" />
                  <div className="w-1 h-3 bg-status-ok rounded-full" />
                </div>
              )}
            </div>
            
            <div className="text-sm font-semibold text-white leading-snug">{s.description}</div>
            
            <div className="flex items-center gap-2 mt-auto pt-4">
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle 
                    cx="16" cy="16" r="14" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    className="text-white/5" 
                  />
                  <circle 
                    cx="16" cy="16" r="14" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeDasharray={88}
                    strokeDashoffset={88 - (88 * (s.savingsPercent || 0)) / 100}
                    className="text-status-ok transition-all duration-1000"
                  />
                </svg>
                <TrendingDown className="w-3 h-3 text-status-ok absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <div className="text-xs font-serif italic text-status-ok font-bold">{s.savings}</div>
                <div className="text-[9px] text-text-dim uppercase tracking-widest font-bold">Estimated Savings</div>
              </div>
            </div>

            <button className="text-[10px] uppercase font-bold tracking-widest bg-accent text-white h-8 mt-2 rounded transition-all hover:brightness-110 active:scale-95">Apply Logic</button>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl p-8">
        <h2 className="text-lg font-bold text-white italic mb-6">Historical Savings</h2>
        <div className="h-48 flex items-end gap-2 px-2">
          {[40, 25, 60, 45, 80, 55, 90].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-accent/5 border border-accent/10 rounded-t transition-all group-hover:bg-accent/20" style={{ height: `${h}%` }} />
              <span className="text-[9px] font-mono text-text-dim uppercase tracking-tighter">Apr {i+10}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FailoverConfig = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white italic">Failover Logic</h1>
        <p className="text-text-dim text-sm max-w-2xl">Configure automatic backup routing for your production endpoints when primary quotas are exhausted.</p>
      </div>

      <div className="space-y-4">
        {[
          { name: 'Production Chat', primary: 'GPT-4 Turbo', fallback: ['Claude 3.5 Sonnet', 'Gemini 1.5 Pro'], status: 'Active' },
          { name: 'Background Summaries', primary: 'Claude 3 Opus', fallback: ['GPT-4o-mini'], status: 'Active' },
          { name: 'Vector Search', primary: 'text-embedding-3-small', fallback: ['Cohere v3'], status: 'Warning' },
        ].map((rule, i) => (
          <div key={i} className="p-6 bg-surface border border-border rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-white font-bold">{rule.name}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-accent font-semibold uppercase tracking-wider">{rule.primary}</span>
                <ChevronRight className="w-3 h-3 text-text-dim" />
                {rule.fallback.map((f, fi) => (
                  <React.Fragment key={fi}>
                    <span className="text-text-dim">{f}</span>
                    {fi < rule.fallback.length - 1 && <ChevronRight className="w-3 h-3 text-text-dim opacity-50" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={cn(
                "px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold border",
                rule.status === 'Active' ? 'text-status-ok border-status-ok/20 bg-status-ok/10' : 'text-status-warn border-status-warn/20 bg-status-warn/10'
              )}>
                {rule.status}
              </div>
              <button className="text-[10px] uppercase font-bold tracking-widest bg-surface-lite border border-border h-8 px-4 rounded hover:bg-white hover:text-black transition-all">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const KeysVault = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white italic">Encrypted Vault</h1>
          <p className="text-text-dim text-sm max-w-2xl">Manage your provider credentials with AES-256 isolation.</p>
        </div>
        <button className="text-[10px] uppercase font-bold tracking-widest bg-accent text-white h-10 px-6 rounded-lg hover:brightness-110 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all active:scale-95">+ Add Provider</button>
      </div>

      <div className="space-y-4">
        {[
          { provider: 'OpenAI', key: 'sk-proj-••••••••', updated: '2 days ago', status: 'Valid' },
          { provider: 'Anthropic', key: 'sk-ant-••••••••', updated: '1 month ago', status: 'Valid' },
          { provider: 'Google AI Studio', key: 'AIzaSy••••••••', updated: 'Just now', status: 'Valid' },
          { provider: 'Groq', key: 'gsk-••••••••', updated: '1 week ago', status: 'Invalid' },
        ].map((k, i) => (
          <div key={i} className="p-6 bg-surface border border-border rounded-xl flex items-center justify-between hover:border-accent/40 transition-colors group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-bg border border-border rounded flex items-center justify-center font-bold text-xs text-text-dim group-hover:border-accent/40 transition-colors">
                {k.provider[0]}
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-bold">{k.provider}</h3>
                <div className="font-mono text-[11px] text-text-dim opacity-60 tracking-wider font-bold uppercase">{k.key}</div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-[1px] font-bold text-text-dim opacity-50 mb-1">Last Sync</div>
                <div className="text-xs text-text-dim">{k.updated}</div>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold border",
                k.status === 'Valid' ? 'text-status-ok border-status-ok/20 bg-status-ok/5' : 'text-status-err border-status-err/20 bg-status-err/5'
              )}>
                {k.status}
              </div>
              <button className="text-text-dim hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamManagement = () => {
  const teams = [
    { name: 'Engineering', members: 12, budget: 10000000, used: 8200000, depletion: 'Apr 28' },
    { name: 'Marketing', members: 4, budget: 2000000, used: 400000, depletion: 'May 15' },
    { name: 'Customer Support', members: 25, budget: 5000000, used: 4800000, depletion: 'Apr 22' },
    { name: 'Research', members: 3, budget: -1, used: 1200000, depletion: 'N/A' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans italic">Team Budgets</h1>
          <p className="text-zinc-500 text-sm max-w-2xl">Allocate AI quotas and track consumption across organizational departments.</p>
        </div>
        <button className="text-[10px] uppercase font-bold tracking-widest bg-white text-black h-10 px-6 rounded-lg hover:bg-zinc-200 transition-all">+ New Team</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((t, i) => (
          <div key={i} className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white italic">{t.name}</h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{t.members} Members</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Consumption: {formatTokens(t.used, false)} / {formatTokens(t.budget)}</span>
                <span className="text-zinc-500">{t.depletion !== 'N/A' ? `Est. Depletion: ${t.depletion}` : 'Stable'}</span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                <div 
                  className={cn(
                    "h-full rounded-full bg-white transition-all duration-1000",
                    t.depletion === 'Apr 22' && "bg-red-500"
                  )} 
                  style={{ width: t.budget === -1 ? '20%' : `${(t.used / t.budget) * 100}%` }} 
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white transition-colors">View Members</button>
              <button className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white transition-colors">Adjust Budget</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { GoogleGenAI, Type } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const FleetController = () => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [forceFailover, setForceFailover] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [processStep, setProcessStep] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setResult(null);
    setProcessStep('judging');

    try {
      // 1. Semantic Routing: Judge Difficulty via Gemini
      const judgeResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following prompt and return a JSON object with a single key "difficulty" whose value is either "simple" (creative, casual, basic Q&A) or "complex" (logic, coding, math, reasoning). \n\nPrompt: "${prompt}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              difficulty: { type: Type.STRING, enum: ["simple", "complex"] }
            },
            required: ["difficulty"]
          }
        }
      });
      
      const difficulty = JSON.parse(judgeResponse.text || '{"difficulty":"simple"}').difficulty;
      setProcessStep('routing');

      // 2. Call Fleet Proxy (Backend)
      const fleetRes = await fetch('/api/v1/fleet/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, difficulty, forceFailover })
      });
      
      const data = await fleetRes.json();
      setResult(data);
    } catch (error) {
      console.error("Fleet Execution Error:", error);
    } finally {
      setIsProcessing(false);
      setProcessStep(null);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white italic">Fleet Controller (Edge)</h1>
        <p className="text-text-dim text-sm max-w-2xl">Unified API endpoint with autonomous routing, PII redaction, and error failover.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim opacity-60">System Instruction: Proxy Mode</label>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-dim uppercase font-bold">PII Shield</span>
                      <div className="w-8 h-4 bg-status-ok/20 rounded-full relative p-0.5">
                         <div className="w-3 h-3 bg-status-ok rounded-full ml-auto" />
                      </div>
                   </div>
                   <div className="flex items-center gap-2 cursor-pointer" onClick={() => setForceFailover(!forceFailover)}>
                      <span className="text-[10px] text-text-dim uppercase font-bold">Simulate Fault</span>
                      <div className={cn(
                        "w-8 h-4 rounded-full relative p-0.5 transition-colors",
                        forceFailover ? "bg-status-err/20" : "bg-white/10"
                      )}>
                         <div className={cn(
                           "w-3 h-3 rounded-full transition-all",
                           forceFailover ? "bg-status-err translate-x-4" : "bg-text-dim"
                         )} />
                      </div>
                   </div>
                </div>
             </div>
             <textarea 
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
               placeholder="Enter prompt (e.g. 'Deploy to user@example.com' or 'Write a python script')"
               className="w-full bg-bg border border-border rounded-lg p-4 text-sm text-white focus:outline-none focus:border-accent min-h-[120px] resize-none" 
             />
             <button 
               onClick={handleExecute}
               disabled={isProcessing || !prompt.trim()}
               className="group relative w-full h-12 bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-lg overflow-hidden disabled:opacity-50"
             >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  {isProcessing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {processStep === 'judging' ? 'Judging Intent...' : 'Fleet Routing...'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 fill-current" />
                      Execute via Fleet Proxy
                    </>
                  )}
                </span>
             </button>
          </div>

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface border border-border rounded-xl overflow-hidden"
            >
               <div className="px-6 py-4 border-b border-border bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-status-ok animate-pulse" />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim italic">Response Secured</span>
                  </div>
                  <div className="text-[10px] text-text-dim font-mono">{result.latency} • {result.cost} CREDITS</div>
               </div>
               <div className="p-6 space-y-4">
                  <div className="text-sm text-white leading-relaxed font-serif italic opacity-90">
                     "{result.content}"
                  </div>
                  <div className="flex gap-2">
                     <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[9px] font-bold text-accent uppercase tracking-widest">{result.provider}</span>
                     <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-text-dim uppercase tracking-widest">{result.model}</span>
                     {result.wasRedacted && <span className="px-2 py-0.5 bg-status-warn/10 border border-status-warn/20 rounded text-[9px] font-bold text-status-warn uppercase tracking-widest">PII Redacted</span>}
                  </div>
               </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-4 mb-6 italic opacity-60">Fleet Trace (JSON)</h3>
              <div className="bg-black/40 rounded-lg p-4 font-mono text-[10px] text-accent h-[280px] overflow-auto leading-relaxed border border-white/5">
                 {result ? (
                   result.logs.map((log: string, i: number) => (
                     <div key={i} className="mb-2">
                        <span className="text-text-dim opacity-30">[{new Date().toLocaleTimeString()}]</span> {log}
                     </div>
                   ))
                 ) : (
                   <div className="text-text-dim opacity-30 italic">Fleet idle. Waiting for execution telemetry...</div>
                 )}
              </div>
           </div>
           
           <div className="bg-surface border-border border rounded-xl p-6 space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-dim italic opacity-60">Governance Protocol</h3>
              <div className="space-y-3">
                 {[
                   { label: 'Autonomous Failover', status: 'Enabled' },
                   { label: 'Latency Weighting', status: 'Active' },
                   { label: 'PII Scrubbing', status: 'Verified' },
                   { label: 'Token Vault', status: 'Locked' },
                 ].map((p, i) => (
                   <div key={i} className="flex items-center justify-between bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{p.label}</span>
                      <div className="text-[9px] font-bold text-status-ok uppercase">{p.status}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const usageData = [
  { time: '00:00', tokens: 4000 },
  { time: '04:00', tokens: 3000 },
  { time: '08:00', tokens: 9000 },
  { time: '12:00', tokens: 12000 },
  { time: '16:00', tokens: 15000 },
  { time: '20:00', tokens: 8000 },
  { time: '23:59', tokens: 5000 },
];

import { useQuotas } from './lib/hooks';
import { db } from './lib/firebase';
import { doc as fsDoc, setDoc as fsSetDoc, collection } from 'firebase/firestore';

const Settings = () => {
  const { profile, addLinkedEmail } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'linking' | 'success'>('idle');

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) return;
    setStatus('linking');
    try {
      await addLinkedEmail(newEmail);
      setNewEmail('');
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white italic">Fleet Settings</h1>
        <p className="text-text-dim text-sm">Configure your personal command parameters and linked account access.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white italic">Identity Architecture</h2>
          <div className="p-4 bg-bg border border-border rounded-lg flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-text-dim mb-1">Primary Command ID</div>
              <div className="text-sm font-bold text-white">{profile?.email}</div>
            </div>
            <div className="px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest rounded border border-accent/30">Verified</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white italic">Linked Command Nodes</h2>
            <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest leading-none">{profile?.linkedEmails.length || 0} / 10 Linked</span>
          </div>
          <p className="text-xs text-text-dim italic">Adding secondary emails allows the Fleet Manager to aggregate telemetry across multiple provider registrations linked to your team identity.</p>
          
          <div className="space-y-3">
            {profile?.linkedEmails.map((email, idx) => (
              <div key={idx} className="p-4 bg-surface-lite border border-border rounded-lg flex items-center justify-between group transition-colors hover:border-accent/40">
                <span className="text-sm font-semibold text-white">{email}</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-status-ok rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-[10px] font-bold text-status-ok uppercase tracking-widest opacity-60 group-hover:opacity-100">Synchronized</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddEmail} className="relative group p-1 bg-bg border border-border focus-within:border-accent transition-colors rounded-xl flex gap-1">
             <input 
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="linked.operator@domain.com"
              className="flex-1 bg-transparent border-none outline-none text-sm px-4 h-12 text-white placeholder:text-text-dim/40"
             />
             <button 
              type="submit"
              disabled={status === 'linking'}
              className="bg-accent text-white px-8 rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
             >
                {status === 'linking' ? 'Linking...' : status === 'success' ? 'Synchronized!' : 'Link Node'}
             </button>
          </form>
        </div>
      </div>

      <div className="bg-status-err/5 border border-status-err/20 rounded-xl p-8 space-y-4">
         <h2 className="text-lg font-bold text-status-err italic">Security Protocol</h2>
         <p className="text-xs text-text-dim">Revoking access or terminating the session will instantly disconnect all telemetry relays. This operation is synchronous and permanent.</p>
         <button onClick={() => auth.signOut()} className="text-[10px] uppercase font-bold tracking-widest border border-status-err/40 text-status-err h-11 px-8 rounded-lg hover:bg-status-err hover:text-white transition-all">Terminate All Sessions</button>
      </div>
    </div>
  );
};
const Dashboard = ({ quotas, loading }: { quotas: ModelQuota[], loading: boolean }) => {
  const { profile } = useAuth();
  const [isSimulating, setIsSimulating] = useState(false);

  // Helper to seed data if empty
  const seedData = async () => {
    if (!profile) return;
    const initialQuotas = [
      { model: 'GPT-4o', provider: 'OpenAI', useCase: 'Fleet Orchestration', usedQuota: 8200000, totalQuota: 10000000, status: 'Healthy', costPer1k: 0.03, ownerEmail: profile.email, lastUpdated: new Date().toISOString() },
      { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', useCase: 'Strategic Analysis', usedQuota: 4300000, totalQuota: 5000000, status: 'Warning', costPer1k: 0.015, ownerEmail: profile.email, lastUpdated: new Date().toISOString() },
      { model: 'Gemini 1.5 Pro', provider: 'Google', useCase: 'Multimodal Stream', usedQuota: 450000, totalQuota: 1000000, status: 'Healthy', costPer1k: 0.007, ownerEmail: profile.email, lastUpdated: new Date().toISOString() },
      { model: 'Llama 3 70B', provider: 'Groq', useCase: 'Latency Critical', usedQuota: 120000, totalQuota: 1000000, status: 'Healthy', costPer1k: 0.0007, ownerEmail: profile.email, lastUpdated: new Date().toISOString() },
    ];

    for (const q of initialQuotas) {
      await fsSetDoc(fsDoc(collection(db, 'quotas')), q);
    }
  };

  // Simulate real-time usage updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating && quotas.length > 0) {
      interval = setInterval(async () => {
        const randomQuota = quotas[Math.floor(Math.random() * quotas.length)];
        const increment = Math.floor(Math.random() * 5000) + 1000;
        const newUsed = Math.min(randomQuota.usedQuota + increment, randomQuota.totalQuota);
        const newStatus = (newUsed / randomQuota.totalQuota) > 0.9 ? 'Exhausted' : (newUsed / randomQuota.totalQuota) > 0.8 ? 'Warning' : 'Healthy';
        
        await fsSetDoc(fsDoc(db, 'quotas', randomQuota.id), { 
          usedQuota: newUsed,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, quotas]);

  const displayQuotas = quotas;
  
  interface ProviderStat {
    name: string;
    status: string;
    load: number;
    count: number;
  }

  const providerStats = displayQuotas.reduce((acc, q) => {
    if (!acc[q.provider]) {
      acc[q.provider] = { name: q.provider, status: 'Healthy', load: 0, count: 0 };
    }
    const load = (q.usedQuota / q.totalQuota) * 100;
    acc[q.provider].load += load;
    acc[q.provider].count += 1;
    if (q.status === 'Exhausted') acc[q.provider].status = 'Warning';
    return acc;
  }, {} as Record<string, ProviderStat>);

  const healthProviders = Object.values(providerStats).map((p: ProviderStat) => ({
    ...p,
    load: Math.round(p.load / p.count)
  }));

  const totalTokens = displayQuotas.reduce((acc, q) => acc + q.usedQuota, 0);
  const totalCost = displayQuotas.reduce((acc, q) => acc + (q.usedQuota / 1000) * q.costPer1k, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white italic">Operational Dashboard</h1>
          {profile && (
            <p className="text-[10px] text-text-dim uppercase tracking-widest font-bold mt-1">Viewing telemetry for: {profile.email} {profile.linkedEmails.length > 0 && `(+ ${profile.linkedEmails.length} linked accounts)`}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {displayQuotas.length === 0 && !loading && (
             <button 
              onClick={seedData} 
              className="text-[10px] uppercase font-bold tracking-widest bg-accent/20 text-accent border border-accent/30 h-8 px-4 rounded-lg hover:bg-accent/30 transition-all"
            >
              Seed My Personal Data
            </button>
          )}
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={cn(
              "text-[10px] uppercase font-bold tracking-widest h-8 px-4 rounded-lg border transition-all flex items-center gap-2",
              isSimulating 
                ? "bg-status-ok/20 text-status-ok border-status-ok/30" 
                : "bg-surface-lite text-text-dim border-border hover:border-accent"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full", isSimulating ? "bg-status-ok animate-pulse" : "bg-text-dim")} />
            {isSimulating ? "Link Active" : "Simulate Link"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Fleet Spend', value: formatCurrency(totalCost), icon: Zap, color: 'text-accent' },
          { label: 'Active Models', value: displayQuotas.length.toString(), icon: TrendingDown, color: 'text-status-ok' },
          { label: 'Tokens Pushed', value: formatTokens(totalTokens, false), icon: TrendingDown, color: 'text-status-warn' },
          { label: 'Integrity Grade', value: 'A+', icon: ShieldAlert, color: 'text-accent' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-surface border border-border rounded-xl transition-all hover:border-accent/40 group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-text-dim uppercase tracking-[1.5px] opacity-60">{stat.label}</span>
              <stat.icon className={cn("w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity", stat.color)} />
            </div>
            {loading ? (
              <Skeleton className="h-9 w-2/3" />
            ) : (
              <div className="text-3xl font-serif italic text-white tracking-tighter">{stat.value}</div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-white italic">Global Consumption</h2>
              <p className="text-[10px] text-text-dim uppercase tracking-widest font-bold opacity-60">Real-time Telemetry Subscription</p>
            </div>
            <div className="flex gap-1 bg-bg border border-border p-1 rounded-lg">
              <div className="px-4 py-1.5 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-md cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)]">Live</div>
              <div className="px-4 py-1.5 text-text-dim text-[10px] font-bold uppercase tracking-widest rounded-md cursor-pointer hover:text-white transition-colors">History</div>
            </div>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#52525b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => `${val/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: '12px', fontSize: '10px' }}
                  itemStyle={{ color: '#ffffff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#6366F1" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#usageGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8 space-y-6">
          <h2 className="text-lg font-bold text-white italic">Provider Health</h2>
          <div className="space-y-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
              ))
            ) : healthProviders.length === 0 ? (
              <div className="text-center py-10">
                 <p className="text-xs text-text-dim italic font-serif opacity-50">No provider data available. Seed the link to begin telemetry.</p>
              </div>
            ) : healthProviders.map((p, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold">
                  <span className="text-text-dim">{p.name}</span>
                  <span className={cn(
                    p.status === 'Healthy' ? 'text-status-ok' : 'text-status-err'
                  )}>{p.status}</span>
                </div>
                <div className="h-1 w-full bg-bg rounded-full overflow-hidden border border-border">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      p.status === 'Healthy' ? 'bg-accent' : 'bg-status-err'
                    )}
                    style={{ width: `${p.load}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-[10px] uppercase font-bold tracking-widest border border-border h-11 rounded-lg hover:border-white transition-all active:scale-95">
            Full Health Report
          </button>
        </div>
      </div>

      <div className="card table-container bg-surface border border-border rounded-xl overflow-hidden p-0 flex flex-col">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-white italic">Model Inventory</h2>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-status-ok animate-pulse" />
               <span className="text-[10px] uppercase tracking-[1px] font-bold text-text-dim opacity-50 italic">Live Subscription Active</span>
            </div>
          </div>
          <div className="p-8 pb-4 grid grid-cols-[1.5fr_1fr_1fr_1fr] text-[10px] uppercase tracking-[2px] font-bold text-text-dim border-b border-border">
            <div>Model & Provider</div>
            <div>Quota Consumption</div>
            <div>Cost / 1M Tokens</div>
            <div className="text-right">Connectivity Status</div>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
               [1, 2, 3, 4].map(i => (
                 <div key={i} className="p-8 grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center gap-8">
                    <div className="space-y-2">
                       <Skeleton className="h-5 w-32" />
                       <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="space-y-2">
                       <Skeleton className="h-3 w-24" />
                       <Skeleton className="h-1.5 w-32" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                    <div className="flex justify-end">
                       <Skeleton className="h-4 w-20" />
                    </div>
                 </div>
               ))
            ) : displayQuotas.length === 0 ? (
               <div className="p-16 text-center text-text-dim font-serif italic opacity-50">
                  Fleet command is empty. Seed live data to initialize telemetry feed.
               </div>
            ) : displayQuotas.map((q) => (
              <div key={q.id} className="p-8 grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center text-sm group hover:bg-surface-lite transition-colors">
                <div>
                   <div className="font-bold text-white mb-0.5">{q.model}</div>
                   <div className="text-[10px] text-text-dim font-bold uppercase tracking-wider flex items-center gap-2">
                     {q.provider}
                     <div className="w-1 h-1 bg-accent/40 rounded-full" />
                     <span className="normal-case font-normal lowercase">{timeAgo(q.lastUpdated || new Date())}</span>
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-text-dim font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                      {Math.round((q.usedQuota / q.totalQuota) * 100)}% ({formatTokens(q.usedQuota, false)} / {formatTokens(q.totalQuota, false)})
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping opacity-20" />
                   </div>
                   <div className="h-1 w-32 bg-bg border border-border overflow-hidden rounded-full">
                      <div 
                        className={cn("h-full transition-all duration-1000", 
                          q.status === 'Healthy' ? 'bg-status-ok' : q.status === 'Warning' ? 'bg-status-warn' : 'bg-status-err'
                        )}
                        style={{ width: `${(q.usedQuota / q.totalQuota) * 100}%` }}
                      />
                   </div>
                </div>
                <div className="font-serif italic text-text-dim">{formatCurrency(q.costPer1k)} / 1K</div>
                <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider">
                   <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]", 
                     q.status === 'Healthy' ? 'text-status-ok bg-status-ok' : q.status === 'Warning' ? 'text-status-warn bg-status-warn' : 'text-status-err bg-status-err'
                   )} />
                   <span className={cn(
                     q.status === 'Healthy' ? 'text-status-ok' : q.status === 'Warning' ? 'text-status-warn' : 'text-status-err'
                   )}>{q.status}</span>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

import { AuthProvider, useAuth } from './lib/AuthContext';
import { signInWithGoogle, auth } from './lib/firebase';

const Login = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request') {
        console.warn("Sign-in popup already in progress");
        return;
      }
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled. Please try again.");
      } else {
        setError(err.message || "An unexpected error occurred during sign-in.");
      }
      console.error("Sign-in error:", err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 selection:bg-accent/30 selection:text-white">
      <div className="w-full max-w-md space-y-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] animate-pulse" />
            <span className="text-sm font-bold tracking-[8px] text-white uppercase">AI_FLEET_SYSTEM</span>
          </div>
          <h1 className="text-4xl font-serif italic text-white tracking-tight">Access Mission Control</h1>
          <p className="text-text-dim text-sm tracking-wide">Authenticate to manage your global AI provider fleet.</p>
        </div>

        <div className="bg-surface border border-border p-10 rounded-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
          
          <button 
            onClick={handleSignIn}
            disabled={isSigningIn}
            className={cn(
              "w-full bg-white text-black h-14 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
              isSigningIn ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:brightness-110"
            )}
          >
            {isSigningIn ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {isSigningIn ? 'Processing...' : 'Sign in with ID'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-status-err/10 border border-status-err/20 rounded-lg text-status-err text-xs text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-border flex flex-col gap-4">
             <div className="flex items-center gap-3 text-text-dim/60">
                <div className="w-1 h-1 bg-accent/40 rounded-full" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Biometric Bypass Offline</span>
             </div>
             <div className="flex items-center gap-3 text-text-dim/60">
                <div className="w-1 h-1 bg-accent/40 rounded-full" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Hardware Key Restricted</span>
             </div>
          </div>
        </div>

        <div className="text-center">
           <span className="text-[10px] uppercase tracking-[3px] font-bold text-text-dim/30">Secured by AI_FLEET_CORE</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, profile, loading: authLoading } = useAuth();
  const { quotas, loading: quotasLoading, error: quotasError } = useQuotas();
  const [activeTab, setActiveTab] = useState('dashboard');

  const isInitialQuotasLoading = quotasLoading && quotas.length === 0;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-2 border-border border-t-accent rounded-full animate-spin mx-auto" />
          <div className="text-[10px] uppercase tracking-[2px] font-bold text-text-dim/60 animate-pulse">Establishing link with fleet command...</div>
        </div>
      </div>
    );
  }

  const displayQuotas = quotas;
  const totalTokens = displayQuotas.reduce((acc, q) => acc + q.usedQuota, 0);
  const totalCost = displayQuotas.reduce((acc, q) => acc + (q.usedQuota / 1000) * q.costPer1k, 0);

  if (!user) return <Login />;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'controller', label: 'Fleet Controller', icon: Zap },
    { id: 'keys', label: 'Provider Vault', icon: Key },
    { id: 'failover', label: 'Failover Rules', icon: ShieldAlert },
    { id: 'teams', label: 'Team Budgets', icon: Users },
    { id: 'optimizations', label: 'Analytics', icon: TrendingDown },
    { id: 'settings', label: 'Fleet Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-bg text-[#EDEDED] flex">
      {/* Sidebar */}
      <aside className="w-[220px] bg-bg border-r border-border flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            <span className="text-[11px] font-bold tracking-[4px] text-white">FLEET_MGR</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 py-3 text-[13px] transition-all group",
                  activeTab === item.id 
                    ? "text-white font-semibold" 
                    : "text-text-dim hover:text-white"
                )}
              >
                <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-accent" : "text-text-dim group-hover:text-white")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-border">
           <div className="text-[10px] font-bold text-text-dim/40 uppercase tracking-widest mb-4">Core Engine</div>
           <div className="text-[11px] text-text-dim flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-status-ok rounded-full" />
              v2.4.0-stable
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[220px] flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-border flex items-center justify-between px-10 bg-bg/80 backdrop-blur-xl sticky top-0 z-40">
           <div className="flex gap-10">
              <div className="stat-box">
                 <div className="text-[10px] uppercase tracking-[1px] text-text-dim mb-1 font-bold">Projected Spend</div>
                 {isInitialQuotasLoading ? <Skeleton className="h-7 w-20" /> : <div className="font-serif italic text-2xl text-white">{formatCurrency(totalCost)}</div>}
              </div>
              <div className="stat-box">
                 <div className="text-[10px] uppercase tracking-[1px] text-text-dim mb-1 font-bold">Active Models</div>
                 {isInitialQuotasLoading ? <Skeleton className="h-7 w-8" /> : <div className="font-serif italic text-2xl text-white">{displayQuotas.length}</div>}
              </div>
              <div className="stat-box">
                 <div className="text-[10px] uppercase tracking-[1px] text-text-dim mb-1 font-bold">Tokens Pushed</div>
                 {isInitialQuotasLoading ? <Skeleton className="h-7 w-24" /> : <div className="font-serif italic text-2xl text-white">{formatTokens(totalTokens, false)}</div>}
              </div>
              <div className="stat-box">
                 <div className="text-[10px] uppercase tracking-[1px] text-text-dim mb-1 font-bold">Linked Nodes</div>
                 <div className="font-serif italic text-2xl text-white">{(profile?.linkedEmails.length || 0) + 1}</div>
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="bg-accent text-white h-10 px-6 rounded-lg text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(99,102,241,0.1)]">Deploy Model</button>
              
              <div className="flex items-center gap-3 border-l border-border pl-6 cursor-pointer group" onClick={() => auth.signOut()}>
                <div className="text-right">
                  <div className="text-sm font-bold text-white group-hover:text-accent transition-colors truncate max-w-[120px]">{user.displayName || user.email}</div>
                  <div className="text-[10px] font-bold text-text-dim/60 group-hover:text-status-err transition-colors uppercase tracking-wider">Log Out</div>
                </div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center overflow-hidden transition-all group-hover:border-accent">
                  {user.photoURL ? <img src={user.photoURL} alt="Avatar" referrerPolicy="no-referrer" /> : <div className="w-full h-full bg-surface-lite flex items-center justify-center font-bold text-sm text-accent">{user.displayName?.[0] || 'U'}</div>}
                </div>
              </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-10 max-w-7xl">
          {activeTab === 'dashboard' && <Dashboard quotas={quotas} loading={quotasLoading} />}
          {activeTab === 'controller' && <FleetController />}
          {activeTab === 'optimizations' && <OptimizationEngine />}
          {activeTab === 'failover' && <FailoverConfig />}
          {activeTab === 'keys' && <KeysVault />}
          {activeTab === 'teams' && <TeamManagement />}
          {activeTab === 'settings' && <Settings />}
          {!['dashboard', 'controller', 'optimizations', 'failover', 'keys', 'teams', 'settings'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
              <AlertCircle className="w-12 h-12 text-text-dim opacity-20" />
              <div className="text-[11px] uppercase tracking-[3px] font-bold text-text-dim italic">Module offline</div>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="text-[10px] uppercase font-bold tracking-widest border border-border h-11 px-8 rounded-lg hover:border-white transition-all"
              >
                Return to Command
              </button>
            </div>
          )}
        </div>

        {/* Alert Bar */}
        <AnimatePresence>
          {quotasError && (
            <motion.div 
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg bg-surface border border-status-err/30 rounded-xl p-4 z-[100] shadow-2xl backdrop-blur-xl"
            >
              <div className="flex gap-4">
                <AlertCircle className="w-5 h-5 text-status-err shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-status-err uppercase tracking-widest">Telemetry Connection Fault</div>
                  <div className="text-xs text-text-dim/80 font-mono leading-relaxed bg-black/20 p-2 rounded border border-white/5 overflow-auto max-h-32">
                    {quotasError}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-0 left-[220px] right-0 h-10 bg-status-err text-white flex items-center justify-center text-[11px] font-bold uppercase tracking-wider z-50 animate-in slide-in-from-bottom-full duration-500">
           CRITICAL: ANTHROPIC QUOTA EXHAUSTED FOR 'SUMMARIZATION' — AUTOMATIC FAILOVER TO CLAUDE-3-HAIKU ACTIVE
        </div>
      </main>
    </div>
  );
}
