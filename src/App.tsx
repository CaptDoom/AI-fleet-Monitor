import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Zap, 
  Settings as SettingsIcon, 
  Users, 
  Key, 
  TrendingDown, 
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatTokens, formatCurrency } from './lib/utils';
import { ModelQuota } from './types';
import { useAuth, AuthProvider } from './lib/AuthContext';
import { useQuotas } from './lib/hooks';
import { auth } from './lib/firebase';
import { executeFleetAction, judgeDifficulty } from './services/aiService';
import { Dashboard } from './components/Dashboard';
import { 
  FailoverConfig, 
  KeysVault, 
  TeamManagement, 
  Settings,
  OptimizationEngine
} from './components/Views';

const Skeleton = ({ className }: { className?: string, key?: any }) => (
  <div className={cn("animate-pulse bg-white/5 rounded-md", className)} />
);

const Login = () => {
  const { signInWithGoogle, error: authContextError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || authContextError?.message;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError(err.message || 'Identity verification failed');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-bg to-bg overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="w-full max-w-lg space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-accent/20 rounded-full border border-accent/40 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.2)]">
               <Zap className="w-8 h-8 text-accent fill-accent animate-pulse" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-sans font-bold tracking-[8px] text-white uppercase italic">Fleet_Command</h1>
          <p className="text-[10px] uppercase tracking-[4px] text-text-dim font-bold opacity-60">Autonomous AI Infrastructure v2.4</p>
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
            {isSigningIn ? 'Verifying...' : 'Sign in with Global ID'}
          </button>

          {error && <div className="mt-4 p-3 bg-status-err/10 border border-status-err/20 rounded-lg text-status-err text-[10px] uppercase font-bold text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
};

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
      const difficulty = await judgeDifficulty(prompt);
      setProcessStep('dispatching');
      const data = await executeFleetAction(prompt, difficulty, forceFailover);
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
        <p className="text-text-dim text-sm max-w-2xl">Unified client-side orchestration with failover circuitry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim opacity-60">System Instruction</label>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 cursor-pointer" onClick={() => setForceFailover(!forceFailover)}>
                      <span className="text-[10px] text-text-dim uppercase font-bold">Trigger Fault</span>
                      <div className={cn("w-8 h-4 rounded-full relative p-0.5 transition-colors", forceFailover ? "bg-status-err/20" : "bg-white/10")}>
                         <div className={cn("w-3 h-3 rounded-full transition-all", forceFailover ? "bg-status-err translate-x-4" : "bg-text-dim")} />
                      </div>
                   </div>
                </div>
             </div>
             <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter dispatch command..." className="w-full bg-bg border border-border rounded-lg p-4 text-sm text-white focus:outline-none focus:border-accent min-h-[120px] resize-none" />
             <button onClick={handleExecute} disabled={isProcessing || !prompt.trim()} className="relative w-full h-12 bg-accent text-white font-bold text-xs uppercase tracking-widest rounded-lg disabled:opacity-50">
                {isProcessing ? 'Fleet Processing...' : <span className="flex items-center justify-center gap-2"><Zap className="w-3 h-3 fill-current" /> Dispatch Request</span>}
             </button>
          </div>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-xl overflow-hidden shadow-2xl">
               <div className="px-6 py-4 border-b border-border bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={cn("w-2 h-2 rounded-full", result.success ? "bg-status-ok animate-pulse" : "bg-status-err")} />
                     <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim italic">Execution Verified</span>
                  </div>
                  <div className="text-[10px] text-text-dim font-mono">{result.latency} • {result.cost} CREDITS</div>
               </div>
               <div className="p-6 space-y-4">
                  <div className="text-sm text-white leading-relaxed font-serif italic opacity-90 leading-7">"{result.content}"</div>
                  <div className="flex flex-wrap gap-2 pt-2">
                     <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[9px] font-bold text-accent uppercase">{result.provider}</span>
                     <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-text-dim uppercase">{result.model}</span>
                     {result.wasRedacted && <span className="px-2 py-0.5 bg-status-warn/10 border border-status-warn/20 rounded text-[9px] font-bold text-status-warn uppercase">PII Redacted</span>}
                  </div>
               </div>
            </motion.div>
          )}
        </div>
        <div className="bg-surface border border-border rounded-xl p-6 h-fit">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-6 italic opacity-60">Trace Stream</h3>
           <div className="bg-black/40 rounded-lg p-4 font-mono text-[10px] text-accent h-[300px] overflow-auto border border-white/5">
              {result ? result.logs.map((log: any, i: number) => <div key={i} className="mb-2 whitespace-pre-wrap">{log}</div>) : <div className="text-text-dim opacity-30 italic">Trace offline...</div>}
           </div>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const { user, profile, loading: authLoading } = useAuth();
  const { quotas, loading: quotasLoading, error: quotasError } = useQuotas();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (authLoading) return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Login />;

  const totalCost = quotas.reduce((acc, q) => acc + (q.usedQuota / 1000) * q.costPer1k, 0);

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
      <aside className="w-[200px] bg-bg border-r border-border flex flex-col fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span className="text-[10px] font-bold tracking-[4px] text-white">FLEET_MGR</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("w-full flex items-center gap-3 py-3 text-[12px] transition-all", activeTab === item.id ? "text-white font-bold" : "text-text-dim hover:text-white")}>
                <item.icon className={cn("w-3.5 h-3.5", activeTab === item.id ? "text-accent" : "text-text-dim")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 ml-[200px] flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-10 bg-bg sticky top-0 z-40">
           <div className="flex gap-8">
              <div className="stat-box">
                 <div className="text-[9px] uppercase tracking-widest text-text-dim font-bold">Month Spend</div>
                 <div className="font-serif italic text-lg text-white">{formatCurrency(totalCost)}</div>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <button className="text-[10px] font-bold text-text-dim uppercase tracking-widest" onClick={() => auth.signOut()}>Log Out</button>
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="" /> : <div className="text-[10px] font-bold text-accent">U</div>}
              </div>
           </div>
        </header>

        <div className="p-10 max-w-6xl mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard quotas={quotas} loading={quotasLoading} />}
          {activeTab === 'controller' && <FleetController />}
          {activeTab === 'optimizations' && <OptimizationEngine />}
          {activeTab === 'failover' && <FailoverConfig />}
          {activeTab === 'keys' && <KeysVault />}
          {activeTab === 'teams' && <TeamManagement />}
          {activeTab === 'settings' && <Settings />}
        </div>

        {quotasError && <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-surface border border-status-err/30 rounded-lg p-3 text-status-err text-[10px] uppercase font-bold">{quotasError}</div>}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
