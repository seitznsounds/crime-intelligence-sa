'use client';

import React from 'react';
import { 
  Radio, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  ExternalLink,
  Users,
  Scale
} from 'lucide-react';

const FEED_EVENTS = [
  {
    time: "14:30 SAST",
    title: "Portfolio Committee on Justice",
    desc: "Deliberations on the Protected Disclosures Amendment Bill [B14-2026].",
    type: "LIVE",
    participants: "DOJ&CD, SIU, NACAC",
    link: "https://www.parliament.gov.za/live"
  },
  {
    time: "Yesterday",
    title: "Budget Vote 25: Justice",
    desc: "National Treasury confirms R1.2 Bn allocation for OPI transitional infrastructure.",
    type: "RECORDED",
    participants: "Minister M. Kubayi",
    link: "#"
  },
  {
    time: "May 10, 2026",
    title: "SAPS Accountability Hearing",
    desc: "Madlanga Commission subpoenas former National Commissioner regarding procurement cartels.",
    type: "DOCKET",
    participants: "Gen. Sithole (Ret.)",
    link: "#"
  },
  {
    time: "Upcoming: Friday",
    title: "Whistleblower Protection Summit",
    desc: "Drafting of the 'Judge-Led Protector' appointment criteria.",
    type: "SCHEDULED",
    participants: "Chief Justice, PPLAAF",
    link: "#"
  }
];

export const ReformFeed = () => {
  return (
    <div className="glass-card p-6 border border-white/10 rounded-xl space-y-6 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-crimson">
            <Radio className="w-5 h-5 animate-pulse" />
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Reform Intelligence Feed</h3>
          </div>
          <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest leading-tight">Live Legislative & Judicial Ticker</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em]">Source: Parliamentary Monitor</div>
        </div>
      </div>

      <div className="space-y-4">
        {FEED_EVENTS.map((event, i) => (
          <div key={i} className="group relative pl-4 border-l-2 border-white/5 hover:border-accent-crimson transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-1">
              <span className={`text-[8px] font-black uppercase tracking-widest ${
                event.type === 'LIVE' ? 'text-accent-crimson animate-pulse' : 'text-white/30'
              }`}>
                {event.type} // {event.time}
              </span>
              <ExternalLink className="w-3 h-3 text-white/10 group-hover:text-white transition-colors" />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white/90 group-hover:text-accent-crimson transition-colors">{event.title}</h4>
              <p className="text-[10px] text-white/50 leading-relaxed">{event.desc}</p>
              
              <div className="flex items-center gap-4 text-[8px] font-bold text-white/30 uppercase">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{event.participants}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  <span>Impact: High</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1,2,3].map((u) => (
            <div key={u} className="w-6 h-6 rounded-full border border-black bg-white/10 flex items-center justify-center">
              <Users className="w-3 h-3 text-white/40" />
            </div>
          ))}
          <div className="w-6 h-6 rounded-full border border-black bg-accent-crimson flex items-center justify-center text-[8px] font-black">
            +42
          </div>
        </div>
        <span className="text-[9px] text-white/30 font-mono uppercase font-bold">Analysts Monitoring Live Feed</span>
      </div>
    </div>
  );
};
