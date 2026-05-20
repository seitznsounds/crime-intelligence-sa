"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Mail, Lock, Shield, Chrome, ArrowRight, Loader2, Key, Info, UserPlus, User } from "lucide-react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { signInWithGoogle, signUp } from "@/lib/supabase/auth-actions";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'password' | 'magic'>('password');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
        if (mode === 'register') {
            await signUp({ email, password, full_name: fullName });
            setMessage({ type: 'success', text: "Account created! Please check your email for a verification link." });
        } else {
            if (method === 'password') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                window.location.href = "/";
            } else {
                const { error } = await supabase.auth.signInWithOtp({
                    email,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage({ type: 'success', text: "Magic link dispatched. Check your inbox." });
            }
        }
    } catch (error: any) {
        setMessage({ type: 'error', text: error.message });
    } finally {
        setLoading(false);
    }
  };

  return (
    <PageShell
      title={mode === 'login' ? "Operative Access" : "Node Registration"}
      subtitle={mode === 'login' ? "Establish a secure session to access deep dossiers." : "Join the decentralized intelligence network."}
      badge="Watchdog Authentication"
      badgeColor="blue"
      icon={<Shield className="w-6 h-6 text-accent-blue" />}
      variant="centered"
    >
      <div className="max-w-md mx-auto">
        <div className="glass-card p-8 border-border-glass bg-bg-glass-heavy space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-accent-blue/10 border border-accent-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {mode === 'login' ? <Lock className="w-8 h-8 text-accent-blue" /> : <UserPlus className="w-8 h-8 text-accent-blue" />}
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">{mode === 'login' ? 'Command Login' : 'New Identity'}</h2>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Secure Intelligence Terminal</p>
          </div>

          {message && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-[11px] font-bold uppercase tracking-widest border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-accent-crimson/10 border-accent-crimson/20 text-accent-crimson'}`}
            >
                <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    {message.text}
                </div>
            </motion.div>
          )}

          {/* Social Login - Only for Login mode */}
          {mode === 'login' && (
            <>
              <button 
                onClick={() => signInWithGoogle()}
                className="w-full py-4 bg-white text-black rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl active:scale-95"
              >
                <Chrome className="w-4 h-4" />
                Continue with Google
              </button>

              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-border-glass" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">OR</span>
                <div className="h-[1px] flex-1 bg-border-glass" />
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-background/50 border border-border-glass rounded-xl">
                <button 
                    onClick={() => setMethod('password')}
                    className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${method === 'password' ? 'bg-bg-glass-heavy border border-border-glass text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Credentials
                </button>
                <button 
                    onClick={() => setMethod('magic')}
                    className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${method === 'magic' ? 'bg-bg-glass-heavy border border-border-glass text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Magic Link
                </button>
              </div>
            </>
          )}

          {/* Forms */}
          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'register' && (
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <input 
                            type="text"
                            required
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-background border border-border-glass rounded-xl py-3 pl-10 pr-4 text-sm focus:border-accent-blue outline-none transition-all"
                        />
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <input 
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="operative@crimeintel.co.za"
                        className="w-full bg-background border border-border-glass rounded-xl py-3 pl-10 pr-4 text-sm focus:border-accent-blue outline-none transition-all"
                    />
                </div>
            </div>

            {(method === 'password' || mode === 'register') && (
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secret Key</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <input 
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-background border border-border-glass rounded-xl py-3 pl-10 pr-4 text-sm focus:border-accent-blue outline-none transition-all"
                        />
                    </div>
                </div>
            )}

            <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-accent-blue text-white rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-glow-blue disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                        {mode === 'register' ? 'Deploy Node' : (method === 'password' ? 'Authorize Session' : 'Request Magic Link')}
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
          </form>

          <div className="text-center pt-4">
             <button 
                onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setMessage(null);
                }}
                className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter hover:text-accent-blue transition-colors"
             >
                {mode === 'login' ? "Don't have a terminal identity? Register New Node" : "Already have a node? Authorize Session"}
             </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-40 grayscale">
            <Shield className="w-3 h-3" />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em]">End-to-End Encryption Protocol Active</span>
        </div>
      </div>
    </PageShell>
  );
}
