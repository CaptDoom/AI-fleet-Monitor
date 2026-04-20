import React from 'react';
import { 
  ShieldAlert, 
  Settings as SettingsIcon, 
  Users, 
  Key, 
  TrendingDown, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { OptimizationSuggestion } from '../types';

export const OptimizationEngine = () => {
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
                    <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                    <circle 
                      cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="3" 
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
      </div>
    );
};

export const FailoverConfig = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white italic">Failover Logic</h1>
        <p className="text-text-dim text-sm max-w-2xl">Configure automatic backup routing for your production endpoints.</p>
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

export const KeysVault = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white italic">Encrypted Vault</h1>
          <p className="text-text-dim text-sm max-w-2xl">Manage your provider credentials with AES-256 isolation.</p>
        </div>
        <button className="text-[10px] uppercase font-bold tracking-widest bg-accent text-white h-10 px-6 rounded-lg hover:brightness-110 transition-all">+ Add Provider</button>
      </div>
      <div className="space-y-4">
        {[
          { provider: 'OpenAI', key: 'sk-proj-••••••••', updated: '2 days ago', status: 'Valid' },
          { provider: 'Anthropic', key: 'sk-ant-••••••••', updated: '1 month ago', status: 'Valid' },
          { provider: 'Google AI Studio', key: 'AIzaSy••••••••', updated: 'Just now', status: 'Valid' },
        ].map((k, i) => (
          <div key={i} className="p-6 bg-surface border border-border rounded-xl flex items-center justify-between hover:border-accent/40 transition-colors group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-bg border border-border rounded flex items-center justify-center font-bold text-xs text-text-dim group-hover:border-accent/40 transition-colors">{k.provider[0]}</div>
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
              <div className={cn("px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold border", k.status === 'Valid' ? 'text-status-ok border-status-ok/20 bg-status-ok/5' : 'text-status-err border-status-err/20 bg-status-err/5')}>
                {k.status}
              </div>
              <button className="text-text-dim hover:text-white transition-colors"><SettingsIcon className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
);

export const TeamManagement = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans italic">Team Budgets</h1>
        <button className="text-[10px] uppercase font-bold tracking-widest bg-white text-black h-10 px-6 rounded-lg hover:bg-zinc-200 transition-all">+ New Team</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: 'Engineering', members: 12, budget: 10000000, used: 8200000, depletion: 'Apr 28' },
          { name: 'Marketing', members: 4, budget: 2000000, used: 400000, depletion: 'May 15' },
        ].map((t, i) => (
          <div key={i} className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white italic">{t.name}</h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">{t.members} Members</span>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 tracking-widest"><span>Usage</span><span>{Math.round((t.used/t.budget)*100)}%</span></div>
               <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${(t.used/t.budget)*100}%` }} />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
);

export const Settings = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <h1 className="text-2xl font-bold tracking-tight text-white italic">Fleet Settings</h1>
      <div className="max-w-xl space-y-6">
        <div className="p-6 bg-surface border border-border rounded-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white">System Defaults</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-xs text-text-dim">Auto-Failover Threshold</span><input type="text" defaultValue="3 Retries" className="bg-bg border border-border text-xs p-2 rounded w-24 text-right h-8" /></div>
            <div className="flex items-center justify-between"><span className="text-xs text-text-dim">Governance Policy</span><select className="bg-bg border border-border text-xs p-2 rounded h-8"><option>Strict (Block)</option><option>Monitor Only</option></select></div>
          </div>
        </div>
      </div>
    </div>
);
