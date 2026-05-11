"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UploadCloud, Lock, FileText, MapPin, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { id: 1, title: "Categorization", icon: <FileText className="w-4 h-4" /> },
    { id: 2, title: "Evidence Drop", icon: <UploadCloud className="w-4 h-4" /> },
    { id: 3, title: "Location", icon: <MapPin className="w-4 h-4" /> },
    { id: 4, title: "Submission", icon: <Lock className="w-4 h-4" /> },
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const submitReport = async () => {
    setIsSubmitting(true);
    // Simulate "Encryption Protocol"
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center py-20 px-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ff3b3005,transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-2xl relative z-10"
      >
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-crimson/5 border border-accent-crimson/10 mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-crimson" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent-crimson">Secure Evidence Uplink</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mb-4">Report Corruption.</h1>
          <p className="text-sm text-white/40 font-light max-w-md mx-auto">
            Your identity is protected by multi-stage encryption. All metadata is stripped from uploaded evidence.
          </p>
        </header>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-12 px-4 relative">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[1px] bg-white/5" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${step >= s.id ? 'bg-accent-crimson border-accent-crimson text-white shadow-glow' : 'bg-black border-white/10 text-white/20'}`}>
                {s.icon}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-white' : 'text-white/20'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="glass-card p-10 bg-white/[0.01] border-white/5 relative min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Incident Category</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-crimson/50 text-white/60">
                        <option>SAPS Corruption</option>
                        <option>Political Bribery</option>
                        <option>Corporate Fraud</option>
                        <option>Organized Crime Activity</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block mb-3">Incident Summary</label>
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-accent-crimson/50 h-32 text-white/60"
                        placeholder="Provide a clear, high-fidelity summary of the event..."
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/10 rounded-2xl group hover:border-accent-crimson/30 transition-all bg-white/[0.01]">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-white/30 group-hover:text-accent-crimson" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-2">Drop Evidence Files</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Images, PDFs, or Video (Max 50MB)</p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="p-10 border border-white/10 rounded-2xl bg-white/[0.02] flex flex-col items-center gap-6">
                      <MapPin className="w-10 h-10 text-accent-blue opacity-50" />
                      <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-widest mb-2">Location Tagging</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-6">Attach a precise GPS coordinate to the report</p>
                        <button className="px-6 py-3 bg-accent-blue/10 border border-accent-blue/20 rounded-xl text-accent-blue text-[10px] font-bold uppercase tracking-widest hover:bg-accent-blue/20 transition-all">
                          Detect Current Position
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8">
                    <div className="p-6 bg-accent-gold/5 border border-accent-gold/20 rounded-2xl flex gap-4">
                      <AlertCircle className="w-5 h-5 text-accent-gold shrink-0" />
                      <p className="text-[11px] text-accent-gold/80 leading-relaxed font-medium">
                        BY SUBMITTING, YOU CONFIRM THAT THIS INFORMATION IS ACCURATE TO THE BEST OF YOUR KNOWLEDGE. FALSE REPORTING IS A CRIMINAL OFFENSE.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">ENCRYPTION_STRENGTH</span>
                        <span className="text-[10px] font-mono text-accent-blue">AES-256-GCM</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-white/5">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">ANONYMITY_LEVEL</span>
                        <span className="text-[10px] font-mono text-accent-gold font-bold">TOTAL_REDACTION</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-20 h-20 bg-accent-blue/10 rounded-full flex items-center justify-center mb-8 border border-accent-blue/20">
                  <CheckCircle2 className="w-10 h-10 text-accent-blue" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-4">Uplink Successful.</h2>
                <p className="text-sm text-white/40 font-light mb-10 max-w-xs mx-auto">
                  Your evidence has been securely stored. Case ID: <span className="font-mono text-white/80">#EV_772A_X</span>
                </p>
                <button 
                  onClick={() => setIsComplete(false) || setStep(1)}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Return to Portal
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isComplete && (
            <div className="mt-12 pt-8 border-t border-white/5 flex justify-between">
              <button 
                onClick={handleBack}
                disabled={step === 1}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'text-white/40 hover:text-white'}`}
              >
                Back_Sector
              </button>
              
              {step < 4 ? (
                <button 
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Next Step <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  onClick={submitReport}
                  disabled={isSubmitting}
                  className="relative px-10 py-3 bg-accent-crimson text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-glow overflow-hidden"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <Activity className="w-3 h-3 animate-spin" /> ENCRYPTING...
                    </span>
                  ) : (
                    "Initiate Anonymous Uplink"
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
