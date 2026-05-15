"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, AlertTriangle, Fingerprint, FileText, Activity } from 'lucide-react';
import { Timeline } from './Timeline';
import { getDeepIntel } from '@/app/network/actions';

interface IntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string | null;
  entityType: string;
  entityName: string;
  baseRisk: number;
}

export function IntelligenceDrawer({ isOpen, onClose, entityId, entityType, entityName, baseRisk }: IntelligenceDrawerProps) {
  const [intelData, setIntelData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && entityId) {
      const fetchIntel = async () => {
        setLoading(true);
        // Call a server action to read the deep intel from the JSON files
        const data = await getDeepIntel(entityId);
        setIntelData(data);
        setLoading(false);
      };
      fetchIntel();
    }
  }, [isOpen, entityId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] lg:w-[500px] glass-card border-l border-border-glass bg-bg-glass-heavy/90 backdrop-blur-2xl z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-border-glass">
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-crimson/10 text-accent-crimson text-[10px] font-bold tracking-widest uppercase rounded border border-accent-crimson/20 mb-3">
                  <Fingerprint className="w-3 h-3" /> Entity_Profile_{entityId?.substring(0, 8)}
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase text-foreground leading-none mb-1 font-serif">
                  {entityName}
                </h2>
                <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> Class: {entityType}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-bg-glass rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Risk & Status */}
              <div className="p-5 bg-background/50 border border-border-glass rounded-xl shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Risk Exposure Index</span>
                  <span className="text-accent-crimson font-mono font-bold">{baseRisk}%</span>
                </div>
                <div className="h-2 bg-bg-glass-heavy rounded-full overflow-hidden mb-4">
                  <motion.div 
                    className="h-full bg-accent-crimson shadow-glow-crimson"
                    initial={{ width: 0 }}
                    animate={{ width: `${baseRisk}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                {intelData?.status && (
                  <p className="text-[11px] text-foreground font-mono bg-accent-crimson/10 px-3 py-2 rounded-lg border border-accent-crimson/20">
                    <span className="text-accent-crimson font-bold">STATUS:</span> {intelData.status}
                  </p>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Activity className="w-8 h-8 text-accent-blue animate-pulse" />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Decrypting Classified Files...</span>
                </div>
              ) : (
                <>
                  {/* Executive Summary */}
                  {intelData?.summary && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue border-b border-border-glass pb-2">Executive Summary</h3>
                      <p className="text-sm text-foreground/90 leading-relaxed font-sans">
                        {intelData.summary}
                      </p>
                    </div>
                  )}

                  {/* Operational Narrative */}
                  {intelData?.narrative && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-gold border-b border-border-glass pb-2">Operational Intelligence</h3>
                      <div className="prose prose-sm prose-invert max-w-none text-muted-foreground">
                        {/* Assuming narrative could be mapped if it's an array, or just rendered if string */}
                        {typeof intelData.narrative === 'string' 
                          ? <p className="leading-relaxed">{intelData.narrative}</p> 
                          : intelData.narrative.map((para: string, idx: number) => <p key={idx} className="leading-relaxed mb-3">{para}</p>)}
                      </div>
                    </div>
                  )}

                  {/* Known Connections Details */}
                  {intelData?.connections && intelData.connections.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border-glass pb-2">Deep Associates Matrix</h3>
                      <div className="grid gap-2">
                        {intelData.connections.map((conn: any, i: number) => (
                          <div key={i} className="flex flex-col p-3 bg-bg-glass border border-border-glass rounded-lg hover:border-accent-blue/50 transition-colors cursor-pointer">
                            <span className="text-[11px] font-bold text-foreground">{conn.name}</span>
                            <span className="text-[10px] font-mono text-muted-foreground mt-1">{conn.context}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  {intelData?.timeline && intelData.timeline.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border-glass pb-2 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> Chronological Analysis
                      </h3>
                      <Timeline events={intelData.timeline} />
                    </div>
                  )}

                  {/* Source Citations */}
                  {intelData?.sources && intelData.sources.length > 0 && (
                    <div className="space-y-3 pt-6 border-t border-border-glass">
                      <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        <FileText className="w-3 h-3" /> Intelligence Sources
                      </h3>
                      <ul className="list-disc list-inside text-[10px] font-mono text-muted-foreground/60 space-y-1 pl-2">
                        {intelData.sources.map((src: string, i: number) => (
                          <li key={i}>{src}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-border-glass bg-background/80">
               <button className="w-full py-4 bg-foreground text-background text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent-crimson hover:text-white transition-all shadow-lg hover:shadow-glow-crimson flex justify-center items-center gap-2">
                 <FileText className="w-4 h-4" /> Open Full Dossier
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
