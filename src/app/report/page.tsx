"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UploadCloud, Lock, FileText, MapPin, ChevronRight, AlertCircle, CheckCircle2, Activity, ShieldAlert, Fingerprint } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { id: 1, title: "Category", icon: <FileText className="w-4 h-4" /> },
    { id: 2, title: "Evidence", icon: <UploadCloud className="w-4 h-4" /> },
    { id: 3, title: "Location", icon: <MapPin className="w-4 h-4" /> },
    { id: 4, title: "Finalize", icon: <Lock className="w-4 h-4" /> },
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
    <PageShell
      title="Secure Evidence Uplink"
      subtitle="Your identity is protected by multi-stage encryption. All metadata is stripped from uploaded evidence before ingestion."
      badge="Whistleblower Portal"
      badgeColor="crimson"
      icon={<ShieldCheck className="w-6 h-6 text-accent-crimson" />}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Act", href: "/vote" },
        { label: "Report Corruption", href: "/report" },
      ]}
    >
      <div className="max-w-4xl mx-auto py-10 sm:py-16">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between mb-16 px-4 relative max-w-2xl mx-auto">
          <div className="absolute left-10 right-10 top-5 h-[1px] bg-border-glass" />
          {steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${step >= s.id ? 'bg-accent-crimson border-accent-crimson text-white shadow-glow-crimson' : 'bg-bg-glass border-border-glass text-muted-foreground'}`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 sm:p-12 bg-bg-glass border-border-glass relative min-h-[450px] flex flex-col rounded-3xl">
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
                      <div className="space-y-8">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-4">Investigation Sector</label>
                          <select className="w-full bg-bg-glass-heavy border border-border-glass rounded-2xl px-6 py-4 text-[13px] focus:outline-none focus:border-accent-crimson/40 text-foreground transition-all appearance-none cursor-pointer">
                            <option>SAPS Corruption & Brutality</option>
                            <option>Municipal Tender Fraud</option>
                            <option>Political Bribery & Influence</option>
                            <option>Organized Crime / Syndicate Activity</option>
                            <option>Historical Injustice Recovery</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground block mb-4">Intelligence Narrative</label>
                          <textarea 
                            className="w-full bg-bg-glass-heavy border border-border-glass rounded-2xl px-6 py-4 text-[13px] focus:outline-none focus:border-accent-crimson/40 h-40 text-foreground transition-all placeholder:text-muted-foreground/30 leading-relaxed"
                            placeholder="Provide a clear, high-fidelity narrative of the corruption or crime observed..."
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-border-glass rounded-3xl group hover:border-accent-crimson/30 transition-all bg-bg-glass-heavy cursor-pointer">
                        <div className="w-20 h-20 bg-bg-glass rounded-2xl flex items-center justify-center mb-6 border border-border-glass group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-10 h-10 text-muted-foreground group-hover:text-accent-crimson" />
                        </div>
                        <p className="text-[13px] font-bold uppercase tracking-widest mb-2 text-foreground">Drop Intelligence Assets</p>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">Metadata will be automatically stripped</p>
                        <p className="text-[9px] text-muted-foreground/40 mt-6 font-mono uppercase tracking-widest">Images // PDFs // Logs // Max 100MB</p>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-8">
                        <div className="p-12 border border-border-glass rounded-3xl bg-bg-glass-heavy flex flex-col items-center gap-8 text-center">
                          <div className="p-5 bg-accent-blue/10 rounded-2xl border border-accent-blue/20">
                            <MapPin className="w-12 h-12 text-accent-blue" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold uppercase tracking-widest mb-2 text-foreground">Operational Location</h4>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] leading-relaxed max-w-sm mx-auto mb-8">Attach precise geospatial coordinates to link this incident to the national heatmap.</p>
                            <button className="px-8 py-3.5 bg-accent-blue/10 border border-accent-blue/20 rounded-2xl text-accent-blue text-[11px] font-bold uppercase tracking-widest hover:bg-accent-blue/20 transition-all">
                              Detect Current Coordinates
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-10">
                        <div className="p-6 bg-accent-gold/5 border border-accent-gold/20 rounded-2xl flex gap-5">
                          <AlertCircle className="w-6 h-6 text-accent-gold shrink-0" />
                          <p className="text-[12px] text-accent-gold/80 leading-relaxed font-medium uppercase tracking-tight">
                            By initiating this uplink, you verify that the information is accurate. Crime Intelligence SA utilizes cryptographic hashing to ensure evidence integrity for future legal proceedings.
                          </p>
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: "Encryption Strength", value: "AES-256-GCM", color: "text-accent-blue" },
                            { label: "Anonymity Level", value: "TOTAL_REDACTION", color: "text-accent-gold" },
                            { label: "Routing Latency", value: "48ms", color: "text-muted-foreground/60" }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-3.5 border-b border-border-glass">
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
                              <span className={`text-[11px] font-mono font-bold ${item.color}`}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <div className="w-24 h-24 bg-accent-blue/10 rounded-full flex items-center justify-center mb-8 border border-accent-blue/20 shadow-glow-blue">
                      <CheckCircle2 className="w-12 h-12 text-accent-blue" />
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4 text-foreground">Uplink Secured.</h2>
                    <p className="text-[14px] text-muted-foreground font-light mb-12 max-w-sm mx-auto leading-relaxed">
                      Your intelligence has been successfully ingested into the vault. <br/>Case Identifier: <span className="font-mono text-accent-blue font-bold px-2">#EV_772A_X</span>
                    </p>
                    <button 
                      onClick={() => { setIsComplete(false); setStep(1); }}
                      className="px-10 py-4 bg-bg-glass border border-border-glass rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-bg-glass-heavy transition-all text-foreground"
                    >
                      Return to Portal
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isComplete && (
                <div className="mt-12 pt-10 border-t border-border-glass flex justify-between items-center">
                  <button 
                    onClick={handleBack}
                    disabled={step === 1}
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all ${step === 1 ? 'opacity-0' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Back
                  </button>
                  
                  {step < 4 ? (
                    <button 
                      onClick={handleNext}
                      className="flex items-center gap-3 px-10 py-4 bg-bg-glass border border-border-glass rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-bg-glass-heavy transition-all text-foreground group"
                    >
                      Next Step <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button 
                      onClick={submitReport}
                      disabled={isSubmitting}
                      className="relative px-12 py-4 bg-accent-crimson text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] transition-all shadow-glow-crimson overflow-hidden"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <Activity className="w-4 h-4 animate-spin" /> ENCRYPTING...
                        </span>
                      ) : (
                        "Initiate Secure Uplink"
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Security Info Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-8 border-border-glass bg-bg-glass">
              <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-8 flex items-center gap-3">
                <Lock className="w-4 h-4 text-accent-gold" /> Security Protocols
              </h3>
              <div className="space-y-8">
                {[
                  { icon: <ShieldAlert className="w-5 h-5 text-accent-crimson" />, title: "Metadata Stripping", desc: "Our ingestion engine automatically scrubs EXIF data, GPS tags, and device fingerprints." },
                  { icon: <Fingerprint className="w-5 h-5 text-accent-blue" />, title: "Identity Masking", desc: "No personal data is requested. Your report is linked only to a unique cryptographic hash." },
                  { icon: <Lock className="w-5 h-5 text-accent-gold" />, title: "E2E Encryption", desc: "Assets are encrypted client-side using AES-256 before reaching our secure uplink servers." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest mb-1 text-foreground">{item.title}</h4>
                      <p className="text-[12px] text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 border-accent-crimson/20 bg-accent-crimson/[0.01]">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-4 h-4 text-accent-crimson" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-accent-crimson">Operational Alert</span>
              </div>
              <p className="text-[12px] text-muted-foreground/80 leading-relaxed font-light italic">
                "We do not track IP addresses. We do not store session cookies. Your anonymity is our primary operational priority."
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
