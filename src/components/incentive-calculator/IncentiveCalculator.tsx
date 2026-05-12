'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Scale, 
  ShieldCheck, 
  Info,
  AlertTriangle,
  Coins
} from 'lucide-react';

const FEAR_MULTIPLIER = 0.62; // HSRC 2026 Social Norms survey
const ROCOSN_INDEX_BASE = 0.28; // Risk of Community and Social Neglect (Mthente 2024)
const REWARD_MIN_PCT = 0.15;
const REWARD_MAX_PCT = 0.25;

export default function IncentiveCalculator() {
  const [caseValue, setCaseValue] = useState<number>(100000);
  const [deptRisk, setDeptRisk] = useState<number>(0.5); // 0-1
  const [empSecurity, setEmpSecurity] = useState<number>(0.5); // 0-1
  const [infiltrationLevel, setInfiltrationLevel] = useState<number>(0.3); // 0-1 (SAPS/Cartel nexus)
  const [wpIntegrity, setWpIntegrity] = useState<number>(0.4); // 0-1 (Section 7 Reporting Integrity)

  const results = useMemo(() => {
    const grossMin = caseValue * REWARD_MIN_PCT;
    const grossMax = caseValue * REWARD_MAX_PCT;
    const avgGross = (grossMin + grossMax) / 2;

    // Fear Penalty: scales with risk, infiltration, and inversely with security + WP Integrity loss
    const wpRiskFactor = (1 - wpIntegrity) * 2; // Section 7 reporting loop multiplier
    const fearPenalty = avgGross * FEAR_MULTIPLIER * (deptRisk + infiltrationLevel + wpRiskFactor) / Math.max(0.1, empSecurity);
    
    // Social Ostracism Penalty (RoCoSN Index)
    const socialPenalty = avgGross * ROCOSN_INDEX_BASE * (1 + (1 - empSecurity));

    const riskAdjusted = avgGross - fearPenalty - socialPenalty;
    const score = Math.max(0, Math.min(100, (riskAdjusted / avgGross) * 100));

    let verdict = "CRITICAL RISK: Retaliation risk and social neglect outweigh financial incentive.";
    let color = "text-red-400";

    if (wpIntegrity < 0.2) {
      verdict = "CRITICAL REPORTING VOID: Section 7 of Act 112 (1998) requires reporting to investigators who may be syndicate-linked. DO NOT PROCEED.";
      color = "text-red-600 animate-pulse";
    } else if (score > 35) {
      verdict = "HIGH RISK: Secure anonymity and relocation funding are mandatory.";
      color = "text-orange-400";
    }
    if (score > 65) {
      verdict = "VIABLE: Financial incentive provides a sufficient security and transition buffer.";
      color = "text-green-400";
    }

    return {
      grossMin,
      grossMax,
      avgGross,
      fearPenalty,
      socialPenalty,
      riskAdjusted,
      score,
      verdict,
      color
    };
  }, [caseValue, deptRisk, empSecurity, infiltrationLevel]);

  return (
    <div className="glass-card p-8 border border-white/10 rounded-xl space-y-8 bg-black/40 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-gold/20 rounded-lg">
            <Calculator className="w-6 h-6 text-accent-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white uppercase">Whistleblower Incentive Calculator</h3>
            <p className="text-xs text-white/50 font-mono italic">Beta v1.0 — Logic based on Zondo Reforms & HSRC Social Norms</p>
          </div>
        </div>
        <div className={`px-4 py-1 rounded-full border border-current bg-black/50 text-xs font-bold tracking-widest uppercase ${results.color}`}>
          Score: {results.score.toFixed(0)}/100
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* INPUTS */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-white/70 uppercase flex items-center gap-2">
                <Coins className="w-4 h-4" /> Case Value (ZAR)
              </label>
              <span className="text-xl font-mono text-accent-gold">R {caseValue.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="10000000" 
              step="10000"
              value={caseValue}
              onChange={(e) => setCaseValue(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-gold"
            />
            <p className="text-[10px] text-white/30 italic">Estimated value of the corruption, tender, or stolen asset.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-white/70 uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Dept Risk Level
              </label>
              <span className="text-sm font-mono text-white/90">{(deptRisk * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={deptRisk}
              onChange={(e) => setDeptRisk(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-crimson"
            />
            <p className="text-[10px] text-white/30 italic">Retaliation history and accountability score of the implicated department.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-white/70 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent-blue" /> Employment Security
              </label>
              <span className="text-sm font-mono text-white/90">{(empSecurity * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={empSecurity}
              onChange={(e) => setEmpSecurity(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue"
            />
            <p className="text-[10px] text-white/30 italic">Vulnerability score based on tenure, contract type, and seniority.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-white/70 uppercase flex items-center gap-2">
                <Users className="w-4 h-4 text-accent-gold" /> Institutional Infiltration
              </label>
              <span className="text-sm font-mono text-white/90">{(infiltrationLevel * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={infiltrationLevel}
              onChange={(e) => setInfiltrationLevel(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-gold"
            />
            <p className="text-[10px] text-white/30 italic">Estimated level of criminal infiltration within the target department (e.g., SAPS 'Big Five' Cartel nexus).</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-white/70 uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-accent-crimson" /> Witness Protection Integrity
              </label>
              <span className="text-sm font-mono text-white/90">{(wpIntegrity * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1"
              value={wpIntegrity}
              onChange={(e) => setWpIntegrity(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-crimson"
            />
            <p className="text-[10px] text-white/30 italic text-accent-crimson">Vulnerability Audit (Act 112, 1998): High risk if reporting to investigating officers (Section 7).</p>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Scale className="w-24 h-24 text-white" />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white/50 uppercase">Potential Reward (15-25%)</span>
              <span className="text-sm font-mono text-accent-gold">
                R {results.grossMin.toLocaleString()} - R {results.grossMax.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-red-400">
              <span className="text-xs font-bold uppercase flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" /> Retaliation Offset (Fear x Risk)
              </span>
              <span className="text-sm font-mono">-R {results.fearPenalty.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="flex justify-between items-center text-red-400/70">
              <span className="text-xs font-bold uppercase flex items-center gap-2">
                <TrendingDown className="w-3 h-3" /> Ostracism Penalty (RoCoSN Index)
              </span>
              <span className="text-sm font-mono">-R {results.socialPenalty.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="pt-4 border-t border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-white uppercase tracking-tighter">Risk-Adjusted Incentive</span>
                <span className={`text-xl font-mono font-bold ${results.color}`}>
                  R {results.riskAdjusted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={results.verdict}
            className={`p-4 rounded-lg bg-black/40 border border-white/10 text-xs font-bold leading-relaxed ${results.color}`}
          >
            {results.verdict}
          </motion.div>

          <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg">
            <Info className="w-4 h-4 text-accent-blue flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/50 leading-tight">
              Calculations assume the Zondo Commission's recommendation for financial incentives (15-25%) is implemented. 
              The <span className="text-white">Fear Offset</span> uses HSRC's 62% retaliation risk finding, weighted against 
              environmental factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
