"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, UploadCloud, CheckCircle2, ShieldAlert } from "lucide-react";
import { submitCorroboration } from "@/lib/corroboration-actions";

interface CorroborationModalProps {
  targetId: string;
  targetTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CorroborationModal({ targetId, targetTitle, isOpen, onClose }: CorroborationModalProps) {
  const [narrative, setNarrative] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async () => {
    if (!narrative.trim()) return;
    setIsSubmitting(true);
    try {
        await submitCorroboration({ targetId, narrative });
        setIsComplete(true);
    } catch (e) {
        console.error(e);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-background border border-border-glass rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-border-glass flex items-center justify-between bg-bg-glass-heavy">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent-crimson/10 rounded-2xl border border-accent-crimson/20">
                        <ShieldCheck className="w-6 h-6 text-accent-crimson" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-tight">Citizen Corroboration</h2>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">ZKP-Secured Evidence Uplink</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            <div className="p-10">
                {!isComplete ? (
                    <div className="space-y-8">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <span className="text-[9px] font-black text-accent-blue uppercase tracking-widest block mb-1">Targeting Record</span>
                            <h3 className="text-[14px] font-bold">{targetTitle}</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground block">Intelligence Narrative</label>
                                <textarea 
                                    value={narrative}
                                    onChange={(e) => setNarrative(e.target.value)}
                                    placeholder="Provide additional context, witness testimony, or forensic clues..."
                                    className="w-full bg-bg-glass-heavy border border-border-glass rounded-2xl px-6 py-4 text-[13px] h-32 focus:border-accent-crimson/40 transition-all outline-none"
                                />
                            </div>

                            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-border-glass rounded-3xl group hover:border-accent-crimson/20 transition-all cursor-pointer">
                                <UploadCloud className="w-8 h-8 text-muted-foreground mb-4 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-bold uppercase tracking-widest">Attach Forensic Assets</span>
                                <span className="text-[9px] text-muted-foreground/60 mt-2">PGP Encrypted // Metadata Stripped</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border-glass flex gap-4">
                            <div className="flex items-center gap-3 p-4 bg-accent-gold/5 border border-accent-gold/10 rounded-xl flex-1">
                                <ShieldAlert className="w-4 h-4 text-accent-gold" />
                                <p className="text-[10px] text-accent-gold/80 font-medium leading-tight">
                                    Your IP and metadata are discarded before ingestion.
                                </p>
                            </div>
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-10 py-4 bg-accent-crimson text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-glow-crimson"
                            >
                                {isSubmitting ? "GENERATING_PROOF..." : "Initiate Uplink"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-accent-blue/20"
                        >
                            <CheckCircle2 className="w-10 h-10 text-accent-blue" />
                        </motion.div>
                        <h3 className="text-3xl font-bold tracking-tighter uppercase mb-4">Uplink Successful</h3>
                        <p className="text-sm text-muted-foreground mb-10 max-w-sm mx-auto italic">
                            Your contribution has been hashed and queued for agentic validation.
                        </p>
                        <button 
                            onClick={onClose}
                            className="px-12 py-4 bg-bg-glass border border-border-glass rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-bg-glass-heavy transition-all"
                        >
                            Close Gate
                        </button>
                    </div>
                )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
