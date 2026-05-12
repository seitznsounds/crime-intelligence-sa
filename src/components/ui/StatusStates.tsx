"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  ShieldAlert, 
  AlertCircle, 
  RotateCcw, 
  ChevronRight, 
  SearchX,
  Database,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon = <Database className="w-10 h-10 text-muted-foreground/20" />,
  className 
}: StateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col items-center justify-center py-20 px-6 text-center glass-card border-dashed border-border-glass bg-bg-glass-heavy/50", className)}
    >
      <div className="w-20 h-20 bg-bg-glass rounded-3xl flex items-center justify-center mb-8 border border-border-glass">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 uppercase tracking-widest">{title}</h3>
      <p className="text-[13px] text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-wide opacity-60">
        {description}
      </p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="flex items-center gap-3 px-8 py-3.5 bg-bg-glass border border-border-glass rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all group"
        >
          {actionLabel} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </motion.div>
  );
}

export function ErrorState({ 
  title = "Intelligence Link Failure", 
  description = "Encryption handshake failed or database connection was severed. Tactical reset required.", 
  actionLabel = "Retry Sync Protocol", 
  onAction = () => window.location.reload(),
  className 
}: StateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex flex-col items-center justify-center py-20 px-6 text-center glass-card border-accent-crimson/20 bg-accent-crimson/[0.02]", className)}
    >
      <div className="w-20 h-20 bg-accent-crimson/10 rounded-3xl flex items-center justify-center mb-8 border border-accent-crimson/20 shadow-glow-crimson">
        <ShieldAlert className="w-10 h-10 text-accent-crimson" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-accent-crimson mb-3 uppercase tracking-widest">{title}</h3>
      <p className="text-[13px] text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed uppercase tracking-wide">
        {description}
      </p>
      <button 
        onClick={onAction}
        className="flex items-center gap-3 px-8 py-3.5 bg-accent-crimson text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-glow-crimson"
      >
        <RotateCcw className="w-4 h-4" /> {actionLabel}
      </button>
    </motion.div>
  );
}

export function IntelligenceNull({ className }: { className?: string }) {
  return (
    <EmptyState 
      title="Intelligence Null"
      description="No actionable records found in this sector. Data backfill may be required for historical volumes."
      icon={<SearchX className="w-10 h-10 text-accent-gold/40" />}
      className={className}
    />
  );
}
