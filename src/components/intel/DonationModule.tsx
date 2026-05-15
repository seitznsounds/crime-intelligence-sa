'use client';

import React, { useState, useEffect } from 'react';
import { PaystackButton } from 'react-paystack';
import { 
  Heart, 
  Coffee, 
  Target, 
  Zap, 
  ChevronRight, 
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { getDonationStats } from './actions';

const PRESET_AMOUNTS = [50, 100, 250, 500];

export const DonationModule = () => {
  const [purpose, setPurpose] = useState<'project' | 'creator'>('project');
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [stats, setDonationStats] = useState({ totalZar: 0, count: 0 });
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  useEffect(() => {
    setMounted(true);
    async function loadStats() {
      const data = await getDonationStats();
      setDonationStats(data);
    }
    loadStats();
  }, [success]);

  if (!mounted) return (
    <div className="glass-card border border-white/10 rounded-2xl bg-background/80 backdrop-blur-md h-[400px] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
    </div>
  );

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;
  
  const componentProps = {
    email,
    amount: finalAmount * 100, // Paystack expects cents
    metadata: {
      purpose,
      custom_fields: [
        {
          display_name: "Donation Purpose",
          variable_name: "purpose",
          value: purpose
        }
      ]
    },
    publicKey,
    text: "Initialize Secure Contribution",
    onSuccess: (reference: any) => {
      console.log("Donation Successful:", reference);
      setSuccess(true);
    },
    onClose: () => console.log("Transaction Closed"),
  };

  if (success) {
    return (
      <div className="glass-card p-10 border-emerald-500/30 bg-emerald-500/5 text-center space-y-4 rounded-2xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-xl font-black uppercase tracking-tighter italic text-foreground">Contribution Verified</h3>
        <p className="text-sm text-muted-foreground">Thank you for weaponizing transparency. Your support keeps the system live.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 px-6 py-2 rounded-full border border-border-glass text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-bg-glass transition-all"
        >
          Make Another Contribution
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card border border-border-glass rounded-2xl bg-background/80 backdrop-blur-md overflow-hidden">
      {/* HEADER: Counter */}
      <div className="p-6 border-b border-border-glass bg-bg-glass flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-blue">
            <TrendingUp className="w-4 h-4" />
            <h4 className="text-[12px] font-black uppercase tracking-widest italic text-foreground">Project Fuel Gauge</h4>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono">Transparency Maintenance Fund</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black font-mono tracking-tighter text-foreground">R {stats.totalZar.toLocaleString()}</p>
          <p className="text-[8px] text-accent-blue font-bold uppercase tracking-tighter">{stats.count} Verified Contributions</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PURPOSE TOGGLE */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-bg-glass rounded-xl border border-border-glass">
          <button 
            onClick={() => setPurpose('project')}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              purpose === 'project' 
                ? 'bg-accent-blue text-white shadow-glow-blue-sm' 
                : 'text-muted-foreground hover:bg-bg-glass-heavy'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Fund Project
          </button>
          <button 
            onClick={() => setPurpose('creator')}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              purpose === 'creator' 
                ? 'bg-accent-gold text-black shadow-glow-gold-sm' 
                : 'text-muted-foreground hover:bg-bg-glass-heavy'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            Support Creator
          </button>
        </div>

        {/* AMOUNT SELECTOR */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Amount (ZAR)</label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => { setAmount(amt); setCustomAmount(""); }}
                className={`py-3 rounded-xl border text-[12px] font-bold font-mono transition-all ${
                  amount === amt && !customAmount 
                    ? 'border-foreground text-foreground bg-bg-glass-heavy' 
                    : 'border-border-glass text-muted-foreground hover:bg-bg-glass'
                }`}
              >
                R{amt}
              </button>
            ))}
          </div>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
            <input 
              type="number"
              placeholder="Enter Custom Amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-bg-glass border border-border-glass rounded-xl py-4 pl-12 pr-4 text-sm font-mono text-foreground focus:outline-none focus:border-accent-blue transition-all"
            />
          </div>
        </div>

        {/* EMAIL (Required by Paystack) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contributor Email</label>
          <input 
            type="email"
            placeholder="investigator@intelligence.sa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bg-glass border border-border-glass rounded-xl py-4 px-4 text-sm font-mono text-foreground focus:outline-none focus:border-accent-blue transition-all"
          />
        </div>

        {/* PAYSTACK BUTTON */}
        <PaystackButton 
          {...componentProps} 
          disabled={!email || (!amount && !customAmount)}
          className="w-full py-5 bg-foreground text-background rounded-xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-accent-crimson hover:text-white transition-all shadow-button-inset disabled:opacity-20 disabled:cursor-not-allowed group"
        />
        
        <div className="flex items-center justify-center gap-2 pt-2">
          <ShieldCheck className="w-3 h-3 text-muted-foreground/20" />
          <p className="text-[8px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">AES-256 Secure Terminal | Paystack Encrypted</p>
        </div>
      </div>
    </div>
  );
};
