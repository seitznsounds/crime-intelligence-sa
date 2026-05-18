"use client";

import { useState } from "react";
import CorroborationModal from "@/components/ui/CorroborationModal";
import { ShieldCheck } from "lucide-react";

export default function CorroborationTrigger({ targetId, targetTitle }: { targetId: string, targetTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-accent-gold hover:text-black transition-all flex items-center justify-center gap-2"
      >
        <ShieldCheck className="w-3.5 h-3.5" /> Corroborate Evidence
      </button>
      
      <CorroborationModal 
        targetId={targetId} 
        targetTitle={targetTitle} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
